import type { Metadata } from "next";
import { FeaturedEventsCarousel } from "./components/home/FeaturedEventsCarousel";
import { LatestBackstageArticlesGrid } from "./components/home/LatestBackstageArticlesGrid";
import { UpcomingEventsCarousel } from "./components/home/UpcomingEventsCarousel";
import { Welcome } from "./components/home/Welcome";
import { getLatestBackstageArticles } from "./lib/articles";
import { getUpcomingEventsPage } from "./lib/events";
import { getHomepageFeaturedEvents } from "./lib/featured-events";
import { getMainNavigation } from "./lib/navigation";
import { getSanityImageUrl } from "./lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "./lib/seo";
import { getSitePageSeo } from "./lib/site-seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSitePageSeo("home");
  const title = seo?.metaTitle || "Hjem";
  const description =
    sanitizeSeoDescription(seo?.metaDescription) ||
    "Din veileder i kultur og fritid i Namdalen";
  const imageUrl =
    getSanityImageUrl(seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || seo?.ogImageUrl;

  return buildSeoMetadata({
    title,
    description,
    path: "/",
    imageUrl,
    noIndex: seo?.noIndex,
  });
}

export const revalidate = 3600;

export default async function Home() {
  const [featuredEvents, backstageArticles, upcomingEvents, navItems] =
    await Promise.all([
      getHomepageFeaturedEvents(),
      getLatestBackstageArticles(),
      getUpcomingEventsPage({ offset: 0, limit: 12 }),
      getMainNavigation(),
    ]);

  return (
    <main className="min-h-screen bg-[white]">
      <Welcome navItems={navItems} />
      <FeaturedEventsCarousel events={featuredEvents} />
      <LatestBackstageArticlesGrid articles={backstageArticles} />
      <UpcomingEventsCarousel events={upcomingEvents} />
    </main>
  );
}
