"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface HeaderProps {
  name: string;
}

export function Header({ name }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);

  const navLinks = [
    { label: "Rooms", href: "/rooms" },
    { label: "Gallery", href: "/gallery" },
    { label: "Location", href: "/location" },
    { label: "Policies", href: "/policies" },
    { label: "Contact", href: "/contact" }
  ];

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-neutral-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link
          href="/"
          className="font-bold text-lg tracking-tight text-neutral-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-neutral-900 rounded px-1"
        >
          {name}
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center space-x-6 text-sm text-neutral-700">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="hover:text-neutral-900 font-medium transition"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="/book"
            className="px-4 py-2 text-white font-medium text-xs rounded transition"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Book now
          </Link>
        </nav>

        {/* Mobile Menu Button */}
        <div className="flex md:hidden items-center gap-2">
          <Link
            href="/book"
            className="px-3 py-1.5 text-white font-medium text-xs rounded transition"
            style={{ backgroundColor: "var(--color-accent)" }}
          >
            Book now
          </Link>
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 text-neutral-700 hover:text-neutral-900 focus:outline-none"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Nav Dropdown */}
      {isOpen && (
        <div className="md:hidden border-t border-neutral-200 bg-white px-4 py-4 space-y-3">
          <nav className="flex flex-col space-y-2 text-sm text-neutral-700">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="py-1 hover:text-neutral-900 font-medium"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
