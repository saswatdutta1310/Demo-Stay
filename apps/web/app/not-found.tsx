import Link from "next/link";
import { Compass, Home, Calendar, HelpCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto px-4 py-20 text-center">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 sm:p-10 shadow-sm">
        <div className="w-16 h-16 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <Compass className="w-8 h-8" />
        </div>

        <span className="text-[11px] font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-3 py-1 rounded-full border border-amber-200">
          Error 404 • Page Not Found
        </span>

        <h1 className="text-2xl sm:text-3xl font-serif font-bold text-stone-900 mt-4 mb-2">
          Looks Like You Took a Detour
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mb-6 leading-relaxed">
          The page or room category you are looking for doesn&apos;t exist or has moved. Here are recommended steps to get back on track:
        </p>

        {/* Helpful next steps */}
        <div className="space-y-2.5 text-left mb-6">
          <Link
            href="/rooms"
            className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition text-xs font-semibold text-stone-800"
          >
            <div className="flex items-center gap-2.5">
              <Calendar className="w-4 h-4 text-amber-800" />
              <span>Explore Available Rooms & Rates</span>
            </div>
            <span className="text-stone-400">→</span>
          </Link>

          <Link
            href="/my-booking"
            className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition text-xs font-semibold text-stone-800"
          >
            <div className="flex items-center gap-2.5">
              <Compass className="w-4 h-4 text-amber-800" />
              <span>Retrieve an Existing Reservation</span>
            </div>
            <span className="text-stone-400">→</span>
          </Link>

          <Link
            href="/faq"
            className="flex items-center justify-between p-3 rounded-xl bg-stone-50 hover:bg-stone-100 border border-stone-100 transition text-xs font-semibold text-stone-800"
          >
            <div className="flex items-center gap-2.5">
              <HelpCircle className="w-4 h-4 text-amber-800" />
              <span>Check Guest FAQs & Policies</span>
            </div>
            <span className="text-stone-400">→</span>
          </Link>
        </div>

        <div className="flex justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm"
          >
            <Home className="w-4 h-4" /> Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
