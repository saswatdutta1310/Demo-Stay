"use client";

import { useState } from "react";
import { submitFeedback } from "@/lib/api";
import { Send, CheckCircle2, AlertCircle, Clock } from "lucide-react";

export function ContactForm({ hotelName }: { hotelName: string }) {
  const [formData, setFormData] = useState({
    name: "",
    phoneOrEmail: "",
    rating: 5,
    message: ""
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phoneOrEmail.trim() || !formData.message.trim()) {
      setError("Please fill out your name, contact info, and message.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await submitFeedback({
        name: formData.name.trim(),
        phoneOrEmail: formData.phoneOrEmail.trim(),
        hotelName,
        rating: formData.rating,
        message: formData.message.trim()
      });
      setSuccess(true);
      setFormData({
        name: "",
        phoneOrEmail: "",
        rating: 5,
        message: ""
      });
    } catch (err: unknown) {
      setError(
        err instanceof Error ? err.message : "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="bg-white border border-stone-200 rounded-2xl p-8 text-center shadow-sm">
        <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-3">
          <CheckCircle2 className="w-6 h-6" />
        </div>
        <h3 className="text-base font-bold text-stone-900 mb-1">Message Received</h3>
        <p className="text-xs text-stone-600 mb-4">
          Thank you for reaching out! Our reservations and front-desk team will get back to you shortly.
        </p>
        <button
          onClick={() => setSuccess(false)}
          className="px-4 py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold rounded-xl transition"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white border border-stone-200 rounded-2xl p-6 sm:p-8 shadow-sm">
      <h2 className="text-sm font-bold text-stone-900 mb-1">Send Us a Direct Message</h2>
      <p className="text-xs text-stone-500 mb-6">
        Have questions about room availability, group bookings, or temple timings? Send us a note below.
      </p>

      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-center gap-2 text-xs text-red-700">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Your Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g. Rahul Sharma"
              className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1">
              Email or Phone <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.phoneOrEmail}
              onChange={(e) => setFormData({ ...formData, phoneOrEmail: e.target.value })}
              placeholder="e.g. rahul@example.com or 9876543210"
              className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-stone-700 mb-1">
            Message or Inquiry <span className="text-red-500">*</span>
          </label>
          <textarea
            required
            rows={4}
            value={formData.message}
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
            placeholder="How can we assist you with your stay at Gayatree Stay?"
            className="w-full border border-stone-300 rounded-xl p-2.5 text-xs focus:outline-none focus:ring-2 focus:ring-amber-800"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-2.5 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2 disabled:opacity-50"
        >
          {loading ? (
            <>
              <Clock className="w-4 h-4 animate-spin" /> Submitting...
            </>
          ) : (
            <>
              <Send className="w-4 h-4" /> Send Message
            </>
          )}
        </button>
      </form>
    </div>
  );
}
