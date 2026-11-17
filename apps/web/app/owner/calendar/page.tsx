"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getOwnerBookings, getRooms, OwnerBookingRecord } from "@/lib/api";
import { Room, BookingStatus } from "@hotel-demo/shared";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Clock,
  BedDouble
} from "lucide-react";

export default function OwnerCalendarPage() {
  useOwnerAuth();

  const [rooms, setRooms] = useState<Room[]>([]);
  const [bookings, setBookings] = useState<OwnerBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);

  // Month state (defaults to current date)
  const [currentDate, setCurrentDate] = useState(() => new Date());

  useEffect(() => {
    async function loadCalendarData() {
      try {
        const [roomsData, bookingsData] = await Promise.all([
          getRooms(),
          getOwnerBookings()
        ]);
        setRooms(roomsData);
        setBookings(bookingsData);
      } catch (err) {
        console.error("Error loading calendar data:", err);
      } finally {
        setLoading(false);
      }
    }
    loadCalendarData();
  }, []);

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth(); // 0-indexed

  // Days in current month
  const daysInMonth = useMemo(() => {
    return new Date(year, month + 1, 0).getDate();
  }, [year, month]);

  const monthName = currentDate.toLocaleString("default", {
    month: "long",
    year: "numeric"
  });

  const nextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const prevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const toIsoDate = (d: string | Date): string => {
    if (typeof d === "string") {
      return d.split("T")[0];
    }
    return d.toISOString().split("T")[0];
  };

  // Helper to check bookings covering a specific room and day
  const getBookedForDate = (roomId: string, day: number) => {
    const pad = (n: number) => (n < 10 ? `0${n}` : `${n}`);
    const dateStr = `${year}-${pad(month + 1)}-${pad(day)}`;

    return bookings.filter((b) => {
      if (b.status === BookingStatus.CANCELLED || b.status === BookingStatus.EXPIRED) {
        return false;
      }
      const matchRoom = b.roomId === roomId || b.roomId.includes(roomId);
      const bIn = toIsoDate(b.checkIn);
      const bOut = toIsoDate(b.checkOut);
      return matchRoom && dateStr >= bIn && dateStr < bOut;
    });
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <Link
            href="/owner"
            className="p-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl transition"
            title="Back to Dashboard"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Room Occupancy Calendar
            </h1>
            <p className="text-xs text-stone-500">
              Interactive monthly occupancy view of booked dates across room categories.
            </p>
          </div>
        </div>

        {/* Month Selector */}
        <div className="flex items-center gap-2 bg-white border border-stone-200 rounded-xl p-1 shadow-sm">
          <button
            onClick={prevMonth}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 transition"
            aria-label="Previous Month"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <span className="text-xs font-semibold text-stone-800 px-3 min-w-[130px] text-center">
            {monthName}
          </span>
          <button
            onClick={nextMonth}
            className="p-1.5 hover:bg-stone-100 rounded-lg text-stone-600 transition"
            aria-label="Next Month"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {loading ? (
        <div className="bg-white border border-stone-200 rounded-2xl p-16 text-center text-xs text-stone-500 shadow-sm">
          <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-400" />
          Loading room grid and reservations...
        </div>
      ) : (
        <div className="space-y-6">
          {rooms.map((room) => (
            <div
              key={room.id}
              className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm overflow-hidden"
            >
              <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                <div className="flex items-center gap-2">
                  <BedDouble className="w-4 h-4 text-amber-800" />
                  <h2 className="text-sm font-bold text-stone-900">{room.name}</h2>
                  <span className="text-[10px] font-semibold text-stone-500 bg-stone-100 px-2 py-0.5 rounded-full">
                    {room.units} {room.units === 1 ? "unit" : "units"} total
                  </span>
                </div>
                <div className="text-xs text-stone-500 font-mono">
                  Base: ₹{room.basePrice.toLocaleString("en-IN")}/night
                </div>
              </div>

              {/* Month Days Grid */}
              <div className="overflow-x-auto pb-2">
                <div className="min-w-[700px]">
                  <div className="grid grid-cols-31 gap-1 text-center text-[10px] font-semibold text-stone-400 uppercase mb-1">
                    {Array.from({ length: daysInMonth }).map((_, i) => (
                      <div key={i + 1} className="py-1">
                        {i + 1}
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-31 gap-1">
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                      const day = i + 1;
                      const activeBookings = getBookedForDate(room.id, day);
                      const isBooked = activeBookings.length > 0;
                      const bookedCount = activeBookings.length;
                      const isFull = bookedCount >= room.units;

                      return (
                        <div
                          key={day}
                          title={
                            isBooked
                              ? `Day ${day}: ${bookedCount}/${room.units} units booked (${activeBookings
                                  .map((b) => `${b.code}: ${b.guestName}`)
                                  .join(", ")})`
                              : `Day ${day}: All ${room.units} units available`
                          }
                          className={`h-11 rounded-lg flex flex-col items-center justify-center border transition cursor-default text-[10px] ${
                            isFull
                              ? "bg-amber-800 text-white border-amber-900 font-bold"
                              : isBooked
                              ? "bg-amber-100/80 text-amber-900 border-amber-300 font-semibold"
                              : "bg-stone-50 hover:bg-stone-100 text-stone-500 border-stone-200"
                          }`}
                        >
                          <span>{day}</span>
                          {isBooked && (
                            <span className="text-[8px] opacity-80">
                              {bookedCount}u
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Legend & Summary */}
              <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-4 text-[11px] text-stone-500">
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-stone-50 border border-stone-200" />
                  <span>Available</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-100 border border-amber-300" />
                  <span>Partially Booked</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <div className="w-3 h-3 rounded bg-amber-800" />
                  <span>Fully Occupied</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
