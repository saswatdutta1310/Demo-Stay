import { Router } from "express";
import { z } from "zod";
import rateLimit from "express-rate-limit";
import { BookingService } from "../services/booking.service";

const router = Router();

// Rate limiter for bookings endpoints
const bookingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 30, // max 30 requests per IP per window
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: "Too many booking requests from this IP, please try again later."
  }
});

const createBookingSchema = z.object({
  roomTypeId: z.string().min(1, "Room type ID is required"),
  checkIn: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid check-in date format"),
  checkOut: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Invalid check-out date format"),
  adults: z.number().int().min(1, "At least 1 adult required"),
  children: z.number().int().min(0).optional().default(0),
  guest: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    phone: z.string().min(10, "Phone number must be at least 10 digits"),
    email: z.string().email("Invalid email address"),
    idType: z.string().min(1, "ID type is required"),
    idLast4: z.string().max(4).optional(),
    isMaleOnlyGroup: z.boolean().optional(),
    isPrimaryGuestAdult: z.boolean().optional()
  }),
  specialRequests: z.string().optional(),
  paymentMode: z.enum(["ONLINE", "AT_HOTEL"]).optional().default("ONLINE")
});

/**
 * POST /api/v1/bookings
 * Create a pending booking hold in a single transaction.
 */
router.post("/", bookingLimiter, async (req, res, next) => {
  try {
    const validated = createBookingSchema.parse(req.body);
    const result = await BookingService.createBooking(validated);
    res.status(201).json({
      success: true,
      data: result.booking,
      pricing: result.pricing
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      return res.status(400).json({
        success: false,
        message: err.errors.map((e) => `${e.path.join(".")}: ${e.message}`).join(", ")
      });
    }
    next(err);
  }
});

/**
 * GET /api/v1/bookings/:code
 * Requires phone number in query or headers.
 */
router.get("/:code", async (req, res, next) => {
  try {
    const { code } = req.params;
    const phone = (req.query.phone as string) || (req.headers["x-guest-phone"] as string);

    if (!phone) {
      return res.status(400).json({
        success: false,
        message: "Matching phone number is required to access booking details"
      });
    }

    const booking = await BookingService.getBookingByCodeAndPhone(code, phone);
    res.json({
      success: true,
      data: booking
    });
  } catch (err) {
    next(err);
  }
});

/**
 * POST /api/v1/bookings/:code/cancel
 * Cancels booking enforcing 24-hour cancellation rule.
 */
router.post("/:code/cancel", async (req, res, next) => {
  try {
    const { code } = req.params;
    const phone = req.body?.phone || (req.query.phone as string);
    const cancelled = await BookingService.cancelBooking(code, phone);

    res.json({
      success: true,
      message: "Booking cancelled successfully",
      data: cancelled
    });
  } catch (err) {
    next(err);
  }
});

export default router;
