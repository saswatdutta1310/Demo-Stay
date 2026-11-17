import { getClientConfig } from "@/lib/client-config";
import {
  Clock,
  ShieldCheck,
  Ban,
  Heart,
  FileCheck
} from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = getClientConfig();
  return {
    title: `Guest Policies & House Rules | ${config.name}`,
    description: `Read policies on check-in, check-out, cancellation, guest IDs, and house rules for ${config.name}.`
  };
}

export default function PoliciesPage() {
  const { policies, config } = getClientConfig();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Guest Policies & House Rules
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Clear, transparent guidelines designed to provide a serene and comfortable stay for all guests at {config.name}.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Check-In & Check-Out Card */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <Clock className="w-5 h-5" />
            <h2 className="text-sm font-bold text-stone-900">Check-in & Check-out</h2>
          </div>
          <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <p>
              • Standard Check-in Time: <strong>{policies.checkInTime}</strong>
            </p>
            <p>
              • Standard Check-out Time: <strong>{policies.checkOutTime}</strong>
            </p>
            <p className="text-[11px] text-stone-500 pt-1">
              Early check-in or late check-out is strictly subject to room availability on arrival.
            </p>
          </div>
        </div>

        {/* Cancellation Policy */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <ShieldCheck className="w-5 h-5" />
            <h2 className="text-sm font-bold text-stone-900">Cancellation & Refunds</h2>
          </div>
          <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <p className="font-semibold text-emerald-800 bg-emerald-50 p-2.5 rounded-xl border border-emerald-100">
              {policies.cancellation}
            </p>
            <p className="text-[11px] text-stone-500">
              Cancellations requested after the 24-hour window before check-in or no-shows are non-refundable. Eligible refunds are processed back to the original payment method within 5-7 business days.
            </p>
          </div>
        </div>

        {/* Identification Requirements */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <FileCheck className="w-5 h-5" />
            <h2 className="text-sm font-bold text-stone-900">Identification Rules</h2>
          </div>
          <div className="space-y-2 text-xs text-stone-600 leading-relaxed">
            <p>
              In compliance with local government regulations:
            </p>
            <ul className="list-disc pl-4 space-y-1">
              {policies.idRules.map((rule, idx) => (
                <li key={idx}>{rule}</li>
              ))}
            </ul>
            <div className="mt-2 p-2.5 bg-stone-50 rounded-xl border border-stone-100">
              <span className="font-semibold text-stone-700 block mb-1">
                Accepted Photo IDs:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {policies.acceptedIdTypes.map((id, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-white border border-stone-200 px-2 py-0.5 rounded text-stone-700"
                  >
                    {id}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Couple & Family Rules */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <Heart className="w-5 h-5" />
            <h2 className="text-sm font-bold text-stone-900">Couples & Family Guidelines</h2>
          </div>
          <div className="space-y-2.5 text-xs text-stone-600 leading-relaxed">
            <div>
              <span className="font-semibold text-stone-800">Couples Policy:</span>
              <p>{policies.coupleRules}. Both partners must present valid individual original government photo IDs.</p>
            </div>
            <div>
              <span className="font-semibold text-stone-800">Children:</span>
              <p>{policies.childRules}</p>
            </div>
            <div>
              <span className="font-semibold text-stone-800">Primary Guest:</span>
              <p>Primary guest must be {policies.primaryGuestAge} years of age at check-in.</p>
            </div>
          </div>
        </div>

        {/* Property Restrictions */}
        <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm md:col-span-2">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <Ban className="w-5 h-5" />
            <h2 className="text-sm font-bold text-stone-900">Property Restrictions</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="font-bold text-stone-800 block mb-1">Group Restrictions</span>
              <p className="text-stone-600">{policies.groupRules}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="font-bold text-stone-800 block mb-1">Pets</span>
              <p className="text-stone-600">{policies.petRules}</p>
            </div>
            <div className="p-3 bg-stone-50 rounded-xl border border-stone-100">
              <span className="font-bold text-stone-800 block mb-1">Smoking & Alcohol</span>
              <p className="text-stone-600">{policies.smokingRules}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
