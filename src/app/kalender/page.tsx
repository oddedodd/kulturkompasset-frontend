import type { Metadata } from "next";
import EventCard from "../components/events/EventCard";
import { getUpcomingEvents } from "../lib/events";

export const metadata: Metadata = {
  title: "Kalender",
};

export default async function KalenderPage() {
  const events = await getUpcomingEvents();

  return (
    <main className="min-h-screen bg-white px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Kalender</h1>
        <p className="mt-3 text-black/70">
          Kommende arrangementer i kronologisk rekkefølge.
        </p>
      </section>

      {events.length === 0 ? (
        <section className="mx-auto mt-8 w-full max-w-6xl rounded-2xl bg-gray-100 px-6 py-16 text-center text-black/70">
          Ingen kommende arrangementer akkurat nå.
        </section>
      ) : (
        <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {events.map((event) => (
            <EventCard key={event._id} event={event} />
          ))}
        </section>
      )}
    </main>
  );
}
