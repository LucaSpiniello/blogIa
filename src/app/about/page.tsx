export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-2 mb-6">
        <span className="text-accent-green font-mono text-sm">$</span>
        <h1 className="font-mono font-bold text-2xl text-text-primary">
          cat about.md
        </h1>
      </div>

      <div className="border border-border rounded-lg bg-surface p-6 space-y-4">
        <h2 className="font-mono font-semibold text-lg text-accent">
          ## Sobre IA al Día
        </h2>
        <p className="text-text-secondary">
          <strong className="text-text-primary">IA al Día</strong> es un blog
          automatizado que recopila y sintetiza diariamente las noticias más
          relevantes del mundo de la inteligencia artificial.
        </p>

        <h3 className="font-mono font-semibold text-accent-purple">
          ### Fuentes
        </h3>
        <p className="text-text-secondary">
          Monitoreamos los blogs y canales oficiales de los principales actores
          de la IA:
        </p>
        <ul className="text-text-secondary space-y-1 list-none">
          {[
            "Anthropic (Claude)",
            "OpenAI (ChatGPT, GPT)",
            "Google DeepMind / Gemini",
            "Hugging Face",
            "TechCrunch AI",
            "The Verge AI",
            "Ars Technica AI",
            "GitHub Trending",
            "ProductHunt AI",
          ].map((source) => (
            <li key={source} className="font-mono text-sm">
              <span className="text-accent-green mr-2">-</span>
              {source}
            </li>
          ))}
        </ul>

        <h3 className="font-mono font-semibold text-accent-purple">
          ### Cómo funciona
        </h3>
        <p className="text-text-secondary">
          Un pipeline automatizado se ejecuta diariamente: primero recopila
          noticias de múltiples fuentes vía RSS y web scraping, luego usa Claude
          AI para sintetizar un artículo en español que agrupa y contextualiza
          las novedades más importantes del día.
        </p>

        <div className="border-t border-border pt-4 mt-4">
          <p className="text-text-secondary text-sm font-mono">
            <span className="text-accent-green">$</span> echo &quot;Built with
            Next.js + Python + Claude AI&quot;
          </p>
        </div>
      </div>
    </div>
  );
}
