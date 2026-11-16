import { getClientConfig } from "@/lib/client-config";

export default function PoliciesPage() {
  const { policies } = getClientConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Guest Guidelines & Policies</h1>
        <p className="text-xs text-stone-500 mt-2">Clear, fair policies for a pleasant stay.</p>
      </div>

      <div className="bg-white border border-stone-200 rounded-2xl p-8 space-y-6 text-xs text-stone-700 shadow-sm leading-relaxed">
        <div>
          <h2 className="text-sm font-bold text-stone-900 mb-1">Check-in & Check-out</h2>
          <p>• Check-in time: <strong>{policies.checkInTime}</strong></p>
          <p>• Check-out time: <strong>{policies.checkOutTime}</strong></p>
        </div>

        <div className="border-t border-stone-100 pt-4">
          <h2 className="text-sm font-bold text-stone-900 mb-1">Cancellation & Refunds</h2>
          <p>{policies.cancellation}</p>
        </div>

        <div className="border-t border-stone-100 pt-4">
          <h2 className="text-sm font-bold text-stone-900 mb-1">Identification Requirements</h2>
          <ul className="list-disc pl-4 space-y-1">
            {policies.idRules.map((rule, i) => (
              <li key={i}>{rule}</li>
            ))}
          </ul>
        </div>

        <div className="border-t border-stone-100 pt-4">
          <h2 className="text-sm font-bold text-stone-900 mb-1">Couples & Children</h2>
          <p>• {policies.coupleRules}</p>
          <p>• {policies.childRules}</p>
        </div>
      </div>
    </div>
  );
}
