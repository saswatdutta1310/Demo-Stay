import { getClientConfig } from "@/lib/client-config";
import Link from "next/link";

export default function PrivacyPage() {
  const { config } = getClientConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Privacy Policy</h1>
      <p className="text-xs text-neutral-500 mb-8">Last updated: November 2026</p>

      <div className="space-y-6 text-sm text-neutral-700 leading-relaxed">
        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">1. Overview</h2>
          <p>
            {config.name} respects your privacy and is committed to protecting your personal data.
            This privacy policy explains how we handle your personal information when you use our direct booking website.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">2. Information We Collect</h2>
          <p>
            When making a room reservation, we collect guest contact details (full name, phone number, email address)
            and government ID verification details required under local hospitality regulations.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">3. Payment Information</h2>
          <p>
            Payment processing is handled securely by Razorpay. We do not store full credit/debit card numbers or UPI MPINs on our servers.
          </p>
        </section>

        <section>
          <h2 className="text-base font-semibold text-neutral-900 mb-2">4. Contact Us</h2>
          <p>
            If you have questions regarding this privacy policy, please contact us at {config.contact.email} or call {config.contact.phone}.
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
