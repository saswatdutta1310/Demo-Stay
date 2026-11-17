import Link from "next/link";

export default function LegalIndexPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <h1 className="text-2xl font-bold text-neutral-900 mb-2">Legal Information</h1>
      <p className="text-xs text-neutral-500 mb-8">Official policies and terms</p>

      <ul className="space-y-4 text-sm">
        <li className="p-4 border border-neutral-200 rounded">
          <Link href="/legal/privacy" className="font-semibold text-neutral-900 hover:underline block mb-1">
            Privacy Policy →
          </Link>
          <p className="text-xs text-neutral-600">How we handle and protect guest personal information.</p>
        </li>
        <li className="p-4 border border-neutral-200 rounded">
          <Link href="/legal/terms" className="font-semibold text-neutral-900 hover:underline block mb-1">
            Terms of Service →
          </Link>
          <p className="text-xs text-neutral-600">Terms and conditions governing accommodations and reservations.</p>
        </li>
        <li className="p-4 border border-neutral-200 rounded">
          <Link href="/legal/refunds" className="font-semibold text-neutral-900 hover:underline block mb-1">
            Refund & Cancellation Policy →
          </Link>
          <p className="text-xs text-neutral-600">Cancellation deadlines and refund timelines.</p>
        </li>
      </ul>
    </div>
  );
}
