"use client";

import Link from "next/link";
import Image from "next/image";
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
    <section className="w-full bg-[#fbfaf8] px-2 py-3 text-[#312821] sm:px-4">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-5 flex justify-start pt-2">
          <Image
            src="/logo01.svg"
            alt="KulturKompasset"
            width={1106}
            height={145}
            className="h-7 w-auto sm:h-8"
            priority
          />
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-1 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#cfcac3]/90 text-black shadow-sm backdrop-blur-sm transition hover:bg-[#bdb7af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:left-2"
            aria-label="Forrige"
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </button>

          <button
            type="button"
            onClick={toggleAutoplay}
            className="absolute right-1 top-[calc(50%-5.75rem)] z-20 inline-flex h-11 w-11 cursor-pointer items-center justify-center rounded-full bg-[#cfcac3]/90 text-black shadow-sm backdrop-blur-sm transition hover:bg-[#bdb7af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:right-2"
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
            className="absolute right-1 top-1/2 z-20 inline-flex h-11 w-11 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-[#cfcac3]/90 text-black shadow-sm backdrop-blur-sm transition hover:bg-[#bdb7af] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black focus-visible:ring-offset-2 sm:right-2"
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
        className="relative flex h-full min-h-[37rem] flex-col overflow-hidden rounded-[1.35rem] bg-[#e9e5e0] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:min-h-[34rem]"
      >
        <span className="absolute right-4 top-4 z-10 rounded-full bg-[#312821] px-3 py-1 text-xs font-medium text-white shadow-sm">
          Arrangement
        </span>

        {heroImageUrl ? (
          <div
            className="h-80 w-full shrink-0 bg-cover bg-center sm:h-56"
            style={{ backgroundImage: `url(${heroImageUrl})` }}
            aria-hidden="true"
          />
        ) : (
          <div className="h-80 w-full shrink-0 bg-[#d8d0c5] sm:h-56" aria-hidden />
        )}

        <div className="flex flex-1 flex-col p-6 text-[#312821]">
          <h2 className="line-clamp-3 text-[2rem] font-semibold leading-tight tracking-tight">
            {item.title}
          </h2>

          <div className="mt-5 space-y-3 text-base leading-snug text-black/65">
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
        className="group relative block h-full min-h-[37rem] overflow-hidden rounded-[1.35rem] bg-[#28221d] transition hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black sm:min-h-[34rem]"
      >
        <span className="absolute right-4 top-4 z-20 rounded-full bg-white/88 px-3 py-1 text-xs font-medium text-[#312821] shadow-sm backdrop-blur-sm">
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

        <div className="absolute bottom-0 left-0 right-0 z-10 p-6 text-white">
          <h2 className="line-clamp-2 text-[1.7rem] font-semibold leading-tight">
            {item.title}
          </h2>
          <p className="mt-3 line-clamp-3 text-base leading-relaxed text-white/90">
            {item.excerpt?.trim() || "Les saken i Backstage."}
          </p>
        </div>
      </Link>
    </article>
  );
}
