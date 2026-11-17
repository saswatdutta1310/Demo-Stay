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
    const roomTypes = await prisma.roomType.findMany();
    if (roomTypes.length === 0) throw new Error("No rooms found to seed bookings against");

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
        roomTypeId: roomTypes[0].id,
        guestId: guest.id,
        checkIn: new Date(),
        checkOut: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000),
        adults: 2,
        children: 0,
        subtotal: roomTypes[0].basePrice * 2,
        tax: roomTypes[0].taxPerNight * 2,
        total: (roomTypes[0].basePrice + roomTypes[0].taxPerNight) * 2,
        status: BookingStatus.CONFIRMED,
        paymentMode: "ONLINE"
      }
    });

    res.json({ success: true, message: "Mock demo booking created", data: booking });
  } catch (err) {
    next(err);
  }
});

export default router;
