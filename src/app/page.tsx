import type { Metadata } from "next";
import { FeaturedEventsCarousel } from "./components/home/FeaturedEventsCarousel";
import { getHomepageFeaturedEvents } from "./lib/featured-events";

export const metadata: Metadata = {
  title: "Hjem",
};

export default async function Home() {
  const featuredEvents = await getHomepageFeaturedEvents();

  return (
    <main className="min-h-screen bg-white">
      <FeaturedEventsCarousel events={featuredEvents} />

      {/* Midlertidig hero-område så du ser det funker */}
      <section className="mx-auto flex min-h-[60vh] max-w-5xl flex-col items-center justify-center px-6 py-20 text-center">
        <h1 className="text-5xl font-light tracking-wide">Kulturkompasset.</h1>
        <p className="mt-5 max-w-md text-sm text-black/60">
          Din veileder i kultur og fritid i Namdalen
        </p>

        <div className="mt-10 h-px w-64 bg-black/20" />
      </section>
    </main>
  );
}
