import type { Metadata } from "next";
import AboutContent from "@/components/AboutContent";
import StructuredData from "@/components/StructuredData";
import { absoluteUrl } from "@/lib/seo";

export const metadata: Metadata = {
  title: "About 5AI",
  description:
    "Learn how 5AI selects, ranks, and publishes the most important AI news every day.",
  alternates: {
    canonical: "/about",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About 5AI",
    url: absoluteUrl("/about"),
    description:
      "Learn how 5AI selects, ranks, and publishes the most important AI news every day.",
  };

  return (
    <>
      <StructuredData data={jsonLd} />
      <AboutContent />
    </>
  );
}
