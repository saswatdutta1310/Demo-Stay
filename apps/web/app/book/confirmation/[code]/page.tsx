import Link from "next/link";
import { CheckCircle2, Download, Home } from "lucide-react";

export default function ConfirmationPage({ params }: { params: { code: string } }) {
  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
        <div className="w-16 h-16 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full">
          Payment Confirmed
        </span>

        <h1 className="text-2xl font-serif font-bold text-stone-900 mt-3">Booking Confirmed!</h1>
        <p className="text-xs text-stone-500 mt-1">A confirmation voucher was dispatched to your email and WhatsApp.</p>

        <div className="my-6 p-4 bg-stone-50 rounded-2xl border border-stone-200 text-left space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-stone-500">Booking Reference:</span>
            <span className="font-mono font-bold text-amber-900">{params.code}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Status:</span>
            <span className="font-semibold text-emerald-700">CONFIRMED</span>
          </div>
          <div className="flex justify-between">
            <span className="text-stone-500">Check-In:</span>
            <span className="font-semibold text-stone-800">12:00 PM (01 Dec 2026)</span>
          </div>
        </div>

        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Home className="w-4 h-4" /> Home
          </Link>
          <Link
            href="/my-booking"
            className="px-4 py-2 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition flex items-center gap-1.5"
          >
            <Download className="w-4 h-4" /> Manage Booking
          </Link>
        </div>
      </div>
    </div>
  );
}
