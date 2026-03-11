import Link from "next/link";

export default function Header() {
  return (
    <header className="border-b border-border bg-surface">
      <div className="max-w-4xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-8 h-8 bg-accent rounded-md flex items-center justify-center font-mono font-bold text-background text-sm">
            IA
          </div>
          <div>
            <h1 className="font-mono font-bold text-text-primary text-lg leading-tight group-hover:text-accent transition-colors">
              IA al Día
            </h1>
            <p className="text-text-secondary text-xs">
              ~/noticias/inteligencia-artificial
            </p>
          </div>
        </Link>
        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-text-secondary hover:text-accent text-sm font-mono transition-colors"
          >
            /inicio
          </Link>
          <Link
            href="/about"
            className="text-text-secondary hover:text-accent text-sm font-mono transition-colors"
          >
            /about
          </Link>
        </nav>
      </div>
    </header>
  );
}
