import type { Metadata } from "next";
import { FeaturedEventsCarousel } from "./components/home/FeaturedEventsCarousel";
import { Welcome } from "./components/home/Welcome";
import { getHomepageFeaturedEvents } from "./lib/featured-events";

export const metadata: Metadata = {
  title: "Hjem",
};

export default async function Home() {
  const featuredEvents = await getHomepageFeaturedEvents();

  return (
    <main className="min-h-screen bg-white">
      <Welcome />
      <FeaturedEventsCarousel events={featuredEvents} />
    </main>
  );
}
