import type { Metadata } from "next";
import Link from "next/link";
import BulletinsGrid from "@/app/components/bulletin/BulletinsGrid";
import { getBulletinsPage } from "@/app/lib/bulletins";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";
import { getSitePageSeo } from "@/app/lib/site-seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSitePageSeo("bulletin");
  const title = seo?.metaTitle || "Oppslagstavla";
  const description =
    sanitizeSeoDescription(seo?.metaDescription) ||
    "Her kan du selv legge inn små og mellomstore arrangement på vegne av ditt lag eller forening";
  const imageUrl =
    getSanityImageUrl(seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || seo?.ogImageUrl;

  return buildSeoMetadata({
    title,
    description,
    path: "/bulletin",
    imageUrl,
    noIndex: seo?.noIndex,
  });
}

export const revalidate = 3600;

export default async function BulletinPage() {
  const bulletins = await getBulletinsPage({ offset: 0, limit: 9 });

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Oppslagstavla</h1>
            <p className="mt-3 text-black/70">Her kan du selv legge inn små og mellomstore arrangement på vegne av ditt lag eller forening</p>
          </div>
          <Link
            href="/bulletin/submit"
            className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
          >
            Send inn ditt arrangement
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-6xl">
        <BulletinsGrid initialBulletins={bulletins} pageSize={9} />
      </section>
    </main>
  );
}
