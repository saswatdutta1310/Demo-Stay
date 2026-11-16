"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock } from "lucide-react";

export default function OwnerLoginPage() {
  const router = useRouter();
  const [pin, setPin] = useState("");

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (pin === "1234") {
      router.push("/owner");
    } else {
      alert("Invalid demo PIN! (Hint: use 1234)");
    }
  };

  return (
    <div className="max-w-xs mx-auto px-4 py-20 text-center">
      <div className="bg-white border border-stone-200 rounded-2xl p-6 shadow-sm">
        <div className="w-10 h-10 bg-amber-100 text-amber-800 rounded-full flex items-center justify-center mx-auto mb-3">
          <Lock className="w-5 h-5" />
        </div>
        <h1 className="text-lg font-bold text-stone-900 mb-1">Owner Dashboard</h1>
        <p className="text-[11px] text-stone-500 mb-5">Enter Demo PIN (Default: 1234)</p>

        <form onSubmit={handleLogin} className="space-y-4">
          <input
            type="password"
            maxLength={4}
            required
            placeholder="PIN"
            value={pin}
            onChange={(e) => setPin(e.target.value)}
            className="w-full text-center tracking-widest text-lg font-bold border border-stone-300 rounded-lg p-2"
          />
          <button
            type="submit"
            className="w-full py-2 bg-amber-800 hover:bg-amber-900 text-white font-medium text-xs rounded-lg transition"
          >
            Access Portal
          </button>
        </form>
      </div>
    </div>
  );
}
