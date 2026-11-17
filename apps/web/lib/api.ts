import {
  Room,
  Booking,
  Payment,
  FeedbackSubmission,
  calculateTotal,
  calculateNights,
  BookingStatus,
  PaymentStatus
} from "@hotel-demo/shared";
import { getClientRooms } from "./client-rooms";

export interface CreateBookingPayload {
  roomId: string;
  checkIn: string;
  checkOut: string;
  guestName: string;
  guestEmail: string;
  guestPhone: string;
  guestsCount?: number;
  specialRequests?: string;
}

export interface PaymentOrderResponse {
  id: string;
  amount: number;
  currency: string;
  bookingId: string;
  receipt: string;
}

const USE_MOCK =
  process.env.NEXT_PUBLIC_USE_MOCK === "true" ||
  process.env.USE_MOCK === "true" ||
  true; // Defaults to true if unspecified in client component

const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ||
  process.env.API_URL ||
  "http://localhost:5000/api/v1";

// In-memory store for mock mode
const mockStore: {
  bookings: Booking[];
  payments: Payment[];
  feedbacks: FeedbackSubmission[];
} = {
  bookings: [],
  payments: [],
  feedbacks: []
};

// Helper for simulated network delay in mock mode
const delay = (ms = 400) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * 1. getRooms()
 */
