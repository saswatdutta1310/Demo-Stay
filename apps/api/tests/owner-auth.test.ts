import request from "supertest";
import jwt from "jsonwebtoken";
import { app } from "../src/app";
import { env } from "../src/config/env";
import { prisma } from "../src/utils/db";

describe("Owner Auth & Protected Routes", () => {
  let validToken: string;
  let testRoomTypeId: string;

  beforeAll(async () => {
    // Generate valid test token
    validToken = jwt.sign({ role: "owner" }, env.JWT_SECRET, { expiresIn: "1h" });

    // Clean and seed one room type for testing block dates & price rules
    await prisma.blockedDate.deleteMany();
    await prisma.priceRule.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.roomType.deleteMany();

    const room = await prisma.roomType.create({
      data: {
        id: "owner-test-room",
        slug: "owner-test-room",
        name: "Owner Test Suite",
        basePrice: 3000,
        taxPerNight: 300,
        units: 2,
        amenities: JSON.stringify(["Wi-Fi"]),
        images: JSON.stringify(["/test.jpg"])
      }
    });

    testRoomTypeId = room.id;
  });

  afterAll(async () => {
    await prisma.blockedDate.deleteMany();
    await prisma.priceRule.deleteMany();
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.auditLog.deleteMany();
    await prisma.roomType.deleteMany();
    await prisma.$disconnect();
  });

  describe("POST /api/v1/owner/login", () => {
    it("returns JWT on correct PIN", async () => {
      const res = await request(app)
        .post("/api/v1/owner/login")
        .send({ pin: env.OWNER_PIN });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.token).toBeDefined();

      const decoded = jwt.verify(res.body.token, env.JWT_SECRET) as { role: string };
      expect(decoded.role).toBe("owner");
    });

    it("rejects invalid PIN with 401", async () => {
      const res = await request(app)
        .post("/api/v1/owner/login")
        .send({ pin: "WRONG_PIN" });

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid PIN/i);
    });
  });

  describe("Protected Endpoints - Token Rejection", () => {
    it("rejects GET /api/v1/owner/bookings with 401 when no token is provided", async () => {
      const res = await request(app).get("/api/v1/owner/bookings");
      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/token required/i);
    });

    it("rejects GET /api/v1/owner/stats with 401 when invalid token is provided", async () => {
      const res = await request(app)
        .get("/api/v1/owner/stats")
        .set("Authorization", "Bearer invalid-token-string");

      expect(res.status).toBe(401);
      expect(res.body.success).toBe(false);
      expect(res.body.message).toMatch(/Invalid or expired/i);
    });
  });

  describe("Protected Endpoints - Functionality with Valid Token", () => {
    it("allows GET /api/v1/owner/stats with valid token", async () => {
      const res = await request(app)
        .get("/api/v1/owner/stats")
        .set("Authorization", `Bearer ${validToken}`);

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data).toHaveProperty("todayRevenue");
      expect(res.body.data).toHaveProperty("todayBookingCount");
      expect(res.body.data).toHaveProperty("occupancyRate");
    });

    it("creates BlockedDate and writes AuditLog entry", async () => {
      const res = await request(app)
        .post("/api/v1/owner/block-dates")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          roomTypeId: testRoomTypeId,
          startDate: "2026-12-15",
          endDate: "2026-12-18",
          reason: "Renovation"
        });

      expect(res.status).toBe(201);
      expect(res.body.success).toBe(true);
      expect(res.body.data.roomTypeId).toBe(testRoomTypeId);

      // Verify AuditLog was recorded
      const auditLog = await prisma.auditLog.findFirst({
        where: {
          action: "BLOCK_DATES",
          entityType: "BlockedDate",
          entityId: res.body.data.id
        }
      });
      expect(auditLog).toBeDefined();
    });

    it("creates PriceRule and writes AuditLog entry", async () => {
      const res = await request(app)
        .patch("/api/v1/owner/prices")
        .set("Authorization", `Bearer ${validToken}`)
        .send({
          roomTypeId: testRoomTypeId,
          startDate: "2026-12-24",
          endDate: "2026-12-26",
          price: 4500,
          note: "Holiday peak pricing"
        });

      expect(res.status).toBe(200);
      expect(res.body.success).toBe(true);
      expect(res.body.data.price).toBe(4500);

      // Verify AuditLog was recorded
      const auditLog = await prisma.auditLog.findFirst({
        where: {
          action: "UPDATE_PRICE_RULE",
          entityType: "PriceRule",
          entityId: res.body.data.id
        }
      });
      expect(auditLog).toBeDefined();
    });
  });
});
