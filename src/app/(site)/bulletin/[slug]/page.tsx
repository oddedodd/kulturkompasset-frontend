import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { CalendarDays, Clock3, Mail, Ticket, UserRound } from "lucide-react";
import { getBulletinBySlug } from "@/app/lib/bulletins";
import { getSanityImageUrl } from "@/app/lib/sanity-image";

type BulletinPageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

const timeFormatter = new Intl.DateTimeFormat("nb-NO", {
  hour: "2-digit",
  minute: "2-digit",
});

const dateTimeFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
});

function formatDate(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : dateFormatter.format(parsed);
}

function formatTime(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : timeFormatter.format(parsed);
}

function formatDateTime(value?: string): string | null {
  if (!value) return null;
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? null : dateTimeFormatter.format(parsed);
}

export async function generateMetadata({ params }: BulletinPageProps): Promise<Metadata> {
  const { slug } = await params;
  const bulletin = await getBulletinBySlug(slug);

  if (!bulletin) {
    return { title: "Oppslag ikke funnet" };
  }

  return {
    title: bulletin.title,
    description: bulletin.description || undefined,
  };
}

export default async function BulletinDetailPage({ params }: BulletinPageProps) {
  const { slug } = await params;
  const bulletin = await getBulletinBySlug(slug);

  if (!bulletin) {
    notFound();
  }

  const startsDate = formatDate(bulletin.startsAt);
  const startsTime = formatTime(bulletin.startsAt);
  const startsAt = formatDateTime(bulletin.startsAt);
  const heroBackdropUrl =
    getSanityImageUrl(bulletin.heroImage, {
      width: 2200,
      height: 1200,
    }) || bulletin.heroImageUrl;
  const heroForegroundUrl =
    getSanityImageUrl(bulletin.heroImage, {
      width: 1600,
      height: 1066,
    }) || bulletin.heroImageUrl;

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
                className="scale-110 object-cover blur-2xl"
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
            href="/bulletin"
            className="inline-flex items-center gap-2 text-sm text-white/70 transition hover:text-white"
          >
            <span aria-hidden>←</span> Tilbake til oppslagstavla
          </Link>

          <div
            className={[
              "mt-8 grid gap-10 lg:items-end",
              heroForegroundUrl
                ? "lg:grid-cols-[minmax(0,1fr)_minmax(320px,34rem)]"
                : "lg:grid-cols-1",
            ].join(" ")}
          >
            <div className="max-w-2xl">
              <h1 className="text-4xl font-semibold tracking-tight text-white sm:text-5xl">
                {bulletin.title}
              </h1>

              <div className="mt-6 space-y-3 text-base text-white/88">
                {startsDate ? (
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>{startsDate}</span>
                  </div>
                ) : null}

                {startsTime ? (
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>Starter {startsTime}</span>
                  </div>
                ) : null}

                {bulletin.organizer ? (
                  <div className="flex items-start gap-3">
                    <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[#dec47a]" />
                    <span>{bulletin.organizer}</span>
                  </div>
                ) : null}
              </div>
            </div>

            {heroForegroundUrl ? (
              <div className="flex justify-center lg:justify-end">
                <Image
                  src={heroForegroundUrl}
                  alt={bulletin.heroImageAlt || bulletin.title}
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
            {bulletin.description ? (
              <section className="rounded-4xl bg-white px-6 py-7 sm:px-8 sm:py-9">
                <h2 className="text-3xl font-semibold tracking-tight text-[#2a211a] sm:text-[2rem]">
                  Beskrivelse
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-black/75">
                  {bulletin.description}
                </p>
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

                {bulletin.organizer ? (
                  <div className="flex gap-3">
                    <UserRound className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">
                        Arrangør
                      </p>
                      <p className="mt-1">{bulletin.organizer}</p>
                    </div>
                  </div>
                ) : null}

                {bulletin.contact ? (
                  <div className="flex gap-3">
                    <Mail className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">
                        Kontakt
                      </p>
                      <p className="mt-1">{bulletin.contact}</p>
                    </div>
                  </div>
                ) : null}

                {bulletin.price ? (
                  <div className="flex gap-3">
                    <Ticket className="mt-0.5 h-5 w-5 shrink-0 text-[#8a6b2f]" />
                    <div>
                      <p className="text-sm uppercase tracking-[0.18em] text-black/45">Pris</p>
                      <p className="mt-1">{bulletin.price}</p>
                    </div>
                  </div>
                ) : null}
              </div>
            </section>
          </aside>
        </div>
      </article>
    </main>
  );
}
