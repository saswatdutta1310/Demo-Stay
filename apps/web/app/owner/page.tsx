import Link from "next/link";
import { DollarSign, Calendar, TrendingUp, Bell } from "lucide-react";

export default function OwnerDashboard() {
  const dummyFeed = [
    { code: "DS-9281", guest: "Aarav Sharma", room: "Deluxe AC Room", amount: 4928, time: "2 mins ago" },
    { code: "DS-8192", guest: "Pooja Mishra", room: "Family Suite", amount: 7840, time: "18 mins ago" }
  ];

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-stone-900">Owner Live Dashboard</h1>
          <p className="text-xs text-stone-500">Real-time bookings, payments, and calendar feed.</p>
        </div>
        <div className="flex gap-2">
          <Link href="/owner/bookings" className="px-3 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold rounded-lg">
            All Bookings
          </Link>
          <Link href="/owner/calendar" className="px-3 py-1.5 bg-amber-800 hover:bg-amber-900 text-white text-xs font-semibold rounded-lg">
            Calendar
          </Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Direct Bookings Revenue</span>
            <DollarSign className="w-4 h-4 text-emerald-600" />
          </div>
          <span className="text-2xl font-bold text-stone-900">₹62,800</span>
          <span className="text-[11px] text-emerald-600 block mt-1">Saved ~₹11,300 in OTA fees</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Occupancy This Week</span>
            <TrendingUp className="w-4 h-4 text-amber-700" />
          </div>
          <span className="text-2xl font-bold text-stone-900">85%</span>
          <span className="text-[11px] text-stone-500 block mt-1">7 out of 9 total units active</span>
        </div>

        <div className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm">
          <div className="flex items-center justify-between text-stone-500 mb-2">
            <span className="text-xs font-semibold">Direct Guest Inquiries</span>
            <Bell className="w-4 h-4 text-blue-600" />
          </div>
          <span className="text-2xl font-bold text-stone-900">14 Inquiries</span>
          <span className="text-[11px] text-stone-500 block mt-1">Via website WhatsApp button</span>
        </div>
      </div>

      {/* Live Payment Activity Feed */}
      <div className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm">
        <h3 className="font-bold text-stone-900 text-sm mb-4 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Live Payment & Bookings Feed
        </h3>

        <div className="divide-y divide-stone-100 text-xs">
          {dummyFeed.map((item, i) => (
            <div key={i} className="py-3 flex items-center justify-between">
              <div>
                <span className="font-mono font-bold text-amber-900">{item.code}</span>
                <span className="mx-2">•</span>
                <span className="font-semibold text-stone-800">{item.guest}</span>
                <span className="text-stone-500 block text-[11px]">{item.room}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-emerald-700 block">₹{item.amount}</span>
                <span className="text-[10px] text-stone-400">{item.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
