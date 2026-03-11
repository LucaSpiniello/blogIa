"use client";

import { useState, useEffect } from "react";
import { useLang } from "./LanguageProvider";

export default function FloatingSubscribe() {
  const { t } = useLang();
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    function onScroll() {
      const el = document.getElementById("subscribe");
      if (!el) return;
      const rect = el.getBoundingClientRect();
      setVisible(rect.top > window.innerHeight);
    }
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  if (!visible) return null;

  return (
    <a
      href="#subscribe"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-accent hover:bg-accent/80 text-background font-mono font-semibold text-sm px-4 py-3 rounded-full shadow-lg shadow-accent/20 transition-all hover:scale-105"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="16"
        height="16"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <rect width="20" height="16" x="2" y="4" rx="2" />
        <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
      </svg>
      {t.subscribeButton}
    </a>
  );
}
