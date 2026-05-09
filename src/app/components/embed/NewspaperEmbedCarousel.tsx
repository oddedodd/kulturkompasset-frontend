"use client";

import Link from "next/link";
import { useRef, useState } from "react";
import type { CSSProperties } from "react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import {
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  MapPin,
  Pause,
  Play,
} from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import type { NewspaperEmbedCarouselItem } from "@/app/lib/types";

type NewspaperEmbedCarouselProps = {
  items: NewspaperEmbedCarouselItem[];
};

const eventDateFormatter = new Intl.DateTimeFormat("nb-NO", {
  timeZone: "Europe/Oslo",
  weekday: "long",
  day: "numeric",
  month: "long",
});

const articleDateFormatter = new Intl.DateTimeFormat("nb-NO", {
  timeZone: "Europe/Oslo",
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function NewspaperEmbedCarousel({
  items,
}: NewspaperEmbedCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);
  const [isPaused, setIsPaused] = useState(false);

  if (items.length === 0) {
    return null;
  }

  function toggleAutoplay() {
    const swiper = swiperRef.current;
    if (!swiper?.autoplay) return;

    if (isPaused) {
      swiper.autoplay.start();
      setIsPaused(false);
      return;
    }

    swiper.autoplay.stop();
    setIsPaused(true);
  }

  return (
    <section className="w-full bg-[#fff6d7] px-3 py-4 text-[#171717] sm:px-4">
      <div className="mx-auto w-full max-w-7xl">
        <div className="relative">
          <div className="mb-3 flex items-center justify-end gap-2">
            <button
              type="button"
              onClick={() => swiperRef.current?.slidePrev()}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/68 text-white shadow-sm transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              aria-label="Forrige"
            >
              <ChevronLeft className="h-5 w-5" aria-hidden="true" />
            </button>

            <button
              type="button"
              onClick={toggleAutoplay}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/68 text-white shadow-sm transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              aria-label={isPaused ? "Start karusell" : "Pause karusell"}
              aria-pressed={isPaused}
            >
              {isPaused ? (
                <Play className="h-4 w-4" aria-hidden="true" />
              ) : (
                <Pause className="h-4 w-4" aria-hidden="true" />
              )}
            </button>

            <button
              type="button"
              onClick={() => swiperRef.current?.slideNext()}
              className="inline-flex h-10 w-10 cursor-pointer items-center justify-center rounded-full bg-black/68 text-white shadow-sm transition hover:bg-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2"
              aria-label="Neste"
            >
              <ChevronRight className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <Swiper
            modules={[A11y, Autoplay, Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={14}
            slidesPerView={1.08}
            grabCursor
            pagination={{ clickable: true }}
            autoplay={{
              delay: 4500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            style={
              {
                "--swiper-pagination-color": "#171717",
              } as CSSProperties
            }
            className="pb-9 [&_.swiper-pagination]:!bottom-0 [&_.swiper-pagination-bullet]:bg-black/35 [&_.swiper-pagination-bullet-active]:bg-black"
            breakpoints={{
              560: {
                slidesPerView: 1.6,
                spaceBetween: 16,
              },
              780: {
                slidesPerView: 2.25,
                spaceBetween: 16,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 18,
              },
            }}
          >
            {items.map((item) => (
              <SwiperSlide key={`${item.type}-${item._id}`} className="h-auto">
                {item.type === "event" ? (
                  <EventEmbedCard item={item} />
                ) : (
                  <ArticleEmbedCard item={item} />
                )}
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}

function EventEmbedCard({
  item,
}: {
  item: Extract<NewspaperEmbedCarouselItem, { type: "event" }>;
}) {
  const href = item.slug ? `/event/${item.slug}` : "/kalender";
  const heroImageUrl =
    getSanityImageUrl(item.heroImage, {
      width: 720,
      height: 450,
    }) || item.heroImageUrl;
  const venueLabel = item.venue?.name
    ? item.venue.city
      ? `${item.venue.name}, ${item.venue.city}`
      : item.venue.name
    : "Sted kommer";

  return (
    <article className="h-full">
      <Link
        href={href}
        target="_top"
        aria-label={`Åpne arrangement: ${item.title}`}
        className="flex h-full min-h-[25rem] flex-col overflow-hidden rounded-lg bg-white shadow-sm ring-1 ring-black/8 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        {heroImageUrl ? (
          <div
            className="h-44 w-full shrink-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="h-44 w-full shrink-0 bg-[#d8d0c5]" aria-hidden />
        )}

        <div className="flex flex-1 flex-col p-4 text-[#28221d]">
          <span className="mb-3 inline-flex w-fit rounded-full bg-black/8 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-black/70">
            Arrangement
          </span>
          <h2 className="line-clamp-2 text-xl font-semibold leading-tight">
            {item.title}
          </h2>

          <div className="mt-4 space-y-2 text-sm leading-snug text-black/65">
            <div className="flex items-center gap-2">
              <CalendarDays
                className="h-4 w-4 shrink-0 opacity-60"
                aria-hidden="true"
              />
              <span className="capitalize">
                {eventDateFormatter.format(new Date(item.startsAt))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin
                className="h-4 w-4 shrink-0 opacity-60"
                aria-hidden="true"
              />
              <span className="line-clamp-1">{venueLabel}</span>
            </div>
          </div>
        </div>
      </Link>
    </article>
  );
}

function ArticleEmbedCard({
  item,
}: {
  item: Extract<NewspaperEmbedCarouselItem, { type: "article" }>;
}) {
  const heroImageUrl =
    getSanityImageUrl(item.heroImage, {
      width: 720,
      height: 900,
    }) || item.heroImageUrl;

  return (
    <article className="h-full">
      <Link
        href={`/backstage/${item.slug}`}
        target="_top"
        aria-label={`Åpne Backstage-artikkel: ${item.title}`}
        className="group relative block h-full min-h-[25rem] overflow-hidden rounded-lg bg-[#28221d] shadow-sm ring-1 ring-black/8 transition hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black"
      >
        {heroImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 bg-[#7f776d]" aria-hidden />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/45 to-black/12" />

        <div className="relative z-10 flex h-full flex-col justify-end p-4 text-white">
          <span className="mb-3 inline-flex w-fit rounded-full bg-white/18 px-2.5 py-1 text-[0.68rem] font-semibold uppercase tracking-[0.12em] text-white/90 backdrop-blur-sm">
            Backstage
          </span>
          <h2 className="line-clamp-2 text-xl font-semibold leading-tight">
            {item.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-white/86">
            {item.excerpt?.trim() || "Les saken i Backstage."}
          </p>
          {item.publishedAt ? (
            <p className="mt-3 text-xs font-medium uppercase tracking-[0.12em] text-white/76">
              {articleDateFormatter.format(new Date(item.publishedAt))}
            </p>
          ) : null}
        </div>
      </Link>
    </article>
  );
}
