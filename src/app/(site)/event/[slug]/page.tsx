import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { CalendarDays, Clock3, Globe, MapPin, Tag, Ticket, Users } from "lucide-react";
import { getEventBySlug } from "@/app/lib/events";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";

type EventPageProps = {
  params: Promise<{ slug: string }>;
};

const dateTimeFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDateTime(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateTimeFormatter.format(date);
}

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("nb-NO", {
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : dateFormatter.format(date);
}

function formatTime(value?: string): string | null {
  if (!value) {
    return null;
  }

  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? null : timeFormatter.format(date);
}

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Arrangement ikke funnet",
    };
  }

  const seoDescription = sanitizeSeoDescription(event.seo?.metaDescription);
  const defaultDescription = sanitizeSeoDescription(event.summary || event.ingress);
  const description = seoDescription || defaultDescription;
  const seoOgImageUrl =
    getSanityImageUrl(event.seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || event.seo?.ogImageUrl;
  const defaultOgImageUrl =
    getSanityImageUrl(event.heroImage, {
      width: 1200,
      height: 630,
    }) || event.heroImageUrl;
  const imageUrl = seoOgImageUrl || defaultOgImageUrl;
  const title = event.seo?.metaTitle?.trim() || event.title;

  return buildSeoMetadata({
    title,
    description,
    path: `/event/${slug}`,
    imageUrl,
    noIndex: event.seo?.noIndex,
  });
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const startsAt = formatDateTime(event.startsAt);
  const endsAt = formatDateTime(event.endsAt);
  const startsDate = formatDate(event.startsAt);
  const startsTime = formatTime(event.startsAt);
  const endsTime = formatTime(event.endsAt);
  const summary = event.summary || event.ingress || event.description;
  const hasVenueDetails = Boolean(
    event.venue?.name || event.venue?.city || event.venue?.address || event.venue?.website,
  );
  const locationLabel =
    event.location ||
    [event.venue?.name, event.venue?.city].filter(Boolean).join(", ") ||
    undefined;
  const heroBackdropUrl =
    getSanityImageUrl(event.heroImage, {
      width: 2200,
      height: 1200,
    }) || event.heroImageUrl;
  const heroForegroundUrl =
    getSanityImageUrl(event.heroImage, {
      width: 1600,
      height: 1066,
    }) || event.heroImageUrl;

  return (
    <main className="min-h-screen bg-[#f7f4ee] pb-20">
      <section className="relative overflow-hidden bg-[#1f1711] px-4 pb-12 pt-14 sm:pb-20 sm:pt-16">
        {heroBackdropUrl ? (
          <>
            <div className="absolute inset-0 opacity-30">
              <Image
                src={heroBackdropUrl}
                alt=""
                fill
                className="object-cover blur-2xl scale-110"
                aria-hidden
              />
            </div>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(214,156,76,0.28),transparent_40%),linear-gradient(135deg,rgba(10,8,6,0.92),rgba(29,20,11,0.84))]" />
          </>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(214,156,76,0.22),transparent_40%),linear-gradient(135deg,#120f0b,#2a1d10)]" />
        )}

        <article className="relative mx-auto max-w-6xl">
          <Link
            href="/kalender"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
          >
            <span aria-hidden>←</span> Tilbake til kalender
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(320px,34rem)] lg:items-end">
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {event.title}
              </h1>

              <div className="mt-6 space-y-3 text-base text-white/88">
                {startsDate ? (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>{startsDate}</span>
                  </div>
                ) : null}

                {startsTime || endsTime ? (
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>
                      {startsTime ? `Starter ${startsTime}` : null}
                      {startsTime && endsTime ? " • " : null}
                      {endsTime ? `Slutter ${endsTime}` : null}
                    </span>
                  </div>
                ) : null}

                {event.location ? (
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>{event.location}</span>
                  </div>
                ) : null}

                {event.contributors && event.contributors.length > 0 ? (
                  <div className="flex items-start gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>{event.contributors.join(", ")}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {heroForegroundUrl ? (
              <div className="flex justify-center lg:justify-end">
                <Image
                  src={heroForegroundUrl}
                  alt={event.heroImageAlt || event.title}
                  width={1600}
                  height={1066}
                  className="h-auto max-h-112 w-auto max-w-full rounded-4xl shadow-[0_24px_80px_rgba(0,0,0,0.22)]"
                />
              </div>
            ) : null}
          </div>
        </article>
      </section>

      <article className="mx-auto mt-10 max-w-6xl px-4">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(18rem,0.8fr)] lg:items-start">
          <div className="space-y-8">
            {(summary || (event.body && event.body.length > 0)) ? (
              <section className="rounded-4xl bg-[#f8f7f4] px-6 py-7 sm:px-8 sm:py-9">
                {summary ? (
                  <>
                    <h2 className="text-3xl font-semibold tracking-tight text-[#2a211a] sm:text-[2rem]">
                      Beskrivelse
                    </h2>
                    <p className="mt-5 text-lg leading-relaxed text-black/75">{summary}</p>
                  </>
                ) : null}

                {event.body && event.body.length > 0 ? (
                  <div
                    className={`prose prose-neutral max-w-none text-black/80 ${
                      summary ? "mt-8" : "mt-0"
                    }`}
                  >
                    <PortableText value={event.body} />
                  </div>
                ) : null}
              </section>
            ) : null}
          </div>

          <aside className="space-y-6">
            <section className="rounded-4xl bg-[#efe6d8] px-6 py-7 sm:px-8 sm:py-8">
              <h2 className="text-3xl font-semibold tracking-tight text-[#2a211a] sm:text-[2rem]">
                Praktisk info
              </h2>

              <div className="mt-6 space-y-5 text-base text-black/72">
                {startsAt ? (
                  <div className="flex gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">Dato</p>
                      <p className="mt-1">{startsAt}</p>
                    </div>
                  </div>
                ) : null}

                {locationLabel ? (
                  <div className="flex gap-3">
                    <MapPin className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">Sted</p>
                      <p className="mt-1">{locationLabel}</p>
                    </div>
                  </div>
                ) : null}

                {event.priceFrom ? (
                  <div className="flex gap-3">
                    <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">
                        Pris fra
                      </p>
                      <p className="mt-1">{event.priceFrom.toLocaleString("nb-NO")} kr</p>
                    </div>
                  </div>
                ) : null}

                {event.contributors && event.contributors.length > 0 ? (
                  <div className="flex gap-3">
                    <Users className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">
                        Medvirkende
                      </p>
                      <p className="mt-1">{event.contributors.join(", ")}</p>
                    </div>
                  </div>
                ) : null}

                {event.categories && event.categories.length > 0 ? (
                  <div className="flex gap-3">
                    <Tag className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">
                        Kategorier
                      </p>
                      <div className="mt-2 flex flex-wrap gap-2">
                        {event.categories.map((category) => (
                          <span
                            key={category}
                            className="rounded-full bg-[#f8f7f4]/60 px-3 py-1 text-sm text-black/70"
                          >
                            {category}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>

              {event.ticketUrl ? (
                <a
                  href={event.ticketUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-7 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#2a211a] px-6 py-3 text-sm font-medium text-white transition hover:bg-[#1f1711]"
                >
                  <Ticket className="h-4 w-4" />
                  Kjøp billett
                </a>
              ) : null}
            </section>

            {hasVenueDetails ? (
              <section className="rounded-4xl bg-[#f8f7f4] px-6 py-7 sm:px-8 sm:py-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[#2a211a]">Sted</h2>
                <div className="mt-5 space-y-2 text-base text-black/72">
                  {event.venue?.name ? <p className="font-medium text-black/80">{event.venue.name}</p> : null}
                  {event.venue?.address ? <p>{event.venue.address}</p> : null}
                  {event.venue?.city ? <p>{event.venue.city}</p> : null}
                </div>

                {event.venue?.website ? (
                  <a
                    href={event.venue.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-5 inline-flex items-center gap-2 text-sm font-medium text-black/70 transition hover:text-black"
                  >
                    <Globe className="h-4 w-4" />
                    Besok nettsted
                  </a>
                ) : null}
              </section>
            ) : null}

            {event.contributors && event.contributors.length > 0 ? (
              <section className="rounded-4xl bg-[#f8f7f4] px-6 py-7 sm:px-8 sm:py-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[#2a211a]">
                  På scenen
                </h2>
                <div className="mt-5 flex flex-wrap gap-3">
                  {event.contributors.map((contributor) => (
                    <span
                      key={contributor}
                      className="rounded-full bg-[#f4efe7] px-4 py-2 text-sm text-black/70"
                    >
                      {contributor}
                    </span>
                  ))}
                </div>
              </section>
            ) : null}

            {event.partners && event.partners.length > 0 ? (
              <section className="rounded-4xl bg-[#f8f7f4] px-6 py-7 sm:px-8 sm:py-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[#2a211a]">Partnere</h2>
                <div className="mt-5 space-y-3">
                  {event.partners.map((partner, index) =>
                    partner.website ? (
                      <a
                        key={`${partner.name || "partner"}-${index}`}
                        href={partner.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="block text-base text-black/72 transition hover:text-black"
                      >
                        {partner.name || "Partner"}
                      </a>
                    ) : (
                      <p key={`${partner.name || "partner"}-${index}`} className="text-base text-black/72">
                        {partner.name || "Partner"}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ) : null}

            {event.relatedArticles && event.relatedArticles.length > 0 ? (
              <section className="rounded-4xl bg-[#f8f7f4] px-6 py-7 sm:px-8 sm:py-8">
                <h2 className="text-2xl font-semibold tracking-tight text-[#2a211a]">
                  Les mer
                </h2>
                <div className="mt-5 space-y-3">
                  {event.relatedArticles.map((article) =>
                    article.slug ? (
                      <Link
                        key={article._id}
                        href={`/backstage/${article.slug}`}
                        className="block text-base text-black/72 transition hover:text-black"
                      >
                        {article.title}
                      </Link>
                    ) : (
                      <p key={article._id} className="text-base text-black/72">
                        {article.title}
                      </p>
                    ),
                  )}
                </div>
              </section>
            ) : null}
          </aside>
        </div>
      </article>
    </main>
  );
}
