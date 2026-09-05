import type { Metadata } from "next";
import AktueltArticlesGrid from "@/app/components/aktuelt/AktueltArticlesGrid";
import { getAktueltArticlesPage } from "@/app/lib/articles";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";
import { getSitePageSeo } from "@/app/lib/site-seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSitePageSeo("aktuelt");
  const title = seo?.metaTitle || "Aktuelt";
  const description =
    sanitizeSeoDescription(seo?.metaDescription) ||
    "Siste nytt og aktuelle saker fra kulturlivet i Namdalen.";
  const imageUrl =
    getSanityImageUrl(seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || seo?.ogImageUrl;

  return buildSeoMetadata({
    title,
    description,
    path: "/aktuelt",
    imageUrl,
    noIndex: seo?.noIndex,
  });
}

export default async function AktueltPage() {
  const articles = await getAktueltArticlesPage({ offset: 0, limit: 9 });

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Aktuelt</h1>
        <p className="mt-3 text-black/70">
          Siste nytt og aktuelle saker fra kulturlivet i Namdalen.
        </p>
      </section>

      <AktueltArticlesGrid initialArticles={articles} pageSize={9} />
    </main>
  );
}
