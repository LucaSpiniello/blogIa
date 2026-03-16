"use client";

import { useState } from "react";
import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { useLang } from "./LanguageProvider";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const { t } = useLang();

  return (
    <header className="sticky top-0 z-40 border-b border-white/8 bg-background/88 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 py-4 md:px-6">
        <div className="flex items-center justify-between gap-4">
          <Link href="/" className="group" onClick={() => setMobileOpen(false)}>
            <h1 className="font-brand font-bold tracking-[-0.08em] text-text-primary text-4xl md:text-5xl leading-none group-hover:text-accent transition-colors">
              5AI
            </h1>
            <p className="mt-1 text-text-secondary text-[10px] md:text-[11px] uppercase tracking-[0.28em]">
              {t.tagline}
            </p>
          </Link>

          <div className="hidden sm:flex items-center gap-6">
            <nav className="flex items-center gap-6">
              <Link
                href="/"
                className="text-text-secondary hover:text-accent text-xs md:text-sm font-mono uppercase tracking-[0.22em] transition-colors"
              >
                {t.navHome}
              </Link>
              <Link
                href="/about"
                className="text-text-secondary hover:text-accent text-xs md:text-sm font-mono uppercase tracking-[0.22em] transition-colors"
              >
                {t.navAbout}
              </Link>
            </nav>
            <LanguageToggle />
          </div>

          <button
            type="button"
            aria-label="Toggle navigation"
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
            className="sm:hidden inline-flex h-11 w-11 items-center justify-center rounded-xl border border-white/10 bg-white/4 text-text-primary transition-colors hover:border-accent/40 hover:text-accent"
          >
            <span className="sr-only">Menu</span>
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
              <span className="block h-0.5 w-5 bg-current" />
            </span>
          </button>
        </div>

        {mobileOpen && (
          <div className="sm:hidden mt-4 rounded-2xl border border-white/10 bg-white/4 p-4">
            <nav className="flex flex-col gap-4">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="text-text-primary hover:text-accent text-sm font-mono uppercase tracking-[0.22em] transition-colors"
              >
                {t.navHome}
              </Link>
              <Link
                href="/about"
                onClick={() => setMobileOpen(false)}
                className="text-text-primary hover:text-accent text-sm font-mono uppercase tracking-[0.22em] transition-colors"
              >
                {t.navAbout}
              </Link>
              <div className="pt-2 border-t border-white/8">
                <LanguageToggle />
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
