import Link from "next/link";

interface FooterProps {
  name: string;
  address: string;
  phone: string;
  email: string;
}

export function Footer({ name, address, phone, email }: FooterProps) {
  return (
    <footer className="bg-neutral-100 text-neutral-700 py-10 border-t border-neutral-200 text-xs">
      <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8">
        <div>
          <h4 className="font-bold text-sm text-neutral-900 mb-2">{name}</h4>
          <p className="text-neutral-600 leading-relaxed">{address}</p>
        </div>

        <div>
          <h5 className="font-bold text-sm text-neutral-900 mb-2">Direct Contact</h5>
          <p className="text-neutral-600 mb-1">Phone: {phone}</p>
          <p className="text-neutral-600">Email: {email}</p>
        </div>

        <div>
          <h5 className="font-bold text-sm text-neutral-900 mb-2">Legal & Policies</h5>
          <ul className="space-y-1.5">
            <li>
              <Link href="/legal/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link href="/legal/terms" className="hover:underline">
                Terms of Service
              </Link>
            </li>
            <li>
              <Link href="/legal/refunds" className="hover:underline">
                Refund & Cancellation Policy
              </Link>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto px-4 mt-8 pt-6 border-t border-neutral-200 text-neutral-500 text-[11px] flex flex-col sm:flex-row justify-between items-center gap-2">
        <span>© {new Date().getFullYear()} {name}. All rights reserved.</span>
        <span>Direct booking guest portal</span>
      </div>
    </footer>
  );
}
