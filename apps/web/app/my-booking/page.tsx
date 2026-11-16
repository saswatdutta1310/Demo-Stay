"use client";

import { useState } from "react";
import { Search } from "lucide-react";

export default function MyBookingPage() {
  const [code, setCode] = useState("");
  const [phone, setPhone] = useState("");

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Looking up reservation ${code} for ${phone}`);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold text-stone-900 mb-1">Retrieve Booking</h1>
        <p className="text-xs text-stone-500 mb-6">Enter your booking code and phone number to check confirmation.</p>

        <form onSubmit={handleSearch} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Booking Reference Code</label>
            <input
              type="text"
              required
              placeholder="e.g. DS-4921"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-2.5 text-xs font-mono"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">Registered Phone</label>
            <input
              type="tel"
              required
              placeholder="+91 98765 43210"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full border border-stone-300 rounded-lg p-2.5 text-xs"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" /> Find Voucher
          </button>
        </form>
      </div>
    </div>
  );
}
