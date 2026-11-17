import { prisma } from "../utils/db";
import { BookingStatus } from "@hotel-demo/shared";
import { PricingService } from "./pricing.service";
import { env } from "../config/env";

export class BookingService {
  static async createHeldBooking(data: {
    roomId: string;
    checkIn: string;
    checkOut: string;
    guestName: string;
    guestEmail: string;
    guestPhone: string;
    guestsCount: number;
    specialRequests?: string;
  }) {
    const checkIn = new Date(data.checkIn);
    const checkOut = new Date(data.checkOut);

    return await prisma.$transaction(async (tx) => {
      const roomType = await tx.roomType.findUnique({ where: { id: data.roomId } });
      if (!roomType) throw new Error("Room not found");

      const { nights, baseAmount, taxAmount, totalAmount } = PricingService.calculatePrice(
        roomType.basePrice,
        checkIn,
        checkOut
      );

      // Find or create Guest
      let guest = await tx.guest.findFirst({ where: { phone: data.guestPhone } });
      if (!guest) {
        guest = await tx.guest.create({
          data: {
            name: data.guestName,
            email: data.guestEmail,
            phone: data.guestPhone
          }
        });
      }

      const code = `DS-${Math.floor(1000 + Math.random() * 9000)}`;
      const expiresAt = new Date(Date.now() + env.HOLD_EXPIRY_MINUTES * 60 * 1000);

      const booking = await tx.booking.create({
        data: {
          code,
          roomTypeId: roomType.id,
          guestId: guest.id,
          checkIn,
          checkOut,
          adults: data.guestsCount,
          children: 0,
          subtotal: baseAmount,
          tax: taxAmount,
          total: totalAmount,
          status: BookingStatus.PENDING,
          expiresAt,
          specialRequests: data.specialRequests
        },
        include: { roomType: true, guest: true }
      });

      return {
        ...booking,
        nights,
        baseAmount: booking.subtotal,
        taxAmount: booking.tax,
        totalAmount: booking.total
      };
    });
  }
}
