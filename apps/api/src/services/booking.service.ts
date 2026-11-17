import crypto from "crypto";
import { prisma } from "../utils/db";
import { PricingService } from "./pricing.service";
import { AvailabilityService } from "./availability.service";
import { loadClientData } from "../config/client";

export interface CreateBookingInput {
  roomTypeId: string;
  checkIn: string; // ISO string or YYYY-MM-DD
  checkOut: string;
  adults: number;
  children?: number;
  guest: {
    name: string;
    phone: string;
    email: string;
    idType: string;
    idLast4?: string;
    isMaleOnlyGroup?: boolean;
    isPrimaryGuestAdult?: boolean;
  };
  specialRequests?: string;
  paymentMode?: string;
}

export class HttpError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BookingService {
  /**
   * Generates unique booking code like GS-XXXXXX
   */
  static generateBookingCode(): string {
    const random = crypto.randomBytes(3).toString("hex").toUpperCase();
    return `GS-${random}`;
  }

  /**
   * Creates a pending booking with a 10-minute hold in ONE single database transaction.
   * Re-checks availability, calculates pricing on server (ignoring client amount),
   * and enforces hotel policy rules.
   */
  static async createBooking(input: CreateBookingInput) {
    const { roomTypeId, checkIn, checkOut, adults, children = 0, guest, specialRequests, paymentMode = "ONLINE" } = input;

    // Policy Validation
    if (guest.isPrimaryGuestAdult === false) {
      throw new HttpError(400, "Primary guest must be at least 18 years old");
    }

    if (guest.isMaleOnlyGroup === true) {
      throw new HttpError(400, "Male-only groups are not permitted as per property policy");
    }

    let acceptedIds: string[] = ["Passport", "Aadhaar", "Driving License", "Govt ID"];
    try {
      const client = loadClientData();
      if (client?.policies?.acceptedIdTypes && client.policies.acceptedIdTypes.length > 0) {
        acceptedIds = client.policies.acceptedIdTypes;
      }
    } catch {
      // fallback to standard default
    }

    if (!acceptedIds.map((t: string) => t.toLowerCase()).includes(guest.idType.toLowerCase())) {
      throw new HttpError(400, `Invalid ID type. Accepted types: ${acceptedIds.join(", ")}`);
    }

    const dIn = new Date(checkIn);
    const dOut = new Date(checkOut);

    if (isNaN(dIn.getTime()) || isNaN(dOut.getTime()) || dOut <= dIn) {
      throw new HttpError(400, "Invalid check-in or check-out dates");
    }

    // Execute in ONE transaction
    return await prisma.$transaction(async (tx) => {
      // 1. Fetch RoomType
      const roomType = await tx.roomType.findFirst({
        where: {
          OR: [{ id: roomTypeId }, { slug: roomTypeId }]
        }
      });

      if (!roomType) {
        throw new HttpError(404, "Room type not found");
      }

      if (adults + children > roomType.maxGuests) {
        throw new HttpError(400, `Guests exceed maximum capacity of ${roomType.maxGuests} for this room`);
      }

      // 2. Re-check availability within transaction
      const isAvailable = await AvailabilityService.isRoomTypeAvailable(roomType.id, dIn, dOut);
      if (!isAvailable) {
        throw new HttpError(409, "Selected room type is not available for the requested dates");
      }

      // 3. Compute price on server (ignoring client amount)
      const pricing = await PricingService.calculateStayPrice(roomType.id, dIn, dOut);

      // 4. Create or update Guest
      let dbGuest = await tx.guest.findFirst({
        where: { phone: guest.phone }
      });

      if (!dbGuest) {
        dbGuest = await tx.guest.create({
          data: {
            name: guest.name,
            phone: guest.phone,
            email: guest.email,
            idType: guest.idType,
            idLast4: guest.idLast4 || null
          }
        });
      } else {
        dbGuest = await tx.guest.update({
          where: { id: dbGuest.id },
          data: {
            name: guest.name,
            email: guest.email,
            idType: guest.idType,
            idLast4: guest.idLast4 || dbGuest.idLast4
          }
        });
      }

      // 5. Generate unique code
      let code = BookingService.generateBookingCode();
      let exists = await tx.booking.findUnique({ where: { code } });
      while (exists) {
        code = BookingService.generateBookingCode();
        exists = await tx.booking.findUnique({ where: { code } });
      }

      // 6. 10-minute hold
      const expiresAt = new Date(Date.now() + 10 * 60 * 1000);

      const booking = await tx.booking.create({
        data: {
          code,
          roomTypeId: roomType.id,
          guestId: dbGuest.id,
          checkIn: dIn,
          checkOut: dOut,
          adults,
          children,
          subtotal: pricing.subtotal,
          tax: pricing.tax,
          total: pricing.total,
          status: "PENDING",
          paymentMode,
          expiresAt,
          specialRequests
        },
        include: {
          roomType: true,
          guest: true
        }
      });

      return {
        booking,
        pricing
      };
    });
  }

  /**
   * Retrieves booking by code and verifies phone match.
   */
  static async getBookingByCodeAndPhone(code: string, phone: string) {
    const booking = await prisma.booking.findFirst({
      where: {
        code,
        guest: { phone }
      },
      include: {
        roomType: true,
        guest: true,
        payments: true
      }
    });

    if (!booking) {
      throw new HttpError(404, "Booking not found or phone number does not match");
    }

    return booking;
  }

  /**
   * Cancels booking enforcing 24-hour rule before check-in.
   */
  static async cancelBooking(code: string, phone?: string) {
    const booking = await prisma.booking.findUnique({
      where: { code },
      include: { guest: true }
    });

    if (!booking) {
      throw new HttpError(404, "Booking not found");
    }

    if (phone && booking.guest.phone !== phone) {
      throw new HttpError(403, "Unauthorized to cancel this booking");
    }

    if (booking.status === "CANCELLED") {
      throw new HttpError(400, "Booking is already cancelled");
    }

    // 24-hour cancellation rule
    const now = new Date();
    const checkInTime = new Date(booking.checkIn);
    const diffHours = (checkInTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    if (diffHours < 24) {
      throw new HttpError(400, "Cancellation must be made at least 24 hours prior to check-in");
    }

    return await prisma.booking.update({
      where: { id: booking.id },
      data: { status: "CANCELLED" }
    });
  }

  /**
   * Expires overdue holds
   */
  static async expireOverdueHolds() {
    const now = new Date();
    return await prisma.booking.updateMany({
      where: {
        status: { in: ["PENDING", "HOLD"] },
        expiresAt: { lte: now }
      },
      data: { status: "EXPIRED" }
    });
  }
}
