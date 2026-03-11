const IMPORTANCE_CONFIG: Record<number, { label: string; color: string }> = {
  5: {
    label: "BREAKING",
    color: "bg-red-600/30 text-red-400 border-red-500/50 animate-pulse",
  },
  4: {
    label: "MUY IMPORTANTE",
    color: "bg-orange-600/30 text-orange-400 border-orange-500/50",
  },
  3: {
    label: "IMPORTANTE",
    color: "bg-yellow-600/30 text-yellow-400 border-yellow-500/50",
  },
  2: {
    label: "INTERESANTE",
    color: "bg-blue-600/30 text-blue-400 border-blue-500/50",
  },
  1: {
    label: "INFORMATIVA",
    color: "bg-slate-600/30 text-slate-400 border-slate-500/50",
  },
};

export default function ImportanceBadge({ level }: { level: number }) {
  const config = IMPORTANCE_CONFIG[level] || IMPORTANCE_CONFIG[3];
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono font-bold border ${config.color}`}
    >
      {config.label}
    </span>
  );
}
