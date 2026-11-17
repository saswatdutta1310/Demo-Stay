import crypto from "crypto";
import { razorpay } from "../config/razorpay";
import { env } from "../config/env";
import { prisma } from "../utils/db";
import { BookingStatus, PaymentStatus } from "@hotel-demo/shared";
import { EventsService } from "./events.service";

export class PaymentService {
  static async createOrder(bookingId: string) {
    const booking = await prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) throw new Error("Booking not found");

    const order = await razorpay.orders.create({
      amount: Math.round(booking.totalAmount * 100),
      currency: "INR",
      receipt: booking.code,
      notes: { bookingId: booking.id }
    });

    await prisma.payment.create({
      data: {
        bookingId: booking.id,
        amount: booking.totalAmount,
        currency: "INR",
        status: PaymentStatus.CREATED,
        razorpayOrderId: order.id
      }
    });

    return order;
  }

  static async verifySignature(data: {
    bookingId: string;
    razorpayOrderId: string;
    razorpayPaymentId: string;
    razorpaySignature: string;
  }) {
    const text = `${data.razorpayOrderId}|${data.razorpayPaymentId}`;
    const expectedSignature = crypto
      .createHmac("sha256", env.RAZORPAY_KEY_SECRET)
      .update(text)
      .digest("hex");

    if (expectedSignature !== data.razorpaySignature) {
      throw new Error("Invalid payment signature");
    }

    await prisma.payment.updateMany({
      where: { razorpayOrderId: data.razorpayOrderId },
      data: {
        razorpayPaymentId: data.razorpayPaymentId,
        razorpaySignature: data.razorpaySignature,
        status: PaymentStatus.PAID
      }
    });

    const confirmedBooking = await prisma.booking.update({
      where: { id: data.bookingId },
      data: { status: BookingStatus.CONFIRMED },
      include: { room: true, guest: true }
    });

    EventsService.pushPaymentEvent({
      bookingCode: confirmedBooking.code,
      guestName: confirmedBooking.guest.name,
      roomName: confirmedBooking.room.name,
      amount: confirmedBooking.totalAmount,
      timestamp: new Date().toISOString()
    });

    return confirmedBooking;
  }
}
