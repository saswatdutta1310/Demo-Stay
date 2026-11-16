import { getClientConfig } from "@/lib/client-config";
import { Phone, Mail, MapPin, MessageCircle } from "lucide-react";

export default function ContactPage() {
  const { config } = getClientConfig();

  return (
    <div className="max-w-xl mx-auto px-4 py-16 text-center">
      <h1 className="text-3xl font-serif font-bold text-stone-900 mb-2">Get in Touch</h1>
      <p className="text-xs text-stone-500 mb-8">Reach out to our reservations team directly.</p>

      <div className="bg-white border border-stone-200 rounded-2xl p-6 text-left space-y-4 text-xs shadow-sm">
        <div className="flex items-center gap-3">
          <Phone className="w-4 h-4 text-amber-800" />
          <span>{config.contact.phone}</span>
        </div>
        <div className="flex items-center gap-3">
          <MessageCircle className="w-4 h-4 text-emerald-600" />
          <span>WhatsApp: {config.contact.whatsapp}</span>
        </div>
        <div className="flex items-center gap-3">
          <Mail className="w-4 h-4 text-amber-800" />
          <span>{config.contact.email}</span>
        </div>
        <div className="flex items-start gap-3">
          <MapPin className="w-4 h-4 text-amber-800 shrink-0 mt-0.5" />
          <span>{config.contact.address}</span>
        </div>
      </div>
    </div>
  );
}