export async function getRooms(): Promise<Room[]> {
  if (USE_MOCK) {
    await delay(400);
    return getClientRooms();
  }

  const res = await fetch(`${API_BASE}/rooms`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch rooms: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 2. getAvailability(from, to, guests)
 */
export async function getAvailability(
  from: string,
  to: string,
  guests = 1
): Promise<Room[]> {
  if (USE_MOCK) {
    await delay(400);
    const rooms = getClientRooms();
    const checkIn = new Date(from);
    const checkOut = new Date(to);

    // Filter by capacity and check overlapping mock bookings
    return rooms.filter((room) => {
      if (room.maxGuests < guests) return false;

      const overlappingCount = mockStore.bookings.filter((b) => {
        if (b.roomId !== room.id) return false;
        if (b.status === BookingStatus.CANCELLED || b.status === BookingStatus.EXPIRED) {
          return false;
        }
        const bIn = new Date(b.checkIn);
        const bOut = new Date(b.checkOut);
        return checkIn < bOut && checkOut > bIn;
      }).length;

      return room.units > overlappingCount;
    });
  }

  const params = new URLSearchParams({ checkIn: from, checkOut: to, guests: String(guests) });
  const res = await fetch(`${API_BASE}/availability?${params.toString()}`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to check availability: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 3. createBooking(payload)
 */
export async function createBooking(payload: CreateBookingPayload): Promise<Booking> {
  if (USE_MOCK) {
    await delay(400);
    const rooms = getClientRooms();
    const room = rooms.find((r) => r.id === payload.roomId || r.slug === payload.roomId);
    if (!room) throw new Error("Selected room not found");

    const nights = calculateNights(payload.checkIn, payload.checkOut);
    if (nights <= 0) throw new Error("Invalid check-in and check-out dates");

    const pricing = calculateTotal(room.basePrice, room.taxPerNight, nights);

    const bookingId = `mock_b_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const bookingCode = `DS-${Math.floor(1000 + Math.random() * 9000)}`;

    const newBooking: Booking = {
      id: bookingId,
      code: bookingCode,
      roomId: room.id,
      guestName: payload.guestName,
      guestEmail: payload.guestEmail,
      guestPhone: payload.guestPhone,
      checkIn: payload.checkIn,
      checkOut: payload.checkOut,
      nights,
      guestsCount: payload.guestsCount || 1,
      baseAmount: pricing.subtotal,
      taxAmount: pricing.tax,
      totalAmount: pricing.total,
      status: BookingStatus.PENDING,
      holdExpiresAt: new Date(Date.now() + 15 * 60 * 1000).toISOString(),
      specialRequests: payload.specialRequests,
      createdAt: new Date().toISOString()
    };

    mockStore.bookings.unshift(newBooking);
    return newBooking;
  }

  const res = await fetch(`${API_BASE}/bookings`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to create booking: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 4. getBooking(code, phone)
 */
export async function getBooking(code: string, phone?: string): Promise<Booking | null> {
  if (USE_MOCK) {
    await delay(400);
    const booking = mockStore.bookings.find((b) => {
      const matchCode = b.code.toUpperCase() === code.trim().toUpperCase();
      if (!phone) return matchCode;
      const cleanPhone = phone.replace(/\D/g, "");
      const cleanGuestPhone = b.guestPhone.replace(/\D/g, "");
      return matchCode && (cleanPhone === "" || cleanGuestPhone.includes(cleanPhone));
    });
    return booking || null;
  }

  const params = new URLSearchParams({ code });
  if (phone) params.set("phone", phone);
  const res = await fetch(`${API_BASE}/bookings/lookup?${params.toString()}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Failed to lookup booking: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 5. createPaymentOrder(bookingId)
 */
export async function createPaymentOrder(bookingId: string): Promise<PaymentOrderResponse> {
  if (USE_MOCK) {
    await delay(400);
    const booking = mockStore.bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    const orderId = `order_mock_${Date.now()}`;
    const paymentRecord: Payment = {
      id: `pay_mock_${Date.now()}`,
      bookingId: booking.id || bookingId,
      amount: booking.totalAmount,
      currency: "INR",
      status: PaymentStatus.CREATED,
      razorpayOrderId: orderId,
      createdAt: new Date().toISOString()
    };

    mockStore.payments.push(paymentRecord);

    return {
      id: orderId,
      amount: booking.totalAmount * 100, // paise
      currency: "INR",
      bookingId: booking.id || bookingId,
      receipt: booking.code
    };
  }

  const res = await fetch(`${API_BASE}/payments/order`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId })
  });
  if (!res.ok) throw new Error(`Failed to create payment order: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 6. confirmPayment(bookingId)
 */
export async function confirmPayment(bookingId: string): Promise<Booking> {
  if (USE_MOCK) {
    await delay(400);
    const booking = mockStore.bookings.find((b) => b.id === bookingId);
    if (!booking) throw new Error("Booking not found");

    booking.status = BookingStatus.CONFIRMED;

    const payment = mockStore.payments.find((p) => p.bookingId === bookingId);
    if (payment) {
      payment.status = PaymentStatus.PAID;
      payment.razorpayPaymentId = `pay_confirmed_${Date.now()}`;
    }

    return booking;
  }

  const res = await fetch(`${API_BASE}/payments/confirm`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ bookingId })
  });
  if (!res.ok) throw new Error(`Failed to confirm payment: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 7. getOwnerBookings()
 */
export async function getOwnerBookings(): Promise<Booking[]> {
  if (USE_MOCK) {
    await delay(400);
    return [...mockStore.bookings];
  }

  const res = await fetch(`${API_BASE}/owner/bookings`, { cache: "no-store" });
  if (!res.ok) throw new Error(`Failed to fetch owner bookings: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 8. refundBooking(id)
 */
export async function refundBooking(id: string): Promise<Booking> {
  if (USE_MOCK) {
    await delay(400);
    const booking = mockStore.bookings.find((b) => b.id === id);
    if (!booking) throw new Error("Booking not found");

    booking.status = BookingStatus.CANCELLED;

    const payment = mockStore.payments.find((p) => p.bookingId === id);
    if (payment) {
      payment.status = PaymentStatus.REFUNDED;
    }

    return booking;
  }

  const res = await fetch(`${API_BASE}/owner/bookings/${id}/refund`, {
    method: "POST"
  });
  if (!res.ok) throw new Error(`Failed to refund booking: ${res.statusText}`);
  const data = await res.json();
  return data.data;
}

/**
 * 9. submitFeedback(payload)
 */
export async function submitFeedback(payload: FeedbackSubmission): Promise<{ success: boolean; id: string }> {
  if (USE_MOCK) {
    await delay(400);
    const newFeedback: FeedbackSubmission = {
      ...payload,
      id: `fb_mock_${Date.now()}`,
      createdAt: new Date().toISOString()
    };
    mockStore.feedbacks.unshift(newFeedback);
    return { success: true, id: newFeedback.id || "" };
  }

  const res = await fetch(`${API_BASE}/feedback`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  });
  if (!res.ok) throw new Error(`Failed to submit feedback: ${res.statusText}`);
  const data = await res.json();
  return data;
}
