import { Router } from "express";
import { BookingService } from "../services/booking.service";
import { prisma } from "../utils/db";

const router = Router();

router.post("/hold", async (req, res, next) => {
  try {
    const booking = await BookingService.createHeldBooking(req.body);
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

router.get("/lookup", async (req, res, next) => {
  try {
    const { code, phone } = req.query as { code: string; phone: string };
    const booking = await prisma.booking.findFirst({
      where: {
        code,
        guest: { phone }
      },
      include: { roomType: true, guest: true, payments: true }
    });

    if (!booking) return res.status(404).json({ success: false, message: "Booking not found" });
    res.json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
});

export default router;
