import type { Metadata } from "next";
import { getNewsByDate, getAllDates } from "@/lib/news";
import { notFound } from "next/navigation";
import Link from "next/link";
import NewsCard from "@/components/NewsCard";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl, dayMetadata, siteConfig } from "@/lib/seo";

export function generateStaticParams() {
  return getAllDates().map((date) => ({ date }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ date: string }>;
}): Promise<Metadata> {
  const { date } = await params;
  const items = getNewsByDate(date);

  if (items.length === 0) {
    return {
      title: "AI News",
    };
  }

  return dayMetadata(date, items);
}

export default async function DayPage({
  params,
}: {
  params: Promise<{ date: string }>;
}) {
  const { date } = await params;
  const items = getNewsByDate(date);
  if (items.length === 0) notFound();

  // Group by category
  const categories = new Map<string, typeof items>();
  for (const item of items) {
    const cat = item.categoria || "general";
    if (!categories.has(cat)) categories.set(cat, []);
    categories.get(cat)!.push(item);
  }

  const sources = [...new Set(items.map((i) => i.source))].sort();
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: `${date} AI News`,
    url: absoluteUrl(`/dia/${date}`),
    description:
      items[0]?.bajada_en ||
      items[0]?.bajada ||
      `Daily AI news for ${date}, ranked and summarized by 5AI.`,
    about: {
      "@type": "Thing",
      name: "Artificial intelligence news",
    },
    hasPart: {
      "@type": "ItemList",
      numberOfItems: items.length,
      itemListElement: items.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: {
          "@type": "NewsArticle",
          headline: item.title || item.title_es,
          description: item.bajada_en || item.bajada,
          datePublished: item.published,
          dateModified: item.published,
          url: item.link,
          author: {
            "@type": "Organization",
            name: item.source,
          },
          publisher: {
            "@type": "Organization",
            name: siteConfig.name,
          },
        },
      })),
    },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <div>
        <Link
          href="/"
          className="text-accent font-mono text-sm hover:underline mb-6 inline-block"
        >
          ← cd ..
        </Link>

        <div className="terminal-header rounded-b-none mb-0">
          <div className="terminal-dot terminal-dot-red" />
          <div className="terminal-dot terminal-dot-yellow" />
          <div className="terminal-dot terminal-dot-green" />
          <span className="text-text-primary text-sm font-mono font-semibold ml-2">
            {date}
          </span>
        </div>
        <div className="border border-t-0 border-border rounded-b-lg bg-surface p-5 mb-8">
          <h1 className="font-mono font-bold text-xl text-text-primary mb-2">
            Noticias del {date}
          </h1>
          <p className="text-text-secondary text-sm mb-3">
            {items.length} noticias de {sources.length} fuentes
          </p>
          <div className="flex flex-wrap gap-1.5">
            {sources.map((s) => (
              <span
                key={s}
                className="text-xs font-mono text-text-secondary bg-background px-2 py-0.5 rounded"
              >
                {s}
              </span>
            ))}
          </div>
        </div>

        {[...categories.entries()].map(([category, catItems]) => (
          <section key={category} className="mb-8">
            <h2 className="font-mono font-semibold text-sm text-accent-purple uppercase tracking-wider mb-4">
              // {category}
            </h2>
            <div className="grid gap-4">
              {catItems.map((item) => (
                <NewsCard key={item._id} item={item} />
              ))}
            </div>
          </section>
        ))}
      </div>
    </>
  );
}
