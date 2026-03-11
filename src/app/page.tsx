import { getAllDays } from "@/lib/news";
import NewsCard from "@/components/NewsCard";
import Link from "next/link";

export default function Home() {
  const days = getAllDays();
  const today = days[0];

  return (
    <div>
      <section className="mb-10">
        <div className="flex items-center gap-2 mb-2">
          <span className="text-accent-green font-mono text-sm">$</span>
          <h1 className="font-mono font-bold text-2xl text-text-primary">
            tail -f noticias_ia.log
          </h1>
        </div>
        <p className="text-text-secondary text-sm ml-5">
          Las noticias más revolucionarias del mundo de la IA, actualizadas
          varias veces al día.
        </p>
      </section>

      {!today || today.items.length === 0 ? (
        <div className="border border-border rounded-lg bg-surface p-8 text-center">
          <p className="font-mono text-text-secondary">
            <span className="text-accent-green">$</span> No hay noticias
            todavía. El pipeline se ejecuta varias veces al día.
          </p>
        </div>
      ) : (
        <>
          {days.map((day) => (
            <section key={day.date} className="mb-12">
              <div className="flex items-center gap-3 mb-5">
                <div className="terminal-header rounded-lg py-2 px-4">
                  <div className="terminal-dot terminal-dot-red" />
                  <div className="terminal-dot terminal-dot-yellow" />
                  <div className="terminal-dot terminal-dot-green" />
                  <span className="text-text-primary text-sm font-mono font-semibold ml-2">
                    {day.date}
                  </span>
                  <span className="text-text-secondary text-xs font-mono ml-3">
                    {day.items.length} noticias
                  </span>
                </div>
                <Link
                  href={`/dia/${day.date}`}
                  className="text-accent text-xs font-mono hover:underline ml-auto"
                >
                  ver todas →
                </Link>
              </div>

              <div className="grid gap-4">
                {day.items.slice(0, 10).map((item) => (
                  <NewsCard key={item._id} item={item} />
                ))}
              </div>

              {day.items.length > 10 && (
                <Link
                  href={`/dia/${day.date}`}
                  className="block mt-4 text-center text-accent font-mono text-sm hover:underline"
                >
                  + {day.items.length - 10} noticias más →
                </Link>
              )}
            </section>
          ))}
        </>
      )}
    </div>
  );
}
