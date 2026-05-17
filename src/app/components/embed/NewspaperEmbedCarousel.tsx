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
import type { HomePartner, NewspaperEmbedCarouselItem } from "@/app/lib/types";

type NewspaperEmbedCarouselProps = {
  items: NewspaperEmbedCarouselItem[];
  partner?: HomePartner | null;
};

const eventDateFormatter = new Intl.DateTimeFormat("nb-NO", {
  timeZone: "Europe/Oslo",
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function NewspaperEmbedCarousel({
  items,
  partner,
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
    <section className="w-full bg-[#fbfaf8] px-2 py-2 text-[#312821] sm:px-4">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-3 flex items-center justify-between gap-4 pt-1">
          <img
            src="/logo01.svg"
            alt="KulturKompasset"
            width={1106}
            height={145}
            className="h-6 w-auto min-w-0 sm:h-7"
          />
          {partner?.logoUrl ? (
            <div className="flex shrink-0 flex-col items-start justify-center gap-px text-left">
              <span className="text-[9px] font-medium uppercase leading-none tracking-[0.12em] text-[#312821]/70 sm:text-[10px]">
                Presenteres av:
              </span>
              {partner.website ? (
                <Link
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-end"
                  aria-label={`Besøk ${partner.name}`}
                >
                  <img
                    src={partner.logoUrl}
                    alt={partner.name}
                    className="max-h-5 w-auto max-w-[38vw] object-contain sm:max-h-6 sm:max-w-44"
                  />
                </Link>
              ) : (
                <img
                  src={partner.logoUrl}
                  alt={partner.name}
                  className="max-h-5 w-auto max-w-[38vw] object-contain sm:max-h-6 sm:max-w-44"
                />
              )}
            </div>
          ) : null}
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-1 top-44 z-20 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#cfcac3]/90 text-black shadow-sm backdrop-blur-sm transition hover:bg-[#bdb7af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:left-2 sm:top-40"
            aria-label="Forrige"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={toggleAutoplay}
            className="absolute right-1 top-20 z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#cfcac3]/90 text-black shadow-sm backdrop-blur-sm transition hover:bg-[#bdb7af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:right-2 sm:top-16"
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
            className="absolute right-1 top-44 z-20 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#cfcac3]/90 text-black shadow-sm backdrop-blur-sm transition hover:bg-[#bdb7af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:right-2 sm:top-40"
            aria-label="Neste"
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </button>

          <Swiper
            modules={[A11y, Autoplay, Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={16}
            slidesPerView={1}
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
            className="pb-10 [&_.swiper-pagination]:!bottom-0 [&_.swiper-pagination-bullet]:bg-black/35 [&_.swiper-pagination-bullet-active]:bg-black"
            breakpoints={{
              560: {
                slidesPerView: 1.6,
                spaceBetween: 20,
              },
              780: {
                slidesPerView: 2.25,
                spaceBetween: 20,
              },
              1024: {
                slidesPerView: 3,
                spaceBetween: 20,
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
        className="relative flex h-full min-h-[24rem] flex-col overflow-hidden rounded-[1.1rem] bg-[#e9e5e0] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:min-h-[24.5rem] lg:min-h-[26rem]"
      >
        <span className="absolute right-3 top-3 z-10 rounded-full bg-[#312821] px-2.5 py-1 text-[0.68rem] font-medium text-white shadow-sm sm:right-4 sm:top-4 sm:text-xs">
          Arrangement
        </span>

        {heroImageUrl ? (
          <div
            className="h-56 w-full shrink-0 bg-cover bg-center sm:h-48"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="h-56 w-full shrink-0 bg-[#d8d0c5] sm:h-48" aria-hidden />
        )}

        <div className="flex flex-1 flex-col p-4 text-[#312821] sm:p-5">
          <h2 className="line-clamp-3 text-[1.35rem] font-semibold leading-tight tracking-tight sm:text-[1.45rem] md:text-[1.55rem]">
            {item.title}
          </h2>

          <div className="mt-4 space-y-2.5 text-sm leading-snug text-black/65 sm:text-[0.95rem]">
            <div className="flex items-center gap-2">
              <CalendarDays
                className="h-4 w-4 shrink-0 opacity-55"
                aria-hidden="true"
              />
              <span className="capitalize">
                {eventDateFormatter.format(new Date(item.startsAt))}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin
                className="h-4 w-4 shrink-0 opacity-55"
                aria-hidden="true"
              />
              <span className="line-clamp-2">{venueLabel}</span>
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
        className="group relative block h-full min-h-[24rem] overflow-hidden rounded-[1.1rem] bg-[#28221d] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:min-h-[24.5rem] lg:min-h-[26rem]"
      >
        <span className="absolute right-3 top-3 z-20 rounded-full bg-white/88 px-2.5 py-1 text-[0.68rem] font-medium text-[#312821] shadow-sm backdrop-blur-sm sm:right-4 sm:top-4 sm:text-xs">
          Historie
        </span>

        {heroImageUrl ? (
          <div
            className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="absolute inset-0 bg-[#7f776d]" aria-hidden />
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/88 via-black/38 to-black/8" />

        <div className="absolute bottom-0 left-0 right-0 z-10 p-4 text-white sm:p-5">
          <h2 className="line-clamp-2 text-[1.35rem] font-semibold leading-tight sm:text-[1.45rem] md:text-[1.55rem]">
            {item.title}
          </h2>
          <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-white/90 sm:text-[0.95rem]">
            {item.excerpt?.trim() || "Les saken i Backstage."}
          </p>
        </div>
      </Link>
    </article>
  );
}
