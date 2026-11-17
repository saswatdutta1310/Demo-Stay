import { Router, Request, Response, NextFunction } from "express";
import { z } from "zod";
import { AvailabilityService } from "../services/availability.service";

const router = Router();

const AvailabilityQuerySchema = z.object({
  from: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "from must be in YYYY-MM-DD format"),
  to: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "to must be in YYYY-MM-DD format"),
  guests: z.coerce.number().int().min(1).default(1)
}).refine((data) => new Date(data.to) > new Date(data.from), {
  message: "'to' date must be after 'from' date",
  path: ["to"]
});

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const rawQuery = {
      from: req.query.from || req.query.checkIn,
      to: req.query.to || req.query.checkOut,
      guests: req.query.guests || 1
    };

    const parsed = AvailabilityQuerySchema.safeParse(rawQuery);
    if (!parsed.success) {
      return res.status(400).json({
        success: false,
        message: "Invalid query parameters",
        errors: parsed.error.flatten().fieldErrors
      });
    }

    const { from, to, guests } = parsed.data;
    const availableRoomTypes = await AvailabilityService.checkAvailability(
      new Date(from),
      new Date(to),
      guests
    );

    const formatted = availableRoomTypes.map((item) => ({
      ...item.roomType,
      amenities: JSON.parse(item.roomType.amenities || "[]"),
      images: JSON.parse(item.roomType.images || "[]"),
      units: item.roomType.units,
      availableUnits: item.availableUnits,
      isAvailable: item.isAvailable
    }));

    res.json({
      success: true,
      data: formatted
    });
  } catch (err) {
    next(err);
  }
});

export default router;
