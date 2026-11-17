"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, AlertCircle, KeyRound, ArrowRight } from "lucide-react";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");
  const [error, setError] = useState<string | null>(null);

  const expectedPin =
    process.env.NEXT_PUBLIC_OWNER_PIN ||
    process.env.OWNER_PIN ||
    "1234";

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin.trim() === expectedPin || pin.trim() === "1234") {
      // Store session token in localStorage/sessionStorage
      sessionStorage.setItem("owner_authenticated", "true");
      router.push("/owner");
    } else {
      setError(`Invalid PIN. (Hint: Demo default is 1234 or configured OWNER_PIN)`);
    }
  };

  return (
    <div className="max-w-sm mx-auto px-4 py-20 text-center">
      <div className="bg-white border border-stone-200 rounded-3xl p-8 shadow-sm">
        <div className="w-12 h-12 bg-amber-100 text-amber-900 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <KeyRound className="w-6 h-6" />
        </div>

        <h1 className="text-xl font-serif font-bold text-stone-900 mb-1">
          Owner Portal Access
        </h1>
        <p className="text-xs text-stone-500 mb-6">
          Enter your 4-digit security PIN to access the property dashboard and management tools.
        </p>

        <form onSubmit={handleLogin} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2 text-xs text-red-700 text-left">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-stone-700 mb-1.5 text-left">
              Security PIN
            </label>
            <input
              type="password"
              maxLength={6}
              autoFocus
              required
              placeholder="••••"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (error) setError(null);
              }}
              className="w-full text-center tracking-[0.5em] text-2xl font-bold border border-stone-300 rounded-xl p-3 focus:outline-none focus:ring-2 focus:ring-amber-800"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 bg-amber-800 hover:bg-amber-900 text-white font-semibold text-xs rounded-xl shadow-sm transition flex items-center justify-center gap-2"
          >
            <Lock className="w-4 h-4" /> Unlock Dashboard <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="mt-6 pt-4 border-t border-stone-100 text-center">
          <span className="text-[11px] text-stone-400">
            Protected management area • Demo access: <strong>1234</strong>
          </span>
        </div>
      </div>
    </div>
  );
}
