"use client";

import { useState } from "react";
import { NewsItem } from "@/lib/news";
import NewsCard from "./NewsCard";
import { useLang } from "./LanguageProvider";

export default function ExpandableNews({ items }: { items: NewsItem[] }) {
  const [expanded, setExpanded] = useState(false);
  const { t } = useLang();

  return (
    <div>
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full border border-border border-dashed rounded-lg py-4 text-center font-mono text-sm text-accent hover:bg-surface hover:border-accent/50 transition-all cursor-pointer"
        >
          {t.expandButton(items.length)}
        </button>
      ) : (
        <div className="grid gap-4">
          <div className="border-t border-border pt-4 mb-2 flex items-center justify-between gap-4">
            <span className="text-text-secondary text-xs font-mono uppercase tracking-wider">
              {t.moreNews}
            </span>
            <button
              onClick={() => setExpanded(false)}
              className="text-accent text-xs font-mono uppercase tracking-[0.18em] hover:underline"
            >
              {t.collapse}
            </button>
          </div>
          {items.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
          <button
            onClick={() => setExpanded(false)}
            className="text-accent text-xs font-mono uppercase tracking-[0.18em] hover:underline text-center py-2"
          >
            {t.collapse}
          </button>
        </div>
      )}
    </div>
  );
}
