import { getClientConfig } from "@/lib/client-config";
import { ContactForm } from "@/components/ContactForm";
import { Phone, Mail, MapPin, MessageCircle, Clock } from "lucide-react";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
  const { config } = getClientConfig();
  return {
    title: `Contact Us & Reservations | ${config.name}`,
    description: `Contact ${config.name} at ${config.contact.phone} or visit us at ${config.contact.address || config.location?.address}.`
  };
}

export default function ContactPage() {
  const { config } = getClientConfig();

  return (
    <div className="max-w-5xl mx-auto px-4 py-12">
      <div className="text-center max-w-lg mx-auto mb-10">
        <h1 className="text-3xl font-serif font-bold text-stone-900">
          Contact & Reservations
        </h1>
        <p className="text-xs text-stone-500 mt-2">
          Get in touch with our team for room bookings, customized temple itineraries, or general inquiries.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
        {/* Contact Info Column */}
        <div className="md:col-span-5 space-y-4">
          <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm space-y-5 text-xs text-stone-700">
            <h2 className="text-xs font-bold text-stone-400 uppercase tracking-wider mb-1">
              Direct Contact
            </h2>

            <div className="flex items-start gap-3">
              <Phone className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-stone-900">Phone Support</span>
                <span className="text-stone-600">{config.contact.phone}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MessageCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-stone-900">WhatsApp Desk</span>
                <span className="text-stone-600">{config.contact.whatsapp}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-stone-900">Email Inquiries</span>
                <span className="text-stone-600">{config.contact.email}</span>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-stone-900">Property Address</span>
                <span className="text-stone-600 leading-relaxed">
                  {config.contact.address || config.location?.address}
                </span>
              </div>
            </div>

            <div className="flex items-start gap-3 border-t border-stone-100 pt-4">
              <Clock className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold block text-stone-900">Front Desk Hours</span>
                <span className="text-stone-600">24 Hours / 7 Days a week</span>
              </div>
            </div>
          </div>
        </div>

        {/* Form Column */}
        <div className="md:col-span-7">
          <ContactForm hotelName={config.name} />
        </div>
      </div>
    </div>
  );
}
