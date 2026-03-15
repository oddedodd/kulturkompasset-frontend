import Link from "next/link";
import { CalendarDays, UserRound } from "lucide-react";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import type { BulletinItem } from "@/app/lib/types";

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  weekday: "long",
  day: "numeric",
  month: "long",
  hour: "2-digit",
  minute: "2-digit",
});

type BulletinCardProps = {
  bulletin: BulletinItem;
};

export default function BulletinCard({ bulletin }: BulletinCardProps) {
  const heroImageUrl =
    getSanityImageUrl(bulletin.heroImage, {
      width: 900,
      height: 560,
    }) || bulletin.heroImageUrl;
  const organizerLabel = bulletin.organizer || "Arrangør kommer";
  const href = bulletin.slug ? `/bulletin/${bulletin.slug}` : "/bulletin";

  return (
    <article className="h-full w-full">
      <Link
        href={href}
        aria-label={`Åpne bulletin: ${bulletin.title}`}
        className="flex h-full min-h-136 flex-col overflow-hidden rounded-3xl bg-[#E9E5E0]"
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
          <h2 className="text-[2.2rem] font-semibold leading-tight tracking-tight">
            {bulletin.title}
          </h2>

          <div className="space-y-2 text-base text-black/65">
            <div className="flex items-center gap-3">
              <CalendarDays className="h-4 w-4 shrink-0 opacity-55" aria-hidden="true" />
              <span className="capitalize">
                {dateFormatter.format(new Date(bulletin.startsAt))}
              </span>
            </div>

            <div className="flex items-center gap-3">
              <UserRound className="h-4 w-4 shrink-0 opacity-55" aria-hidden="true" />
              <span>{organizerLabel}</span>
            </div>
          </div>

          {bulletin.description ? (
            <p className="mt-auto line-clamp-4 text-sm text-black/70">{bulletin.description}</p>
          ) : (
            <div className="mt-auto" />
          )}

          {bulletin.price ? (
            <div className="pt-2 text-sm">
              <span className="rounded-full bg-black/8 px-3 py-1 text-black/70">
                Pris: {bulletin.price}
              </span>
            </div>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
