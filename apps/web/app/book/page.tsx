"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck, Info } from "lucide-react";

export default function BookPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    checkIn: "2026-12-01",
    checkOut: "2026-12-03",
    room: "deluxe-ac-room",
    guestName: "",
    guestEmail: "",
    guestPhone: "",
    guestsCount: 2,
    specialRequests: ""
  });

  const handleBooking = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate Razorpay payment modal and redirect to confirmation
    const dummyCode = `DS-${Math.floor(1000 + Math.random() * 9000)}`;
    router.push(`/book/confirmation/${dummyCode}`);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Form Details */}
        <div className="md:col-span-2 bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
          <h1 className="text-2xl font-serif font-bold text-stone-900 mb-2">Complete Your Reservation</h1>
          <p className="text-xs text-stone-500 mb-6">Rates are locked for 15 minutes while you finalize your details.</p>

          <form onSubmit={handleBooking} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Check-In Date</label>
                <input
                  type="date"
                  required
                  value={formData.checkIn}
                  onChange={(e) => setFormData({ ...formData, checkIn: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-stone-700 mb-1">Check-Out Date</label>
                <input
                  type="date"
                  required
                  value={formData.checkOut}
                  onChange={(e) => setFormData({ ...formData, checkOut: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-700 mb-1">Select Room</label>
              <select
                value={formData.room}
                onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                className="w-full border border-stone-300 rounded-lg p-2.5 text-xs"
              >
                <option value="deluxe-ac-room">Deluxe AC Double Room (₹2,200/night)</option>
                <option value="premium-ac-suite">Premium AC Family Suite (₹3,500/night)</option>
                <option value="standard-non-ac-room">Standard Non-AC Room (₹1,200/night)</option>
              </select>
            </div>

            <div className="border-t border-stone-100 pt-4 space-y-4">
              <h3 className="font-semibold text-stone-900 text-sm">Guest Contact Details</h3>
              <div>
                <label className="block text-xs text-stone-600 mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={formData.guestName}
                  onChange={(e) => setFormData({ ...formData, guestName: e.target.value })}
                  className="w-full border border-stone-300 rounded-lg p-2.5 text-xs"
                />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    placeholder="aarav@example.com"
                    value={formData.guestEmail}
                    onChange={(e) => setFormData({ ...formData, guestEmail: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
                <div>
                  <label className="block text-xs text-stone-600 mb-1">Phone Number (WhatsApp)</label>
                  <input
                    type="tel"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.guestPhone}
                    onChange={(e) => setFormData({ ...formData, guestPhone: e.target.value })}
                    className="w-full border border-stone-300 rounded-lg p-2.5 text-xs"
                  />
                </div>
              </div>
            </div>

            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-md transition"
              >
                Pay & Confirm Booking via Razorpay
              </button>
            </div>
          </form>
        </div>

        {/* Pricing Summary Card */}
        <div className="bg-stone-100 border border-stone-200 rounded-2xl p-6 h-fit space-y-4 text-xs">
          <h3 className="font-bold text-stone-900 text-sm">Price Breakdown</h3>
          <div className="space-y-2 text-stone-600">
            <div className="flex justify-between">
              <span>Room Rate (2 Nights)</span>
              <span>₹4,400</span>
            </div>
            <div className="flex justify-between">
              <span>Taxes & GST (12%)</span>
              <span>₹528</span>
            </div>
            <div className="flex justify-between font-bold text-stone-900 text-sm border-t border-stone-300 pt-2">
              <span>Total Payable</span>
              <span>₹4,928</span>
            </div>
          </div>

          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-900 flex items-start gap-2">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <span>Razorpay Test Mode: Simulated test card or UPI available during demo.</span>
          </div>
        </div>
      </div>
    </div>
  );
}
