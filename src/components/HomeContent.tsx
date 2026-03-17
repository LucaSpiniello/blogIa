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
      <h1 className="sr-only">5AI: The 5 AI news that matter today</h1>
      {!today || today.items.length === 0 ? (
        <div className="border border-border rounded-lg bg-surface p-8 text-center">
          <p className="font-mono text-text-secondary">
            <span className="text-accent-green">$</span> {t.emptyState}
          </p>
        </div>
      ) : (
        <>
          {days.map((day, index) => {
            const top5 = day.items.slice(0, 5);
            const rest = day.items.slice(5);

            return (
              <section
                key={day.date}
                className={index === 0 ? "mb-16" : "mb-14 border-t border-white/8 pt-10"}
              >
                <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                  <div>
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="rounded-full border border-accent/35 bg-accent/10 px-4 py-2 text-[11px] font-mono uppercase tracking-[0.32em] text-accent">
                        {t.topFive}
                      </span>
                      <span className="text-text-secondary text-xs md:text-sm font-mono uppercase tracking-[0.2em]">
                        {day.date}
                      </span>
                      <span className="text-text-secondary/80 text-xs md:text-sm font-mono uppercase tracking-[0.2em]">
                        {t.newsCount(day.items.length)}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid gap-5 mb-5 sm:grid-cols-2 xl:grid-cols-3 xl:auto-rows-fr">
                  {top5.map((item, itemIndex) => (
                    <NewsCard
                      key={item._id}
                      item={item}
                      variant="featured"
                      displayRank={itemIndex + 1}
                    />
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
