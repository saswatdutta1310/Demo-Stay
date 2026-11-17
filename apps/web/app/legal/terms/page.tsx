import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";

export default function TermsPage() {
  const { config, policies } = getClientConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Terms of Service</h1>
      <p className="text-xs text-neutral-500 mb-8">Last updated: November 2026</p>

      <div className="space-y-6 text-sm text-neutral-700 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">1. Booking Agreement</h2>
          <p>
            By booking accommodations at {config.name}, guests agree to adhere to property policies, check-in/check-out timings,
            and guest verification rules.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">2. Check-In & Check-Out</h2>
          <p>
            Standard check-in time is {policies.checkInTime} and check-out time is {policies.checkOutTime}. Early check-in or late check-out
            is subject to room availability and prior arrangement.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">3. Identity Verification</h2>
          <p>
            Every adult guest must present a valid government-issued photo ID at check-in (e.g. Passport, Aadhaar, Driving License, or Govt ID).
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">4. Contact Information</h2>
          <p>
            Address: {config.contact.address || config.location?.address}
            <br />
            Phone: {config.contact.phone} | Email: {config.contact.email}
          </p>
        </section>
      </div>

      <div className="mt-8 pt-6 border-t border-neutral-200">
        <Link href="/" className="text-xs text-neutral-600 hover:underline">
          ← Back to home
        </Link>
      </div>
    </div>
  );
}
