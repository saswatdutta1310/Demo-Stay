export const BOOKING_STATUSES = ["PENDING", "CONFIRMED", "CANCELLED", "EXPIRED"] as const;
export type BookingStatusType = (typeof BOOKING_STATUSES)[number];

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  CANCELLED = "CANCELLED",
  EXPIRED = "EXPIRED"
}

export const PAYMENT_STATUSES = ["CREATED", "PAID", "FAILED", "REFUNDED"] as const;
export type PaymentStatusType = (typeof PAYMENT_STATUSES)[number];

export enum PaymentStatus {
  CREATED = "CREATED",
  PAID = "PAID",
  FAILED = "FAILED",
  REFUNDED = "REFUNDED"
}

export const ACCEPTED_ID_TYPES = [
  "Passport",
  "Aadhaar",
  "Driving License",
  "Govt ID"
] as const;
export type AcceptedIDType = (typeof ACCEPTED_ID_TYPES)[number];

export enum IDType {
  PASSPORT = "Passport",
  AADHAAR = "Aadhaar",
  DRIVING_LICENSE = "Driving License",
  GOVT_ID = "Govt ID"
}

export const DEFAULT_HOLD_DURATION_MINUTES = 15;
export const DEFAULT_TAX_PERCENTAGE = 12; // 12% GST standard
