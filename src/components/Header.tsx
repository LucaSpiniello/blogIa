"use client";

import Link from "next/link";
import LanguageToggle from "./LanguageToggle";
import { useLang } from "./LanguageProvider";

export default function Header() {
  const { t } = useLang();

  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <LanguageToggle />
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-9 h-9 bg-accent rounded-md flex items-center justify-center font-mono font-bold text-background text-lg">
              5
            </div>
            <div>
              <h1 className="font-mono font-bold text-text-primary text-xl leading-tight group-hover:text-accent transition-colors">
                5IA
              </h1>
              <p className="text-text-secondary text-xs">
                {t.tagline}
              </p>
            </div>
          </Link>
        </div>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-text-secondary hover:text-accent text-sm font-mono transition-colors"
          >
            {t.navHome}
          </Link>
          <Link
            href="/about"
            className="text-text-secondary hover:text-accent text-sm font-mono transition-colors"
          >
            {t.navAbout}
          </Link>
        </nav>
      </div>
    </header>
  );
}
