"use client";

import { useState } from "react";
import { NewsItem } from "@/lib/news";
import NewsCard from "./NewsCard";

export default function ExpandableNews({ items }: { items: NewsItem[] }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div>
      {!expanded ? (
        <button
          onClick={() => setExpanded(true)}
          className="w-full border border-border border-dashed rounded-lg py-4 text-center font-mono text-sm text-accent hover:bg-surface hover:border-accent/50 transition-all cursor-pointer"
        >
          + Ver {items.length} noticias mas
        </button>
      ) : (
        <div className="grid gap-4">
          <div className="border-t border-border pt-4 mb-2">
            <span className="text-text-secondary text-xs font-mono uppercase tracking-wider">
              // mas noticias
            </span>
          </div>
          {items.map((item) => (
            <NewsCard key={item._id} item={item} />
          ))}
          <button
            onClick={() => setExpanded(false)}
            className="text-accent text-xs font-mono hover:underline text-center py-2"
          >
            ← Colapsar
          </button>
        </div>
      )}
    </div>
  );
}
