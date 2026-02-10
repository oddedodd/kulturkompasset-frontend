import Link from "next/link";
import type { CalendarEvent } from "@/app/lib/types";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("nb-NO", {
  hour: "2-digit",
  minute: "2-digit",
});

type EventCardProps = {
  event: CalendarEvent;
  showReadMore?: boolean;
};

export default function EventCard({ event, showReadMore = true }: EventCardProps) {
  return (
    <article className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-[3/4]">
      {event.heroImageUrl ? (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${event.heroImageUrl})` }}
          aria-hidden
        />
      ) : (
        <div className="absolute inset-0 bg-gray-300" aria-hidden />
      )}

      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/45 to-black/20" />

      {event.slug ? (
        <Link
          href={`/event/${event.slug}`}
          aria-label={`Åpne arrangement: ${event.title}`}
          className="absolute inset-0 z-10"
        />
      ) : null}

      <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end p-5 text-white sm:p-6">
        <p className="text-sm font-medium uppercase tracking-wide text-white/85">
          {dateFormatter.format(new Date(event.startsAt))} •{" "}
          {timeFormatter.format(new Date(event.startsAt))}
        </p>

        <h2 className="mt-2 text-2xl font-semibold leading-tight sm:text-3xl">{event.title}</h2>

        <div className="mt-4 flex flex-wrap gap-2 text-sm">
          <span className="rounded-full bg-white/20 px-3 py-1">
            {event.venue?.name
              ? event.venue.city
                ? `${event.venue.name}, ${event.venue.city}`
                : event.venue.name
              : "Sted kommer"}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1">
            {event.contributors && event.contributors.length > 0
              ? event.contributors.join(", ")
              : "Artist/medvirkende kommer"}
          </span>
          <span className="rounded-full bg-white/20 px-3 py-1">
            {event.categories && event.categories.length > 0
              ? event.categories.join(", ")
              : "Kategori kommer"}
          </span>
        </div>

        {showReadMore && event.slug ? (
          <div className="mt-5">
            <Link
              href={`/event/${event.slug}`}
              className="pointer-events-auto inline-flex items-center gap-2 text-sm font-medium underline underline-offset-4 hover:text-white/85"
            >
              Les mer <span aria-hidden>→</span>
            </Link>
          </div>
        ) : null}
      </div>
    </article>
  );
}
