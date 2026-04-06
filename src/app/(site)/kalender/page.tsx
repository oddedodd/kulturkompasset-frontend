import type { Metadata } from "next";
import CalendarEventsGrid from "@/app/components/events/CalendarEventsGrid";
import { getUpcomingEventsPage, getUpcomingEventVenues } from "@/app/lib/events";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";
import { getSitePageSeo } from "@/app/lib/site-seo";

export async function generateMetadata(): Promise<Metadata> {
  const seo = await getSitePageSeo("events");
  const title = seo?.metaTitle || "Kalender";
  const description =
    sanitizeSeoDescription(seo?.metaDescription) ||
    "Her er et utvalg av det som skjer på scener rundt om i Namdalen.";
  const imageUrl =
    getSanityImageUrl(seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || seo?.ogImageUrl;

  return buildSeoMetadata({
    title,
    description,
    path: "/kalender",
    imageUrl,
    noIndex: seo?.noIndex,
  });
}

export default async function KalenderPage() {
  const [events, venueOptions] = await Promise.all([
    getUpcomingEventsPage({ offset: 0, limit: 9 }),
    getUpcomingEventVenues(),
  ]);

  return (
    <main className="min-h-screen bg-[#f8f7f4] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Kalender</h1>
        <p className="mt-3 text-black/70">
        Her er et utvalg av det som skjer på scener rundt om i Namdalen.
        </p>
      </section>

      <CalendarEventsGrid
        initialEvents={events}
        venueOptions={venueOptions}
        pageSize={9}
      />
    </main>
  );
}
