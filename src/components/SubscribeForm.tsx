"use client";

import { useState } from "react";
import { useLang } from "./LanguageProvider";

export default function SubscribeForm() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [message, setMessage] = useState("");
  const { t } = useLang();

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/subscribe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(
          data.alreadySubscribed ? t.subscribeAlready : t.subscribeSuccess
        );
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error || t.subscribeError);
      }
    } catch {
      setStatus("error");
      setMessage(t.connectionError);
    }

    setTimeout(() => setStatus("idle"), 4000);
  }

  return (
    <div className="border border-border rounded-lg bg-surface p-6">
      <div className="flex items-center gap-2 mb-3">
        <div className="w-7 h-7 bg-accent rounded-md flex items-center justify-center font-mono font-bold text-background text-sm">
          5
        </div>
        <h3 className="font-mono font-semibold text-text-primary">
          {t.subscribeTitle}
        </h3>
      </div>
      <p className="text-text-secondary text-sm mb-4">
        {t.subscribeDesc}
      </p>
      <p className="mb-4 rounded-xl border border-white/10 bg-background/70 px-3 py-2 text-[11px] font-mono uppercase tracking-[0.16em] text-text-secondary">
        {t.subscribeWarning}
      </p>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={t.subscribePlaceholder}
          required
          className="flex-1 bg-background border border-border rounded-md px-3 py-2 text-sm font-mono text-text-primary placeholder:text-text-secondary/50 focus:outline-none focus:border-accent transition-colors"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          className="bg-accent hover:bg-accent/80 text-background font-mono font-semibold text-sm px-4 py-2 rounded-md transition-colors disabled:opacity-50"
        >
          {status === "loading" ? "..." : t.subscribeButton}
        </button>
      </form>

      {status === "success" && (
        <p className="text-accent-green text-xs font-mono mt-2">{message}</p>
      )}
      {status === "error" && (
        <p className="text-red-400 text-xs font-mono mt-2">{message}</p>
      )}
    </div>
  );
}
