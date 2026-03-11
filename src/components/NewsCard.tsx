import { NewsItem } from "@/lib/news";
import SourceBadge from "./SourceBadge";
import CategoryTag from "./CategoryTag";
import ImportanceBadge from "./ImportanceBadge";

export default function NewsCard({
  item,
  featured = false,
}: {
  item: NewsItem;
  featured?: boolean;
}) {
  return (
    <article
      className={`border rounded-lg bg-surface transition-all group ${
        featured
          ? "border-accent/40 hover:border-accent/70 shadow-lg shadow-accent/5"
          : "border-border hover:border-accent/30"
      }`}
    >
      <div className={featured ? "p-6" : "p-5"}>
        <div className="flex items-center gap-2 mb-3 flex-wrap">
          <ImportanceBadge level={item.importancia} />
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
          <h3
            className={`font-mono font-semibold text-text-primary group-hover:text-accent transition-colors mb-2 leading-snug ${
              featured ? "text-lg" : "text-base"
            }`}
          >
            {featured && (
              <span className="text-accent mr-2">#{item.rank}</span>
            )}
            {item.title_es}
          </h3>
        </a>

        <p
          className={`text-text-secondary leading-relaxed mb-3 ${
            featured ? "text-sm" : "text-sm"
          }`}
        >
          {item.bajada}
        </p>

        <div className="flex items-center justify-between">
          <span className="text-text-secondary text-xs font-mono truncate max-w-[70%] opacity-60">
            {item.link
              .replace(/^https?:\/\//, "")
              .split("/")
              .slice(0, 2)
              .join("/")}
          </span>
          <a
            href={item.link}
            target="_blank"
            rel="noopener noreferrer"
            className="text-accent text-xs font-mono hover:underline shrink-0"
          >
            leer mas →
          </a>
        </div>
      </div>
    </article>
  );
}
