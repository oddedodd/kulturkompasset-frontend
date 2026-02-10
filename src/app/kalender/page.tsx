import type { Metadata } from "next";
import CalendarEventsGrid from "../components/events/CalendarEventsGrid";
import { getUpcomingEventsPage, getUpcomingEventVenues } from "../lib/events";

export const metadata: Metadata = {
  title: "Kalender",
};

export default async function KalenderPage() {
  const [events, venueOptions] = await Promise.all([
    getUpcomingEventsPage({ offset: 0, limit: 9 }),
    getUpcomingEventVenues(),
  ]);

  return (
    <main className="min-h-screen bg-white px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Kalender</h1>
        <p className="mt-3 text-black/70">
          Kommende arrangementer i kronologisk rekkefølge.
        </p>
      </section>

      <CalendarEventsGrid initialEvents={events} venueOptions={venueOptions} pageSize={9} />
    </main>
  );
}
