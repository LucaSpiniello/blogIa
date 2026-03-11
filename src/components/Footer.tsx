"use client";

import { useLang } from "./LanguageProvider";

export default function Footer() {
  const { t } = useLang();

  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm font-mono">
            <span className="text-accent-green">$</span> echo &quot;{t.footerTagline}&quot;
          </p>
          <p className="text-text-secondary text-xs">
            {t.footerCredit}
          </p>
        </div>
      </div>
    </footer>
  );
}
