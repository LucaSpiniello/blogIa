import type { MetadataRoute } from "next";
import { getAllDates } from "@/lib/news";
import { siteConfig } from "@/lib/seo";

export default function sitemap(): MetadataRoute.Sitemap {
  const dates = getAllDates();
  const routes: MetadataRoute.Sitemap = [
    {
      url: siteConfig.url,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${siteConfig.url}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ];

  return routes.concat(
    dates.map((date) => ({
      url: `${siteConfig.url}/dia/${date}`,
      lastModified: new Date(`${date}T00:00:00.000Z`),
      changeFrequency: "daily" as const,
      priority: 0.8,
    }))
  );
}

