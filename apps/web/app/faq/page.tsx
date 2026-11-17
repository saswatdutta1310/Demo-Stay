import { getClientConfig } from "@/lib/client-config";
import { HelpCircle, ChevronDown } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = getClientConfig();
  return {
    title: `Frequently Asked Questions | ${config.name}`,
    description: `Find answers about check-in, temple distances, accepted IDs, amenities, and policies at ${config.name}.`
  };
}

export default function FaqPage() {
  const { config, content } = getClientConfig();

  // Curate comprehensive FAQs from content.json and additional helpful guest queries
  const allFaqs = [
    ...content.faqs,
    {
      question: "Are unmarried couples allowed to stay at the property?",
      answer: "Yes, unmarried couples are welcome provided both guests present original, valid government photo IDs (Passport, Aadhaar, Driving License, or Govt ID) at check-in."
    },
    {
      question: "Are local Bhubaneswar IDs accepted?",
      answer: "No, in accordance with property regulations, local Bhubaneswar municipal IDs are not accepted."
    },
    {
      question: "What amenities are included in each room?",
      answer: "All rooms include high-speed Wi-Fi, air conditioning or fan options, premium King beds, flat-screen TVs, private bathrooms with 24/7 hot & cold running water, fresh towels, toiletries, and in-room digital lockers/safes."
    },
    {
      question: "Can I cancel my booking if my travel plans change?",
      answer: "Yes! Direct bookings enjoy free cancellation up to 24 hours prior to your scheduled check-in time."
    }
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Frequently Asked Questions
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Everything you need to know about your reservation and stay at {config.name}.
        </p>
      </div>

      <div className="space-y-4">
        {allFaqs.map((faq, idx) => (
          <details
            key={idx}
            className="group bg-white border border-stone-200 rounded-2xl p-5 shadow-sm transition open:ring-1 open:ring-amber-800"
          >
            <summary className="flex items-center justify-between cursor-pointer list-none font-semibold text-stone-900 text-xs sm:text-sm">
              <span className="flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-amber-800 shrink-0" />
                {faq.question}
              </span>
              <ChevronDown className="w-4 h-4 text-stone-400 group-open:rotate-180 transition-transform shrink-0 ml-2" />
            </summary>
            <div className="mt-3 text-xs text-stone-600 leading-relaxed pl-6 border-t border-stone-100 pt-3">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}
