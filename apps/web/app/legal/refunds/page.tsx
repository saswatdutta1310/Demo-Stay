import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";

export default function RefundsPage() {
  const { config, policies } = getClientConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Refund & Cancellation Policy</h1>
      <p className="text-xs text-neutral-500 mb-8">Last updated: November 2026</p>

      <div className="space-y-6 text-sm text-neutral-700 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">1. Cancellation Policy</h2>
          <p>
            {policies.cancellation}
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">2. Refund Processing</h2>
          <p>
            Eligible cancellations are processed within 5-7 business days to the original payment source via Razorpay.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">3. No-Show & Early Departure</h2>
          <p>
            In the event of a no-show or early departure without prior notice in accordance with cancellation terms,
            the booking fee is non-refundable.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">4. Questions & Support</h2>
          <p>
            For assistance with cancellations or refunds, please reach out to {config.contact.email} or call {config.contact.phone}.
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
