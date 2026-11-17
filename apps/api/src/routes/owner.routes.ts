import { Router } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { prisma } from "../utils/db";
import { env } from "../config/env";
import { requireOwnerAuth, AuthenticatedOwnerRequest } from "../middlewares/auth.middleware";
import { SSEStreamService } from "../services/sse.service";

const router = Router();

// Validation Schemas
const loginSchema = z.object({
  pin: z.string().min(1, "PIN is required")
});

const blockDatesSchema = z.object({
  roomTypeId: z.string().min(1, "roomTypeId is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid startDate"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid endDate"),
  reason: z.string().optional()
});

const updatePriceRuleSchema = z.object({
  roomTypeId: z.string().min(1, "roomTypeId is required"),
  startDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid startDate"),
  endDate: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid endDate"),
  price: z.number().positive("Price must be positive"),
  note: z.string().optional()
});

/**
 * Helper to record audit logs for owner actions
 */
async function recordAuditLog(action: string, entityType: string, entityId: string, details?: unknown) {
  try {
    await prisma.auditLog.create({
      data: {
        action,
        entityType,
        entityId,
        performedBy: "owner",
        details: details ? JSON.stringify(details) : null
      }
    });
  } catch (err) {
    console.error("Failed to write audit log:", err);
  }
}

/**
 * POST /api/v1/owner/login
 * Owner PIN login returning short-lived JWT (e.g. 12 hours)
 */
router.post("/login", (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    return res.status(400).json({
      success: false,
      message: parsed.error.issues.map((i) => i.message).join(", ")
    });
  }

  if (parsed.data.pin !== env.OWNER_PIN) {
    return res.status(401).json({
      success: false,
      message: "Invalid PIN"
    });
  }

  const token = jwt.sign({ role: "owner" }, env.JWT_SECRET, { expiresIn: "12h" });

  res.json({
    success: true,
    token,
    expiresIn: "12h"
  });
});

/**
 * GET /api/v1/owner/stream (SSE)
 * Streams real-time events to owner dashboard (supports token in query param for EventSource compatibility)
 */
router.get("/stream", (req, res) => {
  const token = (req.query.token as string) || req.headers.authorization?.replace("Bearer ", "");

  if (!token) {
    return res.status(401).json({ success: false, message: "Authorization token required" });
  }

  try {
    jwt.verify(token, env.JWT_SECRET);
  } catch {
    return res.status(401).json({ success: false, message: "Invalid or expired authorization token" });
  }

  // Set SSE headers
  res.writeHead(200, {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache",
    Connection: "keep-alive"
  });
  res.write("data: {\"type\":\"connected\"}\n\n");

  SSEStreamService.addClient(res);

  // Keep-alive heartbeat every 20 seconds
  const heartbeat = setInterval(() => {
    try {
      res.write("data: {\"type\":\"keepalive\"}\n\n");
    } catch {
      clearInterval(heartbeat);
    }
  }, 20000);

  req.on("close", () => {
    clearInterval(heartbeat);
    SSEStreamService.removeClient(res);
  });
});

// All routes below require Bearer JWT Authentication
router.use(requireOwnerAuth);

/**
 * GET /api/v1/owner/bookings
 * Returns bookings with optional filtering by status
 */
router.get("/bookings", async (req: AuthenticatedOwnerRequest, res, next) => {
  try {
    const { status, limit = "50" } = req.query as { status?: string; limit?: string };

    const where: { status?: string } = {};
    if (status && status !== "ALL") {
      where.status = status;
    }

    const bookings = await prisma.booking.findMany({
      where,
      include: {
        roomType: true,
        guest: true,
        payments: true
      },
      orderBy: { createdAt: "desc" },
      take: parseInt(limit, 10) || 50
    });

    res.json({
      success: true,
      data: bookings
    });
  } catch (err) {
    next(err);
  }
});

/**
 * GET /api/v1/owner/stats
 * Today's revenue, booking count, and occupancy
 */
router.get("/stats", async (req: AuthenticatedOwnerRequest, res, next) => {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const endOfToday = new Date();
    endOfToday.setHours(23, 59, 59, 999);

    // 1. Confirmed bookings created today or payments received today
    const todayPayments = await prisma.payment.findMany({
      where: {
        status: "PAID",
        createdAt: { gte: startOfToday, lte: endOfToday }
      }
    });

    const todayRevenue = todayPayments.reduce((acc, p) => acc + p.amount, 0);

    // 2. Count of confirmed bookings today
    const todayBookingCount = await prisma.booking.count({
      where: {
        status: { in: ["CONFIRMED", "PENDING", "HOLD"] },
        createdAt: { gte: startOfToday, lte: endOfToday }
      }
    });

    // 3. Occupancy calculation for today
    const totalRoomsCount = await prisma.roomType.aggregate({
      _sum: { units: true }
    });
    const totalUnits = totalRoomsCount._sum.units || 8;

    const occupiedUnitsCount = await prisma.booking.count({
      where: {
        status: "CONFIRMED",
        checkIn: { lte: endOfToday },
        checkOut: { gt: startOfToday }
      }
    });

    const occupancyRate = totalUnits > 0 ? Math.round((occupiedUnitsCount / totalUnits) * 100) : 0;

    res.json({
      success: true,
      data: {
        todayRevenue,
        todayBookingCount,
        occupiedUnits: occupiedUnitsCount,
        totalUnits,
        occupancyRate
      }
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/owner/block-dates
 * Blocks room inventory for maintenance/owner use + AuditLog
 */
router.post("/block-dates", async (req: AuthenticatedOwnerRequest, res, next) => {
  try {
    const parsed = blockDatesSchema.parse(req.body);
    const startDate = new Date(parsed.startDate);
    const endDate = new Date(parsed.endDate);

    const blocked = await prisma.blockedDate.create({
      data: {
        roomTypeId: parsed.roomTypeId,
        startDate,
        endDate,
        reason: parsed.reason || "Owner Block"
      }
    });

    await recordAuditLog("BLOCK_DATES", "BlockedDate", blocked.id, {
      roomTypeId: parsed.roomTypeId,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      reason: parsed.reason
    });

    res.status(201).json({
      success: true,
      data: blocked
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors.map((e) => e.message).join(", ")
      });
    }
    next(err);
  }
});

/**
 * PATCH /api/v1/owner/prices
 * Create or update PriceRule overrides + AuditLog
 */
router.patch("/prices", async (req: AuthenticatedOwnerRequest, res, next) => {
  try {
    const parsed = updatePriceRuleSchema.parse(req.body);
    const startDate = new Date(parsed.startDate);
    const endDate = new Date(parsed.endDate);

    const priceRule = await prisma.priceRule.create({
      data: {
        roomTypeId: parsed.roomTypeId,
        startDate,
        endDate,
        price: parsed.price,
        note: parsed.note
      }
    });

    await recordAuditLog("UPDATE_PRICE_RULE", "PriceRule", priceRule.id, {
      roomTypeId: parsed.roomTypeId,
      startDate: parsed.startDate,
      endDate: parsed.endDate,
      price: parsed.price,
      note: parsed.note
    });

    res.json({
      success: true,
      data: priceRule
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors.map((e) => e.message).join(", ")
      });
    }
    next(err);
  }
});

export default router;
