"use client";

import Link from "next/link";
import { useState } from "react";

const navItems = ["Members", "Actions", "Updates"];

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div
      className="relative flex w-full items-center justify-between bg-slate-900 px-4 py-3 text-slate-50 shadow-md md:px-8"
      aria-label="Main navigation"
    >
      <Link className="text-2xl font-bold tracking-tight text-white" href="/">
        TeamPulse
      </Link>

      <button
        type="button"
        className="flex h-11 w-11 flex-col items-center justify-center gap-1.5 rounded-lg border border-white/20 bg-transparent p-2 md:hidden"
        aria-label="Toggle navigation menu"
        aria-expanded={isMenuOpen}
        onClick={() => setIsMenuOpen((prev) => !prev)}
      >
        <span className="block h-0.5 w-full rounded-full bg-white"></span>
        <span className="block h-0.5 w-full rounded-full bg-white"></span>
        <span className="block h-0.5 w-full rounded-full bg-white"></span>
      </button>

      <div
        className={`${
          isMenuOpen ? "flex" : "hidden"
        } absolute left-4 right-4 top-[calc(100%+0.5rem)] flex-col gap-3 rounded-xl border border-slate-700 bg-slate-900/95 p-4 shadow-lg md:static md:left-auto md:right-auto md:top-auto md:flex md:flex-row md:items-center md:gap-6 md:rounded-none md:border-0 md:bg-transparent md:p-0 md:shadow-none`}
      >
        {navItems.map((item) => (
          <Link
            key={item}
            href={`/${item.toLowerCase()}`}
            className="w-full text-base font-semibold text-slate-200 no-underline transition-colors hover:text-white md:w-auto"
          >
            {item}
          </Link>
        ))}
      </div>
    </div>
  );
}
