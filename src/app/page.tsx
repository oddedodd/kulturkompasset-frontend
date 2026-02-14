import type { Metadata } from "next";
import { FeaturedEventsCarousel } from "./components/home/FeaturedEventsCarousel";
import { LatestBackstageArticlesGrid } from "./components/home/LatestBackstageArticlesGrid";
import { Welcome } from "./components/home/Welcome";
import { getLatestBackstageArticles } from "./lib/articles";
import { getHomepageFeaturedEvents } from "./lib/featured-events";

export const metadata: Metadata = {
  title: "Hjem",
};

export default async function Home() {
  const [featuredEvents, backstageArticles] = await Promise.all([
    getHomepageFeaturedEvents(),
    getLatestBackstageArticles(),
  ]);

  return (
    <main className="min-h-screen bg-white">
      <Welcome />
      <FeaturedEventsCarousel events={featuredEvents} />
      <LatestBackstageArticlesGrid articles={backstageArticles} />
    </main>
  );
}
