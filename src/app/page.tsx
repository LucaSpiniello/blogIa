import type { Metadata } from "next";
import { getAllDays } from "@/lib/news";
import HomeContent from "@/components/HomeContent";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl, siteConfig } from "@/lib/seo";

export const metadata: Metadata = {
  alternates: {
    canonical: "/",
  },
  openGraph: {
    url: siteConfig.url,
  },
};

export default function Home() {
  const days = getAllDays();
  const today = days[0];
  const topItems = today?.items.slice(0, 5) || [];
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: siteConfig.title,
    description: siteConfig.description,
    url: siteConfig.url,
    hasPart: {
      "@type": "ItemList",
      itemListOrder: "https://schema.org/ItemListOrderDescending",
      numberOfItems: topItems.length,
      itemListElement: topItems.map((item, index) => ({
        "@type": "ListItem",
        position: index + 1,
        url: item.link,
        name: item.title || item.title_es,
        description: item.bajada_en || item.bajada,
      })),
    },
    mainEntity: {
      "@type": "WebPage",
      "@id": absoluteUrl("/"),
    },
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <HomeContent days={days} />
    </>
  );
}
