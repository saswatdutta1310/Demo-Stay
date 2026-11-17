"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import Link from "next/link";
import {
  getOwnerBookings,
  refundBooking,
  OwnerBookingRecord
} from "@/lib/api";
import { BookingStatus } from "@hotel-demo/shared";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import {
  DollarSign,
  TrendingUp,
  RefreshCw,
  Calendar,
  ListFilter,
  CheckCircle2,
  Clock,
  RotateCcw,
  LogOut,
  AlertTriangle
} from "lucide-react";

export default function OwnerDashboard() {
  useOwnerAuth();

  const [bookings, setBookings] = useState<OwnerBookingRecord[]>([]);
  const [newRowIds, setNewRowIds] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);
  const [lastUpdated, setLastUpdated] = useState<Date>(new Date());
  const [refundTarget, setRefundTarget] = useState<OwnerBookingRecord | null>(null);
  const [refunding, setRefunding] = useState(false);
  const previousIdsRef = useRef<Set<string>>(new Set());

  // Function to poll bookings
  const fetchFeed = async (isInitial = false) => {
    try {
      const data = await getOwnerBookings();
      setBookings(data);
      setLastUpdated(new Date());

      if (!isInitial && previousIdsRef.current.size > 0) {
        const freshlyAdded = data.filter((b) => b.id && !previousIdsRef.current.has(b.id));
        if (freshlyAdded.length > 0) {
          const freshSet = new Set<string>();
          freshlyAdded.forEach((b) => {
            if (b.id) freshSet.add(b.id);
          });
          setNewRowIds(freshSet);
          setTimeout(() => {
            setNewRowIds(new Set());
          }, 6000);
        }
      }

      const idSet = new Set<string>();
      data.forEach((b) => {
        if (b.id) idSet.add(b.id);
      });
      previousIdsRef.current = idSet;
    } catch (err) {
      console.error("Polling error in owner dashboard:", err);
    } finally {
      if (isInitial) setLoading(false);
    }
  };

  // Live SSE stream with fallback to 3-second polling
  useEffect(() => {
    fetchFeed(true);

    let eventSource: EventSource | null = null;
    let pollInterval: NodeJS.Timeout | null = null;

    const startPollingFallback = () => {
      if (!pollInterval) {
        pollInterval = setInterval(() => {
          fetchFeed(false);
        }, 3000);
      }
    };

    try {
      const apiBase = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api/v1";
      const token = sessionStorage.getItem("owner_token");
      const streamUrl = `${apiBase}/owner/stream${token ? `?token=${encodeURIComponent(token)}` : ""}`;

      eventSource = new EventSource(streamUrl);

      eventSource.onmessage = (event) => {
        try {
          const parsed = JSON.parse(event.data);
          if (parsed.type === "booking.created" || parsed.type === "payment.updated") {
            fetchFeed(false);
          }
        } catch {
          // ignore non-json
        }
      };

      eventSource.onerror = () => {
        // SSE connection failed or not supported by endpoint, fallback to 3s polling
        eventSource?.close();
        startPollingFallback();
      };
    } catch {
      startPollingFallback();
    }

    return () => {
      if (eventSource) eventSource.close();
      if (pollInterval) clearInterval(pollInterval);
    };
  }, []);

  // Format date helper
  const toDateString = (dateVal?: string | Date): string => {
    if (!dateVal) return "";
    return typeof dateVal === "string"
      ? dateVal
      : dateVal.toISOString();
  };

  // Today's metrics
  const todayRevenue = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return bookings
      .filter((b) => {
        const isConfirmed = b.status === BookingStatus.CONFIRMED;
        const createdAtStr = toDateString(b.createdAt);
        const bookedToday = createdAtStr.startsWith(today);
        return isConfirmed && bookedToday;
      })
      .reduce((acc, curr) => acc + curr.totalAmount, 0);
  }, [bookings]);

  const todayBookingCount = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return bookings.filter((b) => toDateString(b.createdAt).startsWith(today)).length;
  }, [bookings]);

  const activeConfirmedCount = useMemo(() => {
    return bookings.filter((b) => b.status === BookingStatus.CONFIRMED).length;
  }, [bookings]);

  // Execute refund
  const handleConfirmRefund = async () => {
    if (!refundTarget || !refundTarget.id) return;
    setRefunding(true);
    try {
      await refundBooking(refundTarget.id);
      setRefundTarget(null);
      await fetchFeed(false);
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to refund booking");
    } finally {
      setRefunding(false);
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem("owner_authenticated");
    window.location.href = "/owner/login";
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-serif font-bold text-stone-900">
              Owner Management Dashboard
            </h1>
            <span className="flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-0.5 rounded-full">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              Live 3s Feed
            </span>
          </div>
          <p className="text-xs text-stone-500 mt-1">
            Real-time feed updated at {lastUpdated.toLocaleTimeString()}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/owner/bookings"
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition flex items-center gap-1.5"
          >
            <ListFilter className="w-4 h-4" /> Filter Bookings
          </Link>
          <Link
            href="/owner/calendar"
            className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <Calendar className="w-4 h-4" /> Occupancy Calendar
          </Link>
          <button
            onClick={handleLogout}
            className="p-2 text-stone-400 hover:text-stone-700 hover:bg-stone-100 rounded-xl transition"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-stone-600">Today&apos;s Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-stone-900">
            ₹{todayRevenue.toLocaleString("en-IN")}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">
            From direct bookings processed today
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-stone-600">Today&apos;s Bookings</span>
            <TrendingUp className="w-4 h-4 text-amber-700" />
          </div>
          <span className="text-2xl font-bold text-stone-900">
            {todayBookingCount}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">
            New reservations received today
          </span>
        </div>

        <div className="bg-white border border-stone-200 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold text-stone-600">Active Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-stone-900">
            {activeConfirmedCount}
          </span>
          <span className="text-[11px] text-stone-500 block mt-1">
            Total active guest reservations
          </span>
        </div>
      </div>

      {/* Bookings Live Table / Cards */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-4 sm:px-6 border-b border-stone-100 flex items-center justify-between">
          <div>
            <h2 className="text-sm font-bold text-stone-900">Recent Bookings Feed</h2>
            <p className="text-[11px] text-stone-500">
              New arrivals and reservations are automatically refreshed every 3 seconds.
            </p>
          </div>
          <button
            onClick={() => fetchFeed(false)}
            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition"
            title="Refresh now"
          >
            <RefreshCw className="w-4 h-4" />
          </button>
        </div>

        {loading ? (
          <div className="py-12 text-center text-stone-500 text-xs">
            <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-400" />
            Loading reservations feed...
          </div>
        ) : bookings.length === 0 ? (
          <div className="py-12 text-center text-stone-500 text-xs">
            No bookings recorded yet.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Guest</th>
                    <th className="py-3 px-4">Room Category</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment ID</th>
                    <th className="py-3 px-4">Time</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {bookings.map((b) => {
                    const isNew = b.id ? newRowIds.has(b.id) : false;
                    return (
                      <tr
                        key={b.id || b.code}
                        className={`transition-colors duration-500 ${
                          isNew
                            ? "bg-amber-100/70 ring-1 ring-amber-400 font-medium"
                            : "hover:bg-stone-50"
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                          {b.code}
                          {isNew && (
                            <span className="ml-2 text-[9px] font-bold bg-amber-500 text-white px-1.5 py-0.5 rounded uppercase">
                              NEW
                            </span>
                          )}
                        </td>
                        <td className="py-3.5 px-4">
                          <p className="font-semibold text-stone-900">{b.guestName}</p>
                          <p className="text-[11px] text-stone-400">{b.guestPhone}</p>
                        </td>
                        <td className="py-3.5 px-4 font-medium capitalize">
                          {b.roomId.replace(/-/g, " ")}
                        </td>
                        <td className="py-3.5 px-4 font-bold text-stone-900">
                          ₹{b.totalAmount.toLocaleString("en-IN")}
                        </td>
                        <td className="py-3.5 px-4">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                              b.status === BookingStatus.CONFIRMED
                                ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                                : b.status === BookingStatus.CANCELLED
                                ? "bg-red-50 text-red-700 border border-red-200"
                                : "bg-amber-50 text-amber-800 border border-amber-200"
                            }`}
                          >
                            {b.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-4 font-mono text-[11px] text-stone-500">
                          {b.paymentId || "—"}
                        </td>
                        <td className="py-3.5 px-4 text-stone-400 text-[11px]">
                          {b.createdAt
                            ? new Date(b.createdAt).toLocaleTimeString([], {
                                hour: "2-digit",
                                minute: "2-digit"
                              })
                            : "—"}
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          {b.status === BookingStatus.CONFIRMED ? (
                            <button
                              onClick={() => setRefundTarget(b)}
                              className="px-2.5 py-1 text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-[11px] font-semibold transition inline-flex items-center gap-1"
                            >
                              <RotateCcw className="w-3 h-3" /> Refund
                            </button>
                          ) : (
                            <span className="text-stone-300 text-[11px]">—</span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-stone-100">
              {bookings.map((b) => {
                const isNew = b.id ? newRowIds.has(b.id) : false;
                return (
                  <div
                    key={b.id || b.code}
                    className={`p-4 space-y-2 transition-colors duration-500 ${
                      isNew ? "bg-amber-100/70 border-l-4 border-amber-500" : ""
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-mono font-bold text-amber-900 text-sm">
                        {b.code}
                      </span>
                      <span
                        className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${
                          b.status === BookingStatus.CONFIRMED
                            ? "bg-emerald-50 text-emerald-700"
                            : b.status === BookingStatus.CANCELLED
                            ? "bg-red-50 text-red-700"
                            : "bg-amber-50 text-amber-800"
                        }`}
                      >
                        {b.status}
                      </span>
                    </div>

                    <div className="text-xs text-stone-700">
                      <p className="font-semibold text-stone-900">{b.guestName}</p>
                      <p className="text-[11px] text-stone-500 capitalize">
                        {b.roomId.replace(/-/g, " ")} • {b.guestPhone}
                      </p>
                    </div>

                    <div className="flex items-center justify-between text-xs pt-1 border-t border-stone-100">
                      <div>
                        <span className="font-bold text-stone-900">
                          ₹{b.totalAmount.toLocaleString("en-IN")}
                        </span>
                        <span className="text-[10px] text-stone-400 block font-mono">
                          {b.paymentId || "No Payment ID"}
                        </span>
                      </div>

                      {b.status === BookingStatus.CONFIRMED && (
                        <button
                          onClick={() => setRefundTarget(b)}
                          className="px-2.5 py-1 text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-xs font-semibold transition"
                        >
                          Refund
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </>
        )}
      </div>

      {/* Mock Refund Confirmation Dialog */}
      {refundTarget && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4"
        >
          <div className="bg-white border border-stone-200 rounded-3xl max-w-sm w-full p-6 shadow-xl text-center">
            <div className="w-12 h-12 bg-red-100 text-red-700 rounded-full flex items-center justify-center mx-auto mb-3">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-base font-bold text-stone-900 mb-1">
              Confirm Mock Refund?
            </h3>
            <p className="text-xs text-stone-500 mb-4">
              Are you sure you want to refund reservation{" "}
              <strong className="text-stone-800">{refundTarget.code}</strong> for{" "}
              <strong>₹{refundTarget.totalAmount.toLocaleString("en-IN")}</strong>?
              This will update the reservation and mock payment status.
            </p>

            <div className="flex gap-2">
              <button
                onClick={() => setRefundTarget(null)}
                disabled={refunding}
                className="flex-1 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-xl transition"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmRefund}
                disabled={refunding}
                className="flex-1 py-2.5 bg-red-700 hover:bg-red-800 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
              >
                {refunding ? (
                  <>
                    <Clock className="w-4 h-4 animate-spin" /> Processing...
                  </>
                ) : (
                  <>
                    <RotateCcw className="w-4 h-4" /> Issue Refund
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
