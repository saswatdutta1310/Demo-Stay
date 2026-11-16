import { Router } from "express";
import { AvailabilityService } from "../services/availability.service";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const { checkIn, checkOut, guests } = req.query as {
      checkIn: string;
      checkOut: string;
      guests?: string;
    };

    if (!checkIn || !checkOut) {
      return res.status(400).json({ success: false, message: "checkIn and checkOut are required" });
    }

    const available = await AvailabilityService.checkAvailability(
      new Date(checkIn),
      new Date(checkOut),
      Number(guests) || 1
    );

    res.json({ success: true, data: available });
  } catch (err) {
    next(err);
  }
});

export default router;
