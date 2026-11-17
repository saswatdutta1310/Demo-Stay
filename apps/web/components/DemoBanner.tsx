import Link from "next/link";

interface DemoBannerProps {
  hotelName: string;
}

export function DemoBanner({ hotelName }: DemoBannerProps) {
  return (
    <aside
      aria-label="Demo notice"
      className="w-full bg-neutral-900 text-neutral-100 text-xs px-4 py-2 border-b border-neutral-700 flex flex-wrap items-center justify-between gap-2"
    >
      <div className="flex items-center gap-2 font-medium">
        <span
          className="inline-block w-2 h-2 rounded-full"
          style={{ backgroundColor: "var(--color-accent)" }}
          aria-hidden="true"
        />
        <span>Demo site prepared for {hotelName}</span>
      </div>
      <div className="flex items-center gap-4 text-[11px] text-neutral-300">
        <span>Direct Booking Prototype</span>
        <Link
          href="/owner"
          className="underline font-semibold hover:text-white transition focus-visible:ring-1 focus-visible:ring-white rounded px-1"
        >
          Owner Portal
        </Link>
      </div>
    </aside>
  );
}
