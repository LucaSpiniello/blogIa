"use client";

import { useLang } from "./LanguageProvider";

const IMPORTANCE_COLORS: Record<number, string> = {
  5: "bg-red-600/30 text-red-400 border-red-500/50 animate-pulse",
  4: "bg-orange-600/30 text-orange-400 border-orange-500/50",
  3: "bg-yellow-600/30 text-yellow-400 border-yellow-500/50",
  2: "bg-blue-600/30 text-blue-400 border-blue-500/50",
  1: "bg-slate-600/30 text-slate-400 border-slate-500/50",
};

export default function ImportanceBadge({ level }: { level: number }) {
  const { t } = useLang();
  const color = IMPORTANCE_COLORS[level] || IMPORTANCE_COLORS[3];
  const label = t.importance[level] || t.importance[3];

  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold border ${color}`}
    >
      {label}
    </span>
  );
}
