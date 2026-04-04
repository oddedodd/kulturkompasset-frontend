import type { Metadata } from "next";
import VenuesGrid from "@/app/components/venues/VenuesGrid";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";
import { getSitePageSeo } from "@/app/lib/site-seo";
import { getVenues } from "@/app/lib/venues";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSitePageSeo("venues");
  const title = seo?.metaTitle || "Spillesteder";
  const description =
    sanitizeSeoDescription(seo?.metaDescription) ||
    "Ingen scene for stor eller for liten – her ser du den stadig voksende listen over Namdalens kultur-rom.";
  const imageUrl =
    getSanityImageUrl(seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || seo?.ogImageUrl;

  return buildSeoMetadata({
    title,
    description,
    path: "/venues",
    imageUrl,
    noIndex: seo?.noIndex,
  });
}

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Spillesteder</h1>
        <p className="mt-3 text-black/70">Ingen scene for stor eller for liten – her ser du den stadig voksende listen over Namdalens kultur-rom.</p>
      </section>

      <VenuesGrid venues={venues} />
    </main>
  );
}
