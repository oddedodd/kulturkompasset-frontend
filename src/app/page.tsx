import type { Metadata } from "next";
import { FeaturedEventsCarousel } from "./components/home/FeaturedEventsCarousel";
import { LatestBackstageArticlesGrid } from "./components/home/LatestBackstageArticlesGrid";
import { UpcomingEventsCarousel } from "./components/home/UpcomingEventsCarousel";
import { Welcome } from "./components/home/Welcome";
import { getLatestBackstageArticles } from "./lib/articles";
import { getUpcomingEventsPage } from "./lib/events";
import { getHomepageFeaturedEvents } from "./lib/featured-events";

export const metadata: Metadata = {
  title: "Hjem",
};

export const revalidate = 3600;

export default async function Home() {
  const [featuredEvents, backstageArticles, upcomingEvents] = await Promise.all(
    [
      getHomepageFeaturedEvents(),
      getLatestBackstageArticles(),
      getUpcomingEventsPage({ offset: 0, limit: 12 }),
    ],
  );

  return (
    <main className="min-h-screen bg-[white]">
      <Welcome />
      <FeaturedEventsCarousel events={featuredEvents} />
      <LatestBackstageArticlesGrid articles={backstageArticles} />
      <UpcomingEventsCarousel events={upcomingEvents} />
    </main>
  );
}
