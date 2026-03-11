"use client";

import { DayNews } from "@/lib/news";
import NewsCard from "./NewsCard";
import SubscribeForm from "./SubscribeForm";
import ExpandableNews from "./ExpandableNews";
import { useLang } from "./LanguageProvider";
import FloatingSubscribe from "./FloatingSubscribe";

export default function HomeContent({ days }: { days: DayNews[] }) {
  const { t } = useLang();
  const today = days[0];

  return (
    <div>
      {!today || today.items.length === 0 ? (
        <div className="border border-border rounded-lg bg-surface p-8 text-center">
          <p className="font-mono text-text-secondary">
            <span className="text-accent-green">$</span> {t.emptyState}
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
                      {t.newsCount(day.items.length)}
                    </span>
                  </div>
                </div>

                <div className="grid gap-4 mb-4">
                  {top5.map((item) => (
                    <NewsCard key={item._id} item={item} featured />
                  ))}
                </div>

                {rest.length > 0 && <ExpandableNews items={rest} />}
              </section>
            );
          })}
        </>
      )}

      <section id="subscribe" className="mt-8 mb-4 scroll-mt-8">
        <SubscribeForm />
      </section>

      <FloatingSubscribe />
    </div>
  );
}
