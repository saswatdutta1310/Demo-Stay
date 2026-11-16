"use client";

import { useState } from "react";
import { MessageSquare, Send } from "lucide-react";

export function FeedbackWidget({ clientName }: { clientName: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [feedback, setFeedback] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setIsOpen(false);
      setSubmitted(false);
      setFeedback("");
    }, 2500);
  };

  return (
    <div className="fixed bottom-6 left-6 z-50">
      {!isOpen ? (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold px-3 py-2 rounded-full shadow-lg flex items-center gap-1.5 transition"
        >
          <MessageSquare className="w-3.5 h-3.5" /> Give Pitch Feedback
        </button>
      ) : (
        <div className="bg-white border border-stone-200 rounded-2xl p-4 shadow-2xl w-72 text-xs">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-bold text-stone-900">Meeting Feedback</h4>
            <button onClick={() => setIsOpen(false)} className="text-stone-400 hover:text-stone-600">✕</button>
          </div>
          {submitted ? (
            <p className="text-emerald-700 py-3 font-medium">Thank you! Your feedback has been noted.</p>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-2">
              <p className="text-[11px] text-stone-500">What do you think of this direct-booking demo for {clientName}?</p>
              <textarea
                required
                rows={3}
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Leave comments or questions for the pitch team..."
                className="w-full border border-stone-300 rounded-lg p-2 text-xs focus:ring-amber-500"
              />
              <button
                type="submit"
                className="w-full py-1.5 bg-amber-800 hover:bg-amber-900 text-white font-semibold rounded-lg text-xs flex items-center justify-center gap-1"
              >
                <Send className="w-3 h-3" /> Submit
              </button>
            </form>
          )}
        </div>
      )}
    </div>
  );
}
