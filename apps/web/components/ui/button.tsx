import { ButtonHTMLAttributes } from "react";
import { clsx } from "clsx";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline";
}

export function Button({ variant = "primary", className, children, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "px-4 py-2 rounded-lg text-xs font-semibold transition inline-flex items-center justify-center gap-1.5 shadow-sm disabled:opacity-50",
        variant === "primary" && "bg-amber-800 hover:bg-amber-900 text-white",
        variant === "secondary" && "bg-stone-100 hover:bg-stone-200 text-stone-800",
        variant === "outline" && "border border-stone-300 text-stone-700 hover:bg-stone-50",
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
