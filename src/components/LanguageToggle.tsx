"use client";

import { useLang } from "./LanguageProvider";

export default function LanguageToggle() {
  const { lang, setLang } = useLang();

  return (
    <button
      onClick={() => setLang(lang === "en" ? "es" : "en")}
      className="flex items-center gap-1 border border-border rounded-md px-2 py-1 font-mono text-xs text-text-secondary hover:text-accent hover:border-accent/50 transition-colors cursor-pointer"
      aria-label="Toggle language"
    >
      <span className={lang === "en" ? "text-accent font-bold" : ""}>EN</span>
      <span className="text-text-secondary/40">/</span>
      <span className={lang === "es" ? "text-accent font-bold" : ""}>ES</span>
    </button>
  );
}
