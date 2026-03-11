import { NewsItem } from "@/lib/news";
import SourceBadge from "./SourceBadge";
import CategoryTag from "./CategoryTag";

export default function NewsCard({ item }: { item: NewsItem }) {
  return (
    <article className="border border-border rounded-lg bg-surface hover:border-accent/50 transition-all group">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <SourceBadge name={item.source} />
          <CategoryTag name={item.categoria} />
          {item._scraped_at && (
            <span className="text-text-secondary text-xs font-mono ml-auto">
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
          <h3 className="font-mono font-semibold text-base text-text-primary group-hover:text-accent transition-colors mb-2 leading-snug">
            {item.title_es}
          </h3>
        </a>

        <p className="text-text-secondary text-sm leading-relaxed mb-3">
          {item.bajada}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-xs font-mono truncate max-w-[70%] opacity-60">
            {item.link.replace(/^https?:\/\//, "").split("/").slice(0, 2).join("/")}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-xs font-mono hover:underline shrink-0"
          >
            leer más →
          </a>
        </div>
      </div>
    </article>
  );
}
