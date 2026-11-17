import { z } from "zod";
import {
  ClientConfigSchema,
  RoomSchema,
  PoliciesConfigSchema,
  ContentConfigSchema,
  GuestSchema,
  PaymentSchema,
  BookingSchema,
  GuestDetailsFormSchema
} from "./schemas/client.schema";

export * from "./constants";
export * from "./schemas/client.schema";
export * from "./pricing";

export type ClientConfig = z.infer<typeof ClientConfigSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Policies = z.infer<typeof PoliciesConfigSchema>;
export type PoliciesConfig = Policies;
export type Content = z.infer<typeof ContentConfigSchema>;
export type ContentConfig = Content;
export type Guest = z.infer<typeof GuestSchema>;
export type Payment = z.infer<typeof PaymentSchema>;
export type PaymentRecord = Payment;
export type Booking = z.infer<typeof BookingSchema>;
export type GuestDetailsForm = z.infer<typeof GuestDetailsFormSchema>;

export interface FeedbackSubmission {
  id?: string;
  name: string;
  phoneOrEmail: string;
  hotelName: string;
  rating: number;
  message: string;
  createdAt?: string;
}
