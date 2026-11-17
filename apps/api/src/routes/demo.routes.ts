import { Router } from "express";
import { prisma } from "../utils/db";
import { BookingStatus } from "@hotel-demo/shared";
import { env } from "../config/env";

const router = Router();

// Only enable in non-production environments
router.post("/reset", async (req, res, next) => {
  if (env.NODE_ENV === "production") {
    return res.status(403).json({ success: false, message: "Disabled in production" });
  }

  try {
    await prisma.payment.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.guest.deleteMany();
    await prisma.feedback.deleteMany();

    res.json({ success: true, message: "Demo database reset successfully" });
  } catch (err) {
    next(err);
  }
});

router.post("/seed", async (req, res, next) => {
  if (env.NODE_ENV === "production") {
    return res.status(403).json({ success: false, message: "Disabled in production" });
  }

  try {
    const rooms = await prisma.room.findMany();
    if (rooms.length === 0) throw new Error("No rooms found to seed bookings against");

    const guest = await prisma.guest.create({
      data: {
        name: "Aarav Sharma",
        email: "aarav@example.com",
        phone: "+919876543210"
      }
    });

    const booking = await prisma.booking.create({
      data: {
        code: `DS-${Math.floor(1000 + Math.random() * 9000)}`,
        roomId: rooms[0].id,
        guestId: guest.id,
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        nights: 2,
        guestsCount: 2,
        baseAmount: rooms[0].price * 2,
        taxAmount: (rooms[0].price * 2 * 12) / 100,
        totalAmount: rooms[0].price * 2 * 1.12,
        status: BookingStatus.CONFIRMED
      }
    });

    res.json({ success: true, message: "Mock demo booking created", data: booking });
  } catch (err) {
    next(err);
  }
});

export default router;
