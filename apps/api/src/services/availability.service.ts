import { prisma } from "../utils/db";
import { BookingStatus } from "@hotel-demo/shared";

export class AvailabilityService {
  static async checkAvailability(checkIn: Date, checkOut: Date, guests: number) {
    const roomTypes = await prisma.roomType.findMany({
      where: { maxGuests: { gte: guests } }
    });

    const now = new Date();

    const activeBookings = await prisma.booking.findMany({
      where: {
        AND: [
          { checkIn: { lt: checkOut } },
          { checkOut: { gt: checkIn } },
          {
            OR: [
              { status: BookingStatus.CONFIRMED },
              {
                status: BookingStatus.PENDING,
                expiresAt: { gt: now }
              }
            ]
          }
        ]
      }
    });

    // Count how many units of each room type are currently taken
    const roomBookingCounts: Record<string, number> = {};
    for (const b of activeBookings) {
      roomBookingCounts[b.roomTypeId] = (roomBookingCounts[b.roomTypeId] || 0) + 1;
    }

    return roomTypes.filter((r) => {
      const booked = roomBookingCounts[r.id] || 0;
      return r.units > booked;
    });
  }
}
