import SubscribeForm from "@/components/SubscribeForm";

export default function AboutPage() {
  return (
    <div className="max-w-2xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-mono font-bold text-background text-xl">
          5
        </div>
        <h1 className="font-mono font-bold text-2xl text-text-primary">
          Sobre 5IA
        </h1>
      </div>

      <div className="border border-border rounded-lg bg-surface p-6 space-y-4 mb-8">
        <p className="text-text-secondary">
          <strong className="text-text-primary">5IA</strong> es un blog
          automatizado que selecciona, filtra y rankea diariamente las noticias
          mas importantes del mundo de la inteligencia artificial.
        </p>

        <h3 className="font-mono font-semibold text-accent-purple">
          Como funciona
        </h3>
        <ol className="text-text-secondary space-y-2 list-none">
          <li className="font-mono text-sm">
            <span className="text-accent mr-2">1.</span>
            Scraping de +20 fuentes (RSS + HTML) dos veces al dia
          </li>
          <li className="font-mono text-sm">
            <span className="text-accent mr-2">2.</span>
            Claude AI filtra las mas relevantes y descarta ruido
          </li>
          <li className="font-mono text-sm">
            <span className="text-accent mr-2">3.</span>
            Genera titulo en espanol, bajada y ranking de importancia
          </li>
          <li className="font-mono text-sm">
            <span className="text-accent mr-2">4.</span>
            Las top 5 se destacan, el resto queda accesible
          </li>
        </ol>

        <h3 className="font-mono font-semibold text-accent-purple">Fuentes</h3>
        <div className="grid grid-cols-2 gap-1">
          {[
            "Anthropic",
            "OpenAI",
            "Google AI",
            "Meta AI",
            "NVIDIA AI",
            "Hugging Face",
            "TechCrunch",
            "The Verge",
            "MIT Tech Review",
            "Wired",
            "Hacker News",
            "Reddit ML",
            "arXiv AI",
            "GitHub Trending",
          ].map((source) => (
            <span key={source} className="font-mono text-xs text-text-secondary">
              <span className="text-accent-green mr-1">-</span>
              {source}
            </span>
          ))}
        </div>
      </div>

      <SubscribeForm />
    </div>
  );
}
