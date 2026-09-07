import Image from "next/image";
import Link from "next/link";
import { MapPin } from "lucide-react";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import type { PortableTextEventCard, PortableTextEventRef } from "@/app/lib/types";

/**
 * Et arrangement kan bli avlyst eller gjennomført etter at kortet ble satt inn
 * i artikkelen, og da bør leseren se det.
 */
export function getEventNotice(event?: PortableTextEventRef): string | null {
  if (!event) return null;
  if (event.status === "cancelled") return "Avlyst";

  const endsAt = event.endsAt || event.startsAt;
  if (!endsAt) return null;

  const end = new Date(endsAt);
  if (Number.isNaN(end.getTime())) return null;

  return end.getTime() < Date.now() ? "Gjennomført" : null;
}

/**
 * Stedsnavn inneholder ofte bystedet fra før ("Kulturhuset i Namsos"), og på en
 * så smal stripe blir "…i Namsos, Namsos" bare støy.
 */
function formatVenue(venue?: PortableTextEventRef["venue"]): string {
  const name = venue?.name?.trim();
  const city = venue?.city?.trim();

  if (!name) return city ?? "";
  if (!city || name.toLowerCase().includes(city.toLowerCase())) return name;
  return `${name}, ${city}`;
}

type ArticleEventCardProps = {
  card: PortableTextEventCard;
};

export function ArticleEventCard({ card }: ArticleEventCardProps) {
  const event = card.event;
  if (!event) return null;

  // Redaktøren kan vinkle kortet mot artikkelen; er feltene tomme brukes
  // teksten fra arrangementet.
  const title = card.title || event.title;
  const summary = card.summary || event.summary;
  if (!title) return null;

  const href = event.slug ? `/event/${event.slug}` : "/kalender";
  const heroImageUrl =
    getSanityImageUrl(event.heroImage, {
      width: 240,
      height: 240,
    }) || event.heroImageUrl;
  const venueLabel = formatVenue(event.venue);
  const notice = getEventNotice(event);

  return (
    <Link
      href={href}
      aria-label={`Åpne arrangement: ${title}`}
      className="not-prose group my-6 flex items-center gap-4 overflow-hidden rounded-lg bg-[#E9E5E0] pr-4 transition-colors hover:bg-[#e2ddd6]"
    >
      {heroImageUrl ? (
        <Image
          src={heroImageUrl}
          alt={event.heroImageAlt || title}
          width={320}
          height={320}
          className="h-24 w-24 shrink-0 object-cover"
        />
      ) : (
        <div className="h-24 w-24 shrink-0 bg-[#c5bbae]" aria-hidden />
      )}

      <div className="min-w-0 py-2.5 text-[#312821]">
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/60">
          {venueLabel ? (
            <span className="flex min-w-0 items-center gap-1.5">
              <MapPin className="h-3.5 w-3.5 shrink-0 opacity-55" aria-hidden="true" />
              <span className="truncate">{venueLabel}</span>
            </span>
          ) : null}
          {notice ? (
            <span
              className={[
                "rounded-full px-2 py-0.5 font-semibold uppercase tracking-[0.08em]",
                notice === "Avlyst" ? "bg-red-100 text-red-800" : "bg-black/8 text-black/70",
              ].join(" ")}
            >
              {notice}
            </span>
          ) : null}
        </div>

        <h3 className="mt-0.5 truncate text-base font-semibold leading-snug tracking-tight">
          {title}
        </h3>

        {summary ? (
          <p className="line-clamp-2 text-sm leading-snug text-black/70">{summary}</p>
        ) : null}
      </div>
    </Link>
  );
}
