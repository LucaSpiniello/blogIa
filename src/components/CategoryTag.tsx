"use client";

import { useLang } from "./LanguageProvider";

const CATEGORY_CONFIG: Record<string, { en: string; es: string; color: string }> = {
  modelos: {
    en: "Models",
    es: "Modelos",
    color: "bg-blue-900/30 text-blue-400 border-blue-800/50",
  },
  herramientas: {
    en: "Tools",
    es: "Herramientas",
    color: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
  },
  research: {
    en: "Research",
    es: "Research",
    color: "bg-purple-900/30 text-purple-400 border-purple-800/50",
  },
  negocio: {
    en: "Business",
    es: "Negocio",
    color: "bg-amber-900/30 text-amber-400 border-amber-800/50",
  },
  "open-source": {
    en: "Open Source",
    es: "Open Source",
    color: "bg-green-900/30 text-green-400 border-green-800/50",
  },
  regulacion: {
    en: "Regulation",
    es: "Regulación",
    color: "bg-red-900/30 text-red-400 border-red-800/50",
  },
  producto: {
    en: "Product",
    es: "Producto",
    color: "bg-cyan-900/30 text-cyan-400 border-cyan-800/50",
  },
};

const DEFAULT = {
  en: "General",
  es: "General",
  color: "bg-slate-800/30 text-slate-400 border-slate-700/50",
};

export default function CategoryTag({ name }: { name: string }) {
  const { lang } = useLang();
  const config = CATEGORY_CONFIG[name] || DEFAULT;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-[11px] font-mono uppercase tracking-[0.14em] border ${config.color}`}
    >
      {config[lang]}
    </span>
  );
}
