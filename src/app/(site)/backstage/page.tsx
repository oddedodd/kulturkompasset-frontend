import type { Metadata } from "next";
import BackstageArticlesGrid from "@/app/components/backstage/BackstageArticlesGrid";
import { getBackstageArticlesPage } from "@/app/lib/articles";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";
import { getSitePageSeo } from "@/app/lib/site-seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSitePageSeo("backstage");
  const title = seo?.metaTitle || "Historier";
  const description =
    sanitizeSeoDescription(seo?.metaDescription) ||
    "Møt noen av menneskene som på en eller annen måte har satt Namdalen på det kulturelle kartet.";
  const imageUrl =
    getSanityImageUrl(seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || seo?.ogImageUrl;

  return buildSeoMetadata({
    title,
    description,
    path: "/backstage",
    imageUrl,
    noIndex: seo?.noIndex,
  });
}

export default async function BackstagePage() {
  const articles = await getBackstageArticlesPage({ offset: 0, limit: 9 });

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Historier</h1>
        <p className="mt-3 text-black/70">
        Møt noen av menneskene som på en eller annen måte har satt Namdalen på det kulturelle kartet.
        </p>
      </section>

      <BackstageArticlesGrid initialArticles={articles} pageSize={9} />
    </main>
  );
}
