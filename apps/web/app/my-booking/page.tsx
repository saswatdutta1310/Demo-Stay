"use client";

import { useState } from "react";
import Link from "next/link";
import { Booking, Room, BookingStatus } from "@hotel-demo/shared";
import { getBooking, getRooms } from "@/lib/api";
import {
  Search,
  CheckCircle2,
  AlertCircle,
  Building,
  Calendar,
  User,
  CreditCard,
  ShieldCheck,
  Clock,
  Printer
} from "lucide-react";

export default function MyBookingPage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [booking, setBooking] = useState<Booking | null>(null);
  const [room, setRoom] = useState<Room | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      setError("Please enter your booking reference code.");
      return;
    }

    setLoading(true);
    setError(null);
    setBooking(null);
    setRoom(null);

    try {
      const found = await getBooking(code, phone);
      if (!found) {
        setError(
          phone.trim()
            ? `No reservation found matching code "${code}" and phone "${phone}".`
            : `No reservation found matching code "${code}".`
        );
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
          : "An unexpected error occurred while searching for the reservation."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <div className="mb-8">
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-1">
          Look Up Your Reservation
        </h1>
        <p className="text-xs text-stone-600">
          Enter your booking reference code and registered phone number to check confirmation status and voucher details.
        </p>
      </div>

      {/* Search Card */}
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm mb-8">
        <form onSubmit={handleSearch} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Booking Reference Code <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. DS-4921"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs font-mono uppercase tracking-wider focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">
                Registered Phone Number
              </label>
              <input
                type="tel"
                placeholder="e.g. 9876543210"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
              />
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
              <span>{error}</span>
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center gap-2 disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Clock className="w-4 h-4 animate-spin" /> Searching...
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" /> Find Booking
                </>
              )}
            </button>
          </div>
        </form>
      </div>

      {/* Found Booking Details */}
      {booking && (
        <div className="space-y-6">
          {/* Header Summary */}
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4 pb-4 border-b border-stone-100">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400">
                  Booking Reference
                </span>
                <p className="text-xl font-mono font-bold text-amber-900">{booking.code}</p>
              </div>

              <div className="flex items-center gap-2">
                <span
                  className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider ${
                    booking.status === BookingStatus.CONFIRMED
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : booking.status === BookingStatus.CANCELLED
                      ? "bg-red-50 text-red-700 border border-red-200"
                      : "bg-amber-50 text-amber-800 border border-amber-200"
                  }`}
                >
                  {booking.status}
                </span>
                <button
                  onClick={() => window.print()}
                  className="px-3 py-1.5 border border-stone-200 hover:bg-stone-50 rounded-lg text-xs font-semibold text-stone-700 flex items-center gap-1.5 transition"
                >
                  <Printer className="w-3.5 h-3.5" /> Print
                </button>
              </div>
            </div>

            {/* Status Timeline */}
            <div className="mb-6">
              <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-3">
                Status Timeline
              </h2>
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-900">Payment received</p>
                    <p className="text-[11px] text-stone-500">
                      Payment of ₹{booking.totalAmount.toLocaleString("en-IN")} was received and verified.
                    </p>
                  </div>
                </div>

                <div className="ml-2.5 border-l-2 border-emerald-300 h-3" />

                <div className="flex items-start gap-3">
                  <div
                    className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 ${
                      booking.status === BookingStatus.CONFIRMED
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-stone-100 text-stone-400"
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-stone-900">Booking confirmed</p>
                    <p className="text-[11px] text-stone-500">
                      Status: {booking.status}. Registered under guest {booking.guestName}.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grid Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <Building className="w-4 h-4 text-amber-800" />
                  <span>Room Reserved</span>
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
                  <span>Stay Dates</span>
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
                  <span>Guest Information</span>
                </div>
                <p className="font-semibold text-stone-800">{booking.guestName}</p>
                <p className="text-[11px] text-stone-500">
                  {booking.guestPhone} • {booking.guestEmail}
                </p>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
                <div className="flex items-center gap-2 text-stone-500 mb-1">
                  <CreditCard className="w-4 h-4 text-amber-800" />
                  <span>Billing Summary</span>
                </div>
                <p className="font-semibold text-stone-800 text-sm">
                  Total: ₹{booking.totalAmount.toLocaleString("en-IN")}
                </p>
                <p className="text-[11px] text-stone-500">
                  Base: ₹{booking.baseAmount.toLocaleString("en-IN")} • Tax: ₹{booking.taxAmount.toLocaleString("en-IN")}
                </p>
              </div>
            </div>

            {/* Policies */}
            <div className="border-t border-stone-100 mt-4 pt-3 flex items-start gap-2 text-[11px] text-stone-500">
              <ShieldCheck className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
              <span>
                Standard check-in is 10:30 AM, check-out 11:00 AM. Presentation of original government-issued photo ID is required upon check-in.
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Back to Home */}
      <div className="mt-8 text-center">
        <Link href="/" className="text-xs text-stone-500 hover:text-stone-800 font-medium underline">
          ← Return to Homepage
        </Link>
      </div>
    </div>
  );
}
