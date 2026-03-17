import type { Metadata } from "next";
import { NewsItem } from "@/lib/news";

export const siteConfig = {
  name: "5AI",
  url: process.env.SITE_URL || "https://5ai.cl",
  title: "5AI | AI News That Matter",
  description:
    "The 5 AI news that matter today. Daily artificial intelligence news, ranked, summarized, and published in a compact brief.",
  locale: "en_US",
};

export function absoluteUrl(path = "/") {
  return new URL(path, siteConfig.url).toString();
}

export function baseMetadata(): Metadata {
  return {
    metadataBase: new URL(siteConfig.url),
    applicationName: siteConfig.name,
    title: {
      default: siteConfig.title,
      template: `%s | ${siteConfig.name}`,
    },
    description: siteConfig.description,
    keywords: [
      "AI news",
      "artificial intelligence news",
      "daily AI digest",
      "AI newsletter",
      "machine learning news",
      "LLM news",
      "AI trends",
      "5AI",
    ],
    authors: [{ name: "5AI" }],
    creator: "5AI",
    publisher: "5AI",
    category: "technology",
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      url: siteConfig.url,
      title: siteConfig.title,
      description: siteConfig.description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: siteConfig.title,
      description: siteConfig.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
  };
}

export function dayMetadata(date: string, items: NewsItem[]): Metadata {
  const lead = items[0];
  const title = `${date} AI News`;
  const description =
    lead?.bajada_en ||
    lead?.bajada ||
    `Daily AI news for ${date}, ranked and summarized by 5AI.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/dia/${date}`,
    },
    openGraph: {
      type: "article",
      url: absoluteUrl(`/dia/${date}`),
      title: `${title} | ${siteConfig.name}`,
      description,
      siteName: siteConfig.name,
      locale: siteConfig.locale,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}

export function websiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
    publisher: {
      "@type": "Organization",
      name: siteConfig.name,
      url: siteConfig.url,
    },
    potentialAction: {
      "@type": "SearchAction",
      target: `${siteConfig.url}/dia/{date}`,
      "query-input": "required name=date",
    },
  };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    description: siteConfig.description,
  };
}

