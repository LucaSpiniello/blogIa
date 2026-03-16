"use client";

import { NewsItem } from "@/lib/news";
import SourceBadge from "./SourceBadge";
import CategoryTag from "./CategoryTag";
import ImportanceBadge from "./ImportanceBadge";
import { useLang } from "./LanguageProvider";

export default function NewsCard({
  item,
  variant = "default",
  displayRank,
}: {
  item: NewsItem;
  variant?: "hero" | "featured" | "default";
  displayRank?: number;
}) {
  const { lang, t } = useLang();

  const title = lang === "en" ? (item.title || item.title_es) : item.title_es;
  const summary = lang === "en" ? (item.bajada_en || item.bajada) : item.bajada;
  const domain = item.link
    .replace(/^https?:\/\//, "")
    .split("/")
    .slice(0, 2)
    .join("/");

  const isHero = variant === "hero";
  const isFeatured = variant === "featured";
  const rankLabel = displayRank ?? item.rank;

  return (
    <article
      className={`group relative overflow-hidden border transition-all ${
        isHero
          ? "rounded-[2rem] border-white/12 bg-[linear-gradient(180deg,rgba(255,107,44,0.14),rgba(13,25,36,0.98)_35%)] shadow-[0_30px_100px_rgba(0,0,0,0.38)]"
          : isFeatured
            ? "h-full rounded-[1.75rem] border-white/10 bg-white/4 shadow-[0_18px_70px_rgba(0,0,0,0.22)] hover:border-accent/40 hover:bg-white/[0.06]"
            : "h-full rounded-[1.5rem] border-border bg-surface/80 hover:border-accent/25"
      }`}
    >
      <div
        className={
          isHero ? "p-7 md:p-9" : isFeatured ? "p-6 md:p-7" : "p-5 md:p-6"
        }
      >
        <span
          className={`pointer-events-none absolute right-4 top-3 font-brand font-bold leading-none text-white/6 ${
            isHero ? "text-[7rem] md:text-[9rem]" : "text-[4rem] md:text-[5rem]"
          }`}
        >
          {rankLabel}
        </span>

        <div className="relative z-10 flex items-center gap-2 mb-4 flex-wrap">
          <ImportanceBadge level={item.importancia} />
          <SourceBadge name={item.source} />
          <CategoryTag name={item.categoria} />
          {item._scraped_at && (
            <span className="text-text-secondary text-[11px] font-mono ml-auto uppercase tracking-[0.14em]">
              {item._scraped_at}
            </span>
          )}
        </div>

        <a
          href={item.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block"
        >
          <h3
            className={`relative z-10 font-brand font-bold tracking-[-0.05em] text-text-primary group-hover:text-white transition-colors leading-[0.95] ${
              isHero
                ? "mb-4 max-w-4xl text-[2.2rem] md:text-[3.6rem]"
                : isFeatured
                  ? "mb-3 text-[1.45rem] md:text-[1.75rem]"
                  : "mb-2 text-[1.15rem] md:text-[1.25rem]"
            }`}
          >
            {title}
          </h3>
        </a>

        <p
          className={`relative z-10 max-w-3xl text-text-secondary leading-relaxed ${
            isHero
              ? "mb-6 text-base md:text-lg"
              : isFeatured
                ? "mb-5 text-[0.98rem]"
                : "mb-4 text-sm"
          }`}
        >
          {summary}
        </p>

        <div className="relative z-10 flex items-center justify-between gap-4">
          <span
            className={`text-text-secondary font-mono truncate opacity-70 ${
              isHero ? "text-sm" : "text-xs"
            }`}
          >
            {domain}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className={`text-accent font-mono hover:underline shrink-0 ${
              isHero ? "text-sm" : "text-xs"
            }`}
          >
            {t.readMore}
          </a>
        </div>
      </div>
    </article>
  );
}
