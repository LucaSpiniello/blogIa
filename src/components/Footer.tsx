export default function Footer() {
  return (
    <footer className="border-t border-border bg-surface mt-auto">
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-text-secondary text-sm font-mono">
            <span className="text-accent-green">$</span> echo
            &quot;Hecho con IA, para humanos curiosos&quot;
          </p>
          <p className="text-text-secondary text-xs">
            Contenido generado y curado con Claude AI
          </p>
        </div>
      </div>
    </footer>
  );
}
