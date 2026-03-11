import { getAllDays } from "@/lib/news";
import NewsCard from "@/components/NewsCard";
import SubscribeForm from "@/components/SubscribeForm";
import ExpandableNews from "@/components/ExpandableNews";

export default function Home() {
  const days = getAllDays();
  const today = days[0];

  return (
    <div>
      <section className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-mono font-bold text-background text-xl">
            5
          </div>
          <div>
            <h1 className="font-mono font-bold text-2xl text-text-primary">
              5IA
            </h1>
            <p className="text-text-secondary text-sm">
              Las 5 noticias de IA que importan hoy
            </p>
          </div>
        </div>
      </section>

      {!today || today.items.length === 0 ? (
        <div className="border border-border rounded-lg bg-surface p-8 text-center">
          <p className="font-mono text-text-secondary">
            <span className="text-accent-green">$</span> No hay noticias
            todavia. El pipeline se ejecuta 2 veces al dia.
          </p>
        </div>
      ) : (
        <>
          {days.map((day) => {
            const top5 = day.items.slice(0, 5);
            const rest = day.items.slice(5);

            return (
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
                </div>

                {/* Top 5 - always visible */}
                <div className="grid gap-4 mb-4">
                  {top5.map((item) => (
                    <NewsCard key={item._id} item={item} featured />
                  ))}
                </div>

                {/* Rest - expandable */}
                {rest.length > 0 && <ExpandableNews items={rest} />}
              </section>
            );
          })}
        </>
      )}

      {/* Subscribe section */}
      <section className="mt-8 mb-4">
        <SubscribeForm />
      </section>
    </div>
  );
}
