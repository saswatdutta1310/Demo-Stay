import Link from "next/link";

export default function NotFound() {
  return (
    <div className="max-w-md mx-auto px-4 py-24 text-center">
      <h1 className="text-4xl font-serif font-bold text-stone-900 mb-2">404</h1>
      <p className="text-xs text-stone-500 mb-6">The requested room or page could not be located.</p>
      <Link
        href="/"
        className="px-5 py-2.5 bg-amber-800 hover:bg-amber-900 text-white rounded-lg text-xs font-semibold transition"
      >
        Return to Home
      </Link>
    </div>
  );
}
