import { prisma } from "../utils/db";
import { RoomType as PrismaRoomType } from "@prisma/client";

export type BookingStatusType = "PENDING" | "HOLD" | "CONFIRMED" | "CANCELLED" | "EXPIRED";

export interface AvailableRoomTypeResult {
  roomType: PrismaRoomType;
  totalUnits: number;
  availableUnits: number;
  isAvailable: boolean;
}

export class AvailabilityService {
  /**
   * Computes available units per room type for a date range:
   * units available = total units - overlapping CONFIRMED bookings - unexpired PENDING holds - blocked dates.
   *
   * Date overlap condition: (checkIn < requestedCheckOut) AND (checkOut > requestedCheckIn)
   * Note: Same-day turnover is permitted: checkIn == existingCheckOut is NOT an overlap.
   */
  static async checkAvailability(
    checkIn: Date | string,
    checkOut: Date | string,
    guests = 1
  ): Promise<AvailableRoomTypeResult[]> {
    const dIn = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
    const dOut = typeof checkOut === "string" ? new Date(checkOut) : checkOut;

    if (dOut <= dIn) {
      throw new Error("Check-out date must be strictly after check-in date");
    }

    const roomTypes = await prisma.roomType.findMany({
      where: { maxGuests: { gte: guests } }
    });

    const now = new Date();

    // 1. Fetch active bookings overlapping the range:
    // CONFIRMED, or PENDING with unexpired hold (expiresAt > now)
    const activeBookings = await prisma.booking.findMany({
      where: {
        AND: [
          { checkIn: { lt: dOut } },
          { checkOut: { gt: dIn } },
          {
            OR: [
              { status: "CONFIRMED" },
              {
                status: "PENDING",
                expiresAt: { gt: now }
              },
              {
                status: "HOLD",
                expiresAt: { gt: now }
              }
            ]
          }
        ]
      }
    });

    // 2. Fetch blocked dates overlapping the range
    const blockedDates = await prisma.blockedDate.findMany({
      where: {
        startDate: { lt: dOut },
        endDate: { gt: dIn }
      }
    });

    const results: AvailableRoomTypeResult[] = roomTypes.map((rt) => {
      // Overlapping bookings for this room type
      const bookedCount = activeBookings.filter((b) => b.roomTypeId === rt.id).length;

      // Check if this room type has any active blocked date
      const isBlocked = blockedDates.some((b) => b.roomTypeId === rt.id);

      // If blocked, available units become 0 for this range; otherwise total units minus booked units
      const availableUnits = isBlocked ? 0 : Math.max(0, rt.units - bookedCount);

      return {
        roomType: rt,
        totalUnits: rt.units,
        availableUnits,
        isAvailable: availableUnits > 0
      };
    });

    return results;
  }

  /**
   * Helper to verify if at least one unit is available for a specific room type
   */
  static async isRoomTypeAvailable(
    roomTypeId: string,
    checkIn: Date | string,
    checkOut: Date | string
  ): Promise<boolean> {
    const dIn = typeof checkIn === "string" ? new Date(checkIn) : checkIn;
    const dOut = typeof checkOut === "string" ? new Date(checkOut) : checkOut;
    const now = new Date();

    const roomType = await prisma.roomType.findUnique({
      where: { id: roomTypeId }
    });
    if (!roomType) return false;

    // Check if blocked
    const blocked = await prisma.blockedDate.findFirst({
      where: {
        roomTypeId,
        startDate: { lt: dOut },
        endDate: { gt: dIn }
      }
    });
    if (blocked) return false;

    // Count overlapping active bookings
    const bookedCount = await prisma.booking.count({
      where: {
        roomTypeId,
        checkIn: { lt: dOut },
        checkOut: { gt: dIn },
        OR: [
          { status: "CONFIRMED" },
          {
            status: "PENDING",
            expiresAt: { gt: now }
          },
          {
            status: "HOLD",
            expiresAt: { gt: now }
          }
        ]
      }
    });

    return roomType.units > bookedCount;
  }
}
