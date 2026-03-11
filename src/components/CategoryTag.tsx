const CATEGORY_CONFIG: Record<string, { label: string; color: string }> = {
  modelos: {
    label: "Modelos",
    color: "bg-blue-900/30 text-blue-400 border-blue-800/50",
  },
  herramientas: {
    label: "Herramientas",
    color: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
  },
  research: {
    label: "Research",
    color: "bg-purple-900/30 text-purple-400 border-purple-800/50",
  },
  negocio: {
    label: "Negocio",
    color: "bg-amber-900/30 text-amber-400 border-amber-800/50",
  },
  "open-source": {
    label: "Open Source",
    color: "bg-green-900/30 text-green-400 border-green-800/50",
  },
  regulacion: {
    label: "Regulación",
    color: "bg-red-900/30 text-red-400 border-red-800/50",
  },
  producto: {
    label: "Producto",
    color: "bg-cyan-900/30 text-cyan-400 border-cyan-800/50",
  },
};

const DEFAULT = {
  label: "General",
  color: "bg-slate-800/30 text-slate-400 border-slate-700/50",
};

export default function CategoryTag({ name }: { name: string }) {
  const config = CATEGORY_CONFIG[name] || DEFAULT;
  return (
    <span
      className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-mono border ${config.color}`}
    >
      {config.label}
    </span>
  );
}
