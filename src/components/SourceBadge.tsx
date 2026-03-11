const SOURCE_COLORS: Record<string, string> = {
  // Tier 1 — Big players
  Anthropic: "bg-amber-900/30 text-amber-400 border-amber-800/50",
  OpenAI: "bg-emerald-900/30 text-emerald-400 border-emerald-800/50",
  "Google AI": "bg-blue-900/30 text-blue-400 border-blue-800/50",
  "Hugging Face": "bg-yellow-900/30 text-yellow-400 border-yellow-800/50",
  "Meta AI": "bg-indigo-900/30 text-indigo-400 border-indigo-800/50",
  "Microsoft AI": "bg-cyan-900/30 text-cyan-400 border-cyan-800/50",
  "NVIDIA AI": "bg-lime-900/30 text-lime-400 border-lime-800/50",
  // Tier 2 — Tech media
  TechCrunch: "bg-green-900/30 text-green-400 border-green-800/50",
  "The Verge": "bg-purple-900/30 text-purple-400 border-purple-800/50",
  "Ars Technica": "bg-orange-900/30 text-orange-400 border-orange-800/50",
  VentureBeat: "bg-teal-900/30 text-teal-400 border-teal-800/50",
  "MIT Tech Review": "bg-rose-900/30 text-rose-400 border-rose-800/50",
  Wired: "bg-fuchsia-900/30 text-fuchsia-400 border-fuchsia-800/50",
  "The Information": "bg-sky-900/30 text-sky-400 border-sky-800/50",
  // Tier 3 — Community
  GitHub: "bg-gray-800/30 text-gray-300 border-gray-700/50",
  "Hacker News": "bg-orange-900/30 text-orange-300 border-orange-800/50",
  "Reddit r/MachineLearning": "bg-red-900/30 text-red-400 border-red-800/50",
  "Reddit r/LocalLLaMA": "bg-red-900/30 text-red-300 border-red-800/50",
  "Reddit r/artificial": "bg-red-900/30 text-red-400 border-red-800/50",
  // Tier 4 — Research
  "arXiv AI": "bg-pink-900/30 text-pink-400 border-pink-800/50",
  "arXiv LLM": "bg-pink-900/30 text-pink-300 border-pink-800/50",
  "Papers With Code": "bg-violet-900/30 text-violet-400 border-violet-800/50",
  // Tier 5 — Startups
  ProductHunt: "bg-red-900/30 text-red-400 border-red-800/50",
  "Y Combinator": "bg-orange-900/30 text-orange-400 border-orange-800/50",
  "a16z AI": "bg-emerald-900/30 text-emerald-300 border-emerald-800/50",
};

const DEFAULT_COLOR = "bg-slate-800/30 text-slate-400 border-slate-700/50";

export default function SourceBadge({ name }: { name: string }) {
  const colorClass = SOURCE_COLORS[name] || DEFAULT_COLOR;
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-mono border ${colorClass}`}
    >
      {name}
    </span>
  );
}
