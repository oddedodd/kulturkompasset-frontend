import Link from "next/link";
import { CalendarDays, MapPin } from "lucide-react";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import type { CalendarEvent } from "@/app/lib/types";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

type EventCardProps = {
  event: CalendarEvent;
};

export default function EventCard({ event }: EventCardProps) {
  const href = event.slug ? `/event/${event.slug}` : "/kalender";
  const heroImageUrl =
    getSanityImageUrl(event.heroImage, {
      width: 900,
      height: 560,
    }) || event.heroImageUrl;
  const venueLabel = event.venue?.name
    ? event.venue.city
      ? `${event.venue.name}, ${event.venue.city}`
      : event.venue.name
    : "Sted kommer";
  const primaryCategory =
    event.categories && event.categories.length > 0 ? event.categories[0] : "Kategori kommer";

  return (
    <article className="h-full w-full">
      <Link
        href={href}
        aria-label={`Åpne arrangement: ${event.title}`}
        className="flex h-full min-h-[34rem] flex-col overflow-hidden rounded-[1.5rem] bg-[#E9E5E0]"
      >
        {heroImageUrl ? (
          <div
            className="h-56 w-full shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden
          />
        ) : (
          <div className="h-56 w-full shrink-0 bg-[#c5bbae]" aria-hidden />
        )}

        <div className="flex flex-1 flex-col space-y-4 p-6 text-[#312821]">
          <h2 className="text-[2.2rem] font-semibold leading-tight tracking-tight">{event.title}</h2>

          <div className="space-y-2 text-base text-black/65">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 shrink-0 opacity-55" aria-hidden="true" />
              <span className="capitalize">{dateFormatter.format(new Date(event.startsAt))}</span>
            </div>

            <div className="flex items-center gap-3">
              <MapPin className="h-4 w-4 shrink-0 opacity-55" aria-hidden="true" />
              <span>{venueLabel}</span>
            </div>
          </div>

          <div className="mt-auto flex flex-wrap gap-2 pt-2 text-sm">
            <span className="rounded-full bg-black/8 px-3 py-1 text-black/70">{primaryCategory}</span>
            {event.contributors && event.contributors.length > 0 ? (
              <span className="rounded-full bg-black/8 px-3 py-1 text-black/70">
                {event.contributors[0]}
              </span>
            ) : null}
          </div>
        </div>
      </Link>
    </article>
  );
}
