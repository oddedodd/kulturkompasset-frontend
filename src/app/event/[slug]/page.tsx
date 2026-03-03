import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { PortableText } from "@portabletext/react";
import { getEventBySlug } from "../../lib/events";

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

export async function generateMetadata({ params }: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    return {
      title: "Arrangement ikke funnet",
    };
  }

  return {
    title: event.title,
    description: event.ingress || event.description || undefined,
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  const event = await getEventBySlug(slug);

  if (!event) {
    notFound();
  }

  const startsAt = formatDateTime(event.startsAt);
  const endsAt = formatDateTime(event.endsAt);
  const summary = event.ingress || event.description;

  return (
    <main className="min-h-screen bg-white px-6 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl">
        <Link href="/" className="text-sm text-black/60 hover:text-black">
          Tilbake til forsiden
        </Link>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{event.title}</h1>

        <div className="mt-6 space-y-2 text-base text-black/75">
          {startsAt ? <p>Starter: {startsAt}</p> : null}
          {endsAt ? <p>Slutter: {endsAt}</p> : null}
          {event.location ? <p>Sted: {event.location}</p> : null}
          {event.contributors && event.contributors.length > 0 ? (
            <p>Medvirkende: {event.contributors.join(", ")}</p>
          ) : null}
        </div>

        {event.heroImageUrl ? (
          <Image
            src={event.heroImageUrl}
            alt={event.heroImageAlt || event.title}
            width={1600}
            height={900}
            className="mt-8 h-auto w-full rounded-2xl object-cover"
          />
        ) : null}

        {summary ? <p className="mt-8 text-lg leading-relaxed text-black/85">{summary}</p> : null}

        {event.body && event.body.length > 0 ? (
          <section className="prose prose-neutral mt-10 max-w-none">
            <PortableText value={event.body} />
          </section>
        ) : null}

        {event.ticketUrl ? (
          <a
            href={event.ticketUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-10 inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white transition hover:bg-black/80"
          >
            Kjøp billett
          </a>
        ) : null}
      </article>
    </main>
  );
}
