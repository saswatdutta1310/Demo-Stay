"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Booking, Room } from "@hotel-demo/shared";
import { getBooking, getRooms } from "@/lib/api";
import {
  CheckCircle2,
  Calendar,
  User,
  ShieldCheck,
  CreditCard,
  Building,
  AlertCircle,
  Home,
  Clock,
  Printer
} from "lucide-react";

export default function ConfirmationPage() {
  const params = useParams<{ code: string }>();
  const code = params?.code || "";

  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchBookingDetails() {
      if (!code) {
        setLoading(false);
        return;
      }
      try {
        const found = await getBooking(code);
        if (!found) {
          setError("Reservation not found for this code.");
        } else {
          setBooking(found);
          const rooms = await getRooms();
          const matchRoom = rooms.find(
            (r) => r.id === found.roomId || r.slug === found.roomId
          );
          if (matchRoom) setRoom(matchRoom);
        }
      } catch (err: unknown) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load booking details."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchBookingDetails();
  }, [code]);

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-20 text-center text-stone-600">
        <Clock className="w-8 h-8 animate-spin mx-auto mb-3 text-stone-400" />
        <p className="text-sm">Retrieving your reservation confirmation...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center">
        <div className="bg-white border border-stone-200 rounded-2xl p-8">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-3" />
          <h1 className="text-xl font-bold text-stone-900 mb-2">Booking Not Found</h1>
          <p className="text-xs text-stone-600 mb-6">
            {error || "We could not find a reservation corresponding to this code."}
          </p>
          <div className="flex justify-center gap-3">
            <Link
              href="/"
              className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold"
            >
              Go to Home
            </Link>
            <Link
              href="/my-booking"
              className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold"
            >
              Lookup Booking
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      {/* Header Banner */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm text-center mb-6">
        <div className="w-14 h-14 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-8 h-8" />
        </div>
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Confirmed & Guaranteed
        </span>
        <h1 className="text-2xl sm:text-3xl font-bold text-stone-900 mt-3 mb-1">
          Thank you, {booking.guestName}!
        </h1>
        <p className="text-xs sm:text-sm text-stone-500">
          Your booking confirmation voucher has been sent to{" "}
          <strong className="text-stone-700">{booking.guestEmail}</strong>.
        </p>

        <div className="mt-6 inline-flex flex-col items-center bg-stone-50 border border-stone-200 rounded-xl px-6 py-3">
          <span className="text-[11px] font-semibold text-stone-400 uppercase tracking-wider">
            Booking Reference Code
          </span>
          <span className="text-xl font-mono font-bold text-amber-900">
            {booking.code}
          </span>
        </div>
      </div>

      {/* Status Timeline */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm mb-6">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-4">
          Status Timeline
        </h2>
        <div className="space-y-4">
          {/* Timeline Step 1 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-900">Payment received</p>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  Completed
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Razorpay payment order was authorized and verified successfully.
              </p>
            </div>
          </div>

          <div className="ml-3 border-l-2 border-emerald-300 h-4" />

          {/* Timeline Step 2 */}
          <div className="flex items-start gap-3">
            <div className="w-6 h-6 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
              <CheckCircle2 className="w-4 h-4" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between">
                <p className="text-xs font-semibold text-stone-900">Booking confirmed</p>
                <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded">
                  {booking.status}
                </span>
              </div>
              <p className="text-[11px] text-stone-500">
                Room inventory locked and reserved under primary guest {booking.guestName}.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Details Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm mb-6 space-y-4">
        <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider">
          Reservation Summary
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 mb-1">
              <Building className="w-4 h-4 text-amber-800" />
              <span>Room Category</span>
            </div>
            <p className="font-semibold text-stone-800">
              {room ? room.name : booking.roomId}
            </p>
            {room && (
              <p className="text-[11px] text-stone-500">
                {room.bed} • {room.sizeSqFt} sq ft • Up to {room.maxGuests} Guests
              </p>
            )}
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 mb-1">
              <Calendar className="w-4 h-4 text-amber-800" />
              <span>Stay Duration</span>
            </div>
            <p className="font-semibold text-stone-800">
              {new Date(booking.checkIn).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}{" "}
              to{" "}
              {new Date(booking.checkOut).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric"
              })}
            </p>
            <p className="text-[11px] text-stone-500">
              {booking.nights} {booking.nights === 1 ? "night" : "nights"} • {booking.guestsCount} {booking.guestsCount === 1 ? "guest" : "guests"}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 mb-1">
              <User className="w-4 h-4 text-amber-800" />
              <span>Primary Guest</span>
            </div>
            <p className="font-semibold text-stone-800">{booking.guestName}</p>
            <p className="text-[11px] text-stone-500">
              {booking.guestPhone} • {booking.guestEmail}
            </p>
          </div>

          <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
            <div className="flex items-center gap-2 text-stone-500 mb-1">
              <CreditCard className="w-4 h-4 text-amber-800" />
              <span>Paid Amount</span>
            </div>
            <p className="font-semibold text-stone-800 text-sm">
              ₹{booking.totalAmount.toLocaleString("en-IN")}
            </p>
            <p className="text-[11px] text-stone-500">
              Base: ₹{booking.baseAmount.toLocaleString("en-IN")} • Taxes: ₹{booking.taxAmount.toLocaleString("en-IN")}
            </p>
          </div>
        </div>

        {/* Policies Checklist */}
        <div className="border-t border-stone-100 pt-3 flex items-start gap-2 text-[11px] text-stone-500">
          <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
          <span>
            Check-in time: 10:30 AM | Check-out: 11:00 AM. Free cancellation up to 24 hours prior to check-in. Valid physical government ID required upon arrival (no local IDs).
          </span>
        </div>
      </div>

      {/* Action links */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link
          href="/"
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
        >
          <Home className="w-4 h-4" /> Return to Home
        </Link>
        <div className="flex gap-2">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 border border-stone-300 hover:bg-stone-50 text-stone-700 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Printer className="w-4 h-4" /> Print Voucher
          </button>
          <Link
            href="/my-booking"
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition"
          >
            Manage Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
