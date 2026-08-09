import React from "react";
import Link from "next/link";

export function Header() {
  return (
    <header className="w-full border-b border-[#262626] bg-[#121212]/90 backdrop-blur-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div className="flex items-center gap-4">
          <Link
            href="/"
            className="flex items-center gap-2.5 group focus:outline-none"
          >
            {/* Standardized White Box Logo Mark with Inner Orange Square */}
            <div className="w-6 h-6 bg-[#F5F5F5] flex items-center justify-center transition-transform group-hover:scale-105 shrink-0">
              <div className="w-2.5 h-2.5 bg-[#F97316]" />
            </div>

            <span className="font-bold text-sm tracking-tight text-[#F5F5F5] uppercase">
              CollabNote
            </span>
          </Link>
        </div>

        {/* Auth CTA Actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/login"
            className="font-mono-tech text-xs uppercase px-3 sm:px-4 py-2 text-[#F5F5F5] hover:bg-[#262626] transition-colors border border-transparent hover:border-[#333333]"
          >
            Log In
          </Link>

          <Link
            href="/signup"
            className="font-mono-tech text-xs uppercase px-4 sm:px-5 py-2 bg-[#F5F5F5] text-[#121212] font-semibold hover:bg-[#F97316] hover:text-white transition-colors border border-[#F5F5F5] hover:border-[#F97316]"
          >
            Sign Up [NOW]
          </Link>
        </div>
      </div>
    </header>
  );
}
