import { prisma } from "../utils/db";
import { BookingStatus } from "@hotel-demo/shared";

export class AvailabilityService {
  static async checkAvailability(checkIn: Date, checkOut: Date, guests: number) {
    const rooms = await prisma.room.findMany({
      where: { capacity: { gte: guests } }
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
                status: BookingStatus.HOLD,
                holdExpiresAt: { gt: now }
              }
            ]
          }
        ]
      }
    });

    // Count how many units of each room are currently taken
    const roomBookingCounts: Record<string, number> = {};
    for (const b of activeBookings) {
      roomBookingCounts[b.roomId] = (roomBookingCounts[b.roomId] || 0) + 1;
    }

    return rooms.filter((r) => {
      const booked = roomBookingCounts[r.id] || 0;
      return r.unitsAvailable > booked;
    });
  }
}
