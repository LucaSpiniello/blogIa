import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LanguageProvider from "@/components/LanguageProvider";
import StructuredData from "@/components/StructuredData";
import { baseMetadata, organizationJsonLd, websiteJsonLd } from "@/lib/seo";

export const metadata: Metadata = baseMetadata();

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col">
        <StructuredData data={organizationJsonLd()} />
        <StructuredData data={websiteJsonLd()} />
        <LanguageProvider>
          <Header />
          <main className="flex-1 max-w-7xl mx-auto w-full px-4 py-8 md:px-6 md:py-10">
            {children}
          </main>
          <Footer />
        </LanguageProvider>
        <Analytics />
      </body>
    </html>
  );
}
