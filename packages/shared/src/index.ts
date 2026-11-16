import { z } from "zod";
import { BookingStatus, PaymentStatus } from "./constants";
import {
  ClientConfigSchema,
  RoomSchema,
  PoliciesConfigSchema,
  ContentConfigSchema
} from "./schemas/client.schema";

export * from "./constants";
export * from "./schemas/client.schema";

export type ClientConfig = z.infer<typeof ClientConfigSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type PoliciesConfig = z.infer<typeof PoliciesConfigSchema>;
export type ContentConfig = z.infer<typeof ContentConfigSchema>;

export interface Booking {
  id: string;
  code: string;
  roomId: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  checkIn: string;
  checkOut: string;
  nights: number;
  guestsCount: number;
  baseAmount: number;
  taxAmount: number;
  totalAmount: number;
  status: BookingStatus;
  holdExpiresAt?: string;
  createdAt: string;
}

export interface PaymentRecord {
  id: string;
  bookingId: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  razorpayOrderId: string;
  razorpayPaymentId?: string;
  createdAt: string;
}

export interface FeedbackSubmission {
  id?: string;
  name: string;
  phoneOrEmail: string;
  hotelName: string;
  rating: number;
  message: string;
  createdAt?: string;
}
