"use client";

import SubscribeForm from "./SubscribeForm";
import { useLang } from "./LanguageProvider";

export default function AboutContent() {
  const { t } = useLang();

  return (
    <div className="max-w-3xl">
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 bg-accent rounded-lg flex items-center justify-center font-mono font-bold text-background text-xl">
          5
        </div>
        <h1 className="font-mono font-bold text-2xl text-text-primary">
          {t.aboutTitle}
        </h1>
      </div>

      <div className="border border-border rounded-lg bg-surface p-6 space-y-4 mb-8">
        <p className="text-text-secondary">
          <strong className="text-text-primary">5AI</strong> {t.aboutDesc}
        </p>

        <h3 className="font-mono font-semibold text-accent-purple">
          {t.howItWorks}
        </h3>
        <ol className="text-text-secondary space-y-2 list-none">
          {t.steps.map((step, i) => (
            <li key={i} className="font-mono text-sm">
              <span className="text-accent mr-2">{i + 1}.</span>
              {step}
            </li>
          ))}
        </ol>

        <h3 className="font-mono font-semibold text-accent-purple">
          {t.sourcesTitle}
        </h3>
        <div className="grid grid-cols-2 gap-1">
          {[
            "Anthropic",
            "OpenAI",
            "Google AI",
            "Meta AI",
            "NVIDIA AI",
            "Hugging Face",
            "TechCrunch",
            "The Verge",
            "MIT Tech Review",
            "Wired",
            "Hacker News",
            "Reddit ML",
            "arXiv AI",
            "GitHub Trending",
          ].map((source) => (
            <span
              key={source}
              className="font-mono text-xs text-text-secondary"
            >
              <span className="text-accent-green mr-1">-</span>
              {source}
            </span>
          ))}
        </div>
      </div>

      <SubscribeForm />
    </div>
  );
}
