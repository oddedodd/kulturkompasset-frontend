import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import type { CalendarEvent } from "@/app/lib/types";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

type VenueEventsListProps = {
  events: CalendarEvent[];
};

export default function VenueEventsList({ events }: VenueEventsListProps) {
  if (events.length === 0) {
    return (
      <section className="rounded-3xl bg-white px-6 py-8 sm:px-8">
        <h2 className="text-2xl font-semibold tracking-tight text-[#2a211a]">Kommende arrangement</h2>
        <p className="mt-4 text-black/70">Ingen kommende arrangement for dette stedet akkurat nå.</p>
      </section>
    );
  }

  return (
    <section className="rounded-3xl bg-white px-6 py-8 sm:px-8">
      <h2 className="text-2xl font-semibold tracking-tight text-[#2a211a]">Kommende arrangement</h2>
      <ul className="mt-6 space-y-4">
        {events.map((event) => {
          const href = event.slug ? `/event/${event.slug}` : "/kalender";
          const startsAt = dateFormatter.format(new Date(event.startsAt));
          const location = event.venue?.name
            ? event.venue.city
              ? `${event.venue.name}, ${event.venue.city}`
              : event.venue.name
            : "Sted kommer";

          return (
            <li key={event._id}>
              <Link
                href={href}
                className="block rounded-2xl bg-[#f7f4ee] px-4 py-4 transition hover:bg-[#efe8dc]"
              >
                <p className="text-lg font-medium text-[#2a211a]">{event.title}</p>
                <div className="mt-2 space-y-1 text-sm text-black/70">
                  <p className="flex items-center gap-2">
                    <CalendarDays className="h-4 w-4 shrink-0" />
                    <span>{startsAt}</span>
                  </p>
                  <p className="flex items-center gap-2">
                    <MapPin className="h-4 w-4 shrink-0" />
                    <span>{location}</span>
                  </p>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
