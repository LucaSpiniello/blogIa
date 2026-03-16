"use client";

import { useLang } from "./LanguageProvider";

const IMPORTANCE_COLORS: Record<number, string> = {
  5: "bg-accent text-background border-accent shadow-[0_14px_34px_rgba(255,107,44,0.35)]",
  4: "bg-orange-500/16 text-orange-200 border-orange-400/50",
  3: "bg-yellow-400/14 text-yellow-100 border-yellow-300/35",
  2: "bg-sky-400/12 text-sky-100 border-sky-300/30",
  1: "bg-white/6 text-slate-200 border-white/10",
};

const IMPORTANCE_SIZES: Record<number, string> = {
  5: "px-4 py-2 text-[0.8rem] tracking-[0.28em]",
  4: "px-3.5 py-1.5 text-[0.73rem] tracking-[0.24em]",
  3: "px-3 py-1.5 text-[0.68rem] tracking-[0.18em]",
  2: "px-2.5 py-1 text-[0.62rem] tracking-[0.14em]",
  1: "px-2 py-1 text-[0.58rem] tracking-[0.12em]",
};

export default function ImportanceBadge({ level }: { level: number }) {
  const { t } = useLang();
  const color = IMPORTANCE_COLORS[level] || IMPORTANCE_COLORS[3];
  const size = IMPORTANCE_SIZES[level] || IMPORTANCE_SIZES[3];
  const label = t.importance[level] || t.importance[3];

  return (
    <span
      className={`inline-flex items-center rounded-full font-mono font-bold border uppercase ${size} ${color}`}
    >
      {label}
    </span>
  );
}
