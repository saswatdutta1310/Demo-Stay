import { Router } from "express";
import { prisma } from "../utils/db";
import { EventsService } from "../services/events.service";
import { env } from "../config/env";

const router = Router();

// Simple demo PIN auth
router.use((req, res, next) => {
  const pin = req.headers["x-owner-pin"];
  if (pin !== env.OWNER_PIN) {
    return res.status(401).json({ success: false, message: "Invalid Owner PIN" });
  }
  next();
});

router.get("/feed", (req, res) => {
  res.json({ success: true, data: EventsService.getRecentEvents() });
});

router.get("/bookings", async (req, res, next) => {
  try {
    const bookings = await prisma.booking.findMany({
      include: { room: true, guest: true, payments: true },
      orderBy: { createdAt: "desc" }
    });
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
});

export default router;
