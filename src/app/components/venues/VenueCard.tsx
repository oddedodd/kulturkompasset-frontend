import Link from "next/link";
import type { VenueListItem } from "@/app/lib/types";

type VenueCardProps = {
  venue: VenueListItem;
};

export default function VenueCard({ venue }: VenueCardProps) {
  const content = (
    <article className="h-full rounded-3xl bg-[#E9E5E0] p-6 text-[#312821] transition hover:bg-[#e1dcd5]">
      <h2 className="text-3xl font-semibold tracking-tight">{venue.name}</h2>
      <p className="mt-2 text-base text-black/70">{venue.city || "Ukjent by"}</p>
      {venue.address ? <p className="mt-2 text-sm text-black/65">{venue.address}</p> : null}
    </article>
  );

  if (!venue.slug) {
    return content;
  }

  return (
    <Link
      href={`/venues/${venue.slug}`}
      aria-label={`Åpne sted: ${venue.name}`}
      className="block h-full outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
    >
      {content}
    </Link>
  );
}
