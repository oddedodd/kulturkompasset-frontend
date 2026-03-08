import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Globe, MapPin } from "lucide-react";
import VenueEventsList from "@/app/components/venues/VenueEventsList";
import { getUpcomingEventsForVenueSlug, getVenueBySlug } from "@/app/lib/venues";

type VenuePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({ params }: VenuePageProps): Promise<Metadata> {
  const { slug } = await params;
  const venue = await getVenueBySlug(slug);

  if (!venue) {
    return {
      title: "Sted ikke funnet",
    };
  }

  return {
    title: venue.name,
    description: [venue.city, venue.address].filter(Boolean).join(", ") || undefined,
  };
}

export default async function VenuePage({ params }: VenuePageProps) {
  const { slug } = await params;
  const [venue, upcomingEvents] = await Promise.all([
    getVenueBySlug(slug),
    getUpcomingEventsForVenueSlug(slug),
  ]);

  if (!venue) {
    notFound();
  }

  const locationLabel = [venue.address, venue.city].filter(Boolean).join(", ");

  return (
    <main className="min-h-screen bg-[#f7f4ee] pb-20">
      <section className="relative overflow-hidden bg-[#1f1711] px-4 pb-12 pt-14 sm:pb-20 sm:pt-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(214,156,76,0.22),transparent_40%),linear-gradient(135deg,#120f0b,#2a1d10)]" />

        <article className="relative mx-auto max-w-6xl">
          <Link
            href="/venues"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
          >
            <span aria-hidden>←</span> Tilbake til steder
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(220px,24rem)] lg:items-end">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {venue.name}
              </h1>
              <div className="mt-6 space-y-3 text-base text-white/88">
                {locationLabel ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>{locationLabel}</span>
                  </div>
                ) : null}
                {venue.website ? (
                  <div className="flex items-start gap-3">
                    <Globe className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <a
                      href={venue.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="underline underline-offset-4 hover:text-white"
                    >
                      Besok nettsted
                    </a>
                  </div>
                ) : null}
              </div>
            </div>

            {venue.logoUrl ? (
              <div className="flex justify-start lg:justify-end">
                <Image
                  src={venue.logoUrl}
                  alt={`Logo for ${venue.name}`}
                  width={800}
                  height={800}
                  className="h-auto max-h-44 w-auto max-w-full rounded-3xl bg-white/90 p-4"
                />
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <article className="mx-auto mt-10 max-w-6xl px-4">
        <VenueEventsList events={upcomingEvents} />
      </article>
    </main>
  );
}
