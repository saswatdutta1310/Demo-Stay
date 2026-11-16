import { getClientConfig } from "@/lib/client-config";

export default function FaqPage() {
  const { content } = getClientConfig();

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">Frequently Asked Questions</h1>
        <p className="text-xs text-stone-500 mt-2">Find answers to common guest questions.</p>
      </div>

      <div className="space-y-4">
        {content.faqs.map((faq, i) => (
          <div key={i} className="bg-white border border-stone-200 rounded-xl p-5 shadow-sm text-xs">
            <h3 className="font-bold text-stone-900 text-sm mb-2">{faq.question}</h3>
            <p className="text-stone-600 leading-relaxed">{faq.answer}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
