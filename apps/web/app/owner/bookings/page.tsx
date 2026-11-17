"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { getOwnerBookings, refundBooking, OwnerBookingRecord } from "@/lib/api";
import { BookingStatus } from "@hotel-demo/shared";
import { useOwnerAuth } from "@/hooks/useOwnerAuth";
import {
  ArrowLeft,
  Search,
  Filter,
  RotateCcw,
  Clock,
  AlertTriangle,
  Calendar as CalendarIcon
} from "lucide-react";

export default function OwnerBookingsPage() {
  useOwnerAuth();

  const [bookings, setBookings] = useState<OwnerBookingRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [refundTarget, setRefundTarget] = useState<OwnerBookingRecord | null>(null);
  const [refunding, setRefunding] = useState(false);

  const loadData = async () => {
    try {
      const data = await getOwnerBookings();
      setBookings(data);
    } catch (err) {
      console.error("Failed to load owner bookings:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleRefund = async () => {
    if (!refundTarget || !refundTarget.id) return;
    setRefunding(true);
    try {
      await refundBooking(refundTarget.id);
      setRefundTarget(null);
      await loadData();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to refund");
    } finally {
      setRefunding(false);
    }
  };

  const formatDate = (d: string | Date): string => {
    const dateObj = typeof d === "string" ? new Date(d) : d;
    return dateObj.toLocaleDateString("en-IN", {
      day: "numeric",
      month: "short"
    });
  };

  const filtered = useMemo(() => {
    return bookings.filter((b) => {
      const matchStatus =
        filterStatus === "ALL" || b.status === filterStatus;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        b.code.toLowerCase().includes(q) ||
        b.guestName.toLowerCase().includes(q) ||
        b.guestPhone.includes(q) ||
        b.guestEmail.toLowerCase().includes(q);
      return matchStatus && matchQuery;
    });
  }, [bookings, filterStatus, searchQuery]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-8">
      {/* Top Header */}
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
              Bookings Manager
            </h1>
            <p className="text-xs text-stone-500">
              Filter by status, search guest records, and manage reservation statuses.
            </p>
          </div>
        </div>

        <Link
          href="/owner/calendar"
          className="px-3.5 py-2 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-xl shadow-sm transition flex items-center gap-1.5"
        >
          <CalendarIcon className="w-4 h-4" /> View Calendar
        </Link>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-sm mb-6 flex flex-wrap items-center justify-between gap-4">
        {/* Status Filters */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="w-4 h-4 text-stone-400 mr-1" />
          {["ALL", BookingStatus.CONFIRMED, BookingStatus.PENDING, BookingStatus.CANCELLED].map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition ${
                  filterStatus === status
                    ? "bg-amber-800 text-white shadow-sm"
                    : "bg-stone-100 hover:bg-stone-200 text-stone-700"
                }`}
              >
                {status}
              </button>
            )
          )}
        </div>

        {/* Search Input */}
        <div className="relative min-w-[240px]">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search by code, guest or phone..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 border border-stone-300 rounded-xl text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>
      </div>

      {/* Results View */}
      <div className="bg-white border border-stone-200 rounded-2xl overflow-hidden shadow-sm">
        {loading ? (
          <div className="py-12 text-center text-xs text-stone-500">
            <Clock className="w-6 h-6 animate-spin mx-auto mb-2 text-stone-400" />
            Loading reservations...
          </div>
        ) : filtered.length === 0 ? (
          <div className="py-12 text-center text-xs text-stone-500">
            No bookings found matching selected filters.
          </div>
        ) : (
          <>
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-100 text-stone-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3 px-4">Code</th>
                    <th className="py-3 px-4">Guest Details</th>
                    <th className="py-3 px-4">Room Category</th>
                    <th className="py-3 px-4">Stay Dates</th>
                    <th className="py-3 px-4">Amount</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4">Payment Reference</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100 text-stone-700">
                  {filtered.map((b) => (
                    <tr key={b.id || b.code} className="hover:bg-stone-50 transition">
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-900">
                        {b.code}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-900">{b.guestName}</p>
                        <p className="text-[11px] text-stone-400">{b.guestPhone}</p>
                        <p className="text-[11px] text-stone-400">{b.guestEmail}</p>
                      </td>
                      <td className="py-3.5 px-4 capitalize font-medium">
                        {b.roomId.replace(/-/g, " ")}
                      </td>
                      <td className="py-3.5 px-4">
                        <p className="font-semibold text-stone-800">
                          {formatDate(b.checkIn)} → {formatDate(b.checkOut)}
                        </p>
                        <p className="text-[11px] text-stone-400">
                          {b.nights} {b.nights === 1 ? "night" : "nights"} • {b.guestsCount} guests
                        </p>
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
                      <td className="py-3.5 px-4 text-right">
                        {b.status === BookingStatus.CONFIRMED && (
                          <button
                            onClick={() => setRefundTarget(b)}
                            className="px-2.5 py-1 text-red-700 hover:bg-red-50 border border-red-200 rounded-lg text-[11px] font-semibold transition inline-flex items-center gap-1"
                          >
                            <RotateCcw className="w-3 h-3" /> Refund
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden divide-y divide-stone-100">
              {filtered.map((b) => (
                <div key={b.id || b.code} className="p-4 space-y-2">
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
                    <p className="text-[11px] text-stone-500">
                      {formatDate(b.checkIn)} → {formatDate(b.checkOut)} ({b.nights} nights)
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-xs pt-2 border-t border-stone-100">
                    <span className="font-bold text-stone-900">
                      ₹{b.totalAmount.toLocaleString("en-IN")}
                    </span>

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
              ))}
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
                onClick={handleRefund}
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
