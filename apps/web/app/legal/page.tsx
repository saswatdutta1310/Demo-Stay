export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12 text-xs text-stone-700 space-y-6 leading-relaxed">
      <h1 className="text-2xl font-serif font-bold text-stone-900">Legal Terms & Policies</h1>
      <p className="text-stone-500">Mandatory compliance pages required by Razorpay payment gateway onboarding.</p>

      <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-stone-900">1. Terms of Service</h2>
        <p>By booking direct through this portal, guests agree to abide by the property house rules, occupancy limits, and verification requirements.</p>
      </section>

      <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-stone-900">2. Privacy Policy</h2>
        <p>We respect your personal privacy. Guest details, phone numbers, and emails are collected solely to facilitate room booking confirmations and check-in logistics.</p>
      </section>

      <section className="bg-white border border-stone-200 rounded-xl p-6 shadow-sm space-y-3">
        <h2 className="text-sm font-bold text-stone-900">3. Cancellation & Refund Policy</h2>
        <p>Guests receive 100% refund on cancellations initiated at least 48 hours prior to the check-in time. Refunds are processed back to the original payment source within 5-7 banking days.</p>
      </section>
    </div>
  );
}
