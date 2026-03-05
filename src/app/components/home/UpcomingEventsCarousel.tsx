"use client";

import Link from "next/link";
import { useRef } from "react";
import type { CSSProperties } from "react";
import type { Swiper as SwiperType } from "swiper";
import { CalendarDays, ChevronLeft, ChevronRight, MapPin } from "lucide-react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/pagination";
import type { CalendarEvent } from "../../lib/types";

type UpcomingEventsCarouselProps = {
  events: CalendarEvent[];
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  weekday: "long",
  day: "numeric",
  month: "long",
});

export function UpcomingEventsCarousel({
  events,
}: UpcomingEventsCarouselProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (events.length === 0) {
    return null;
  }

  return (
    <section className="w-full bg-[#f7f4ee] py-16">
      <div className="mx-auto w-full max-w-6xl px-4">
        <div className="mb-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="whitespace-nowrap text-3xl font-semibold leading-tight tracking-tight sm:text-2xl">
            Kommende arrangementer
          </h2>
          <Link
            href="/kalender"
            className="inline-flex w-fit items-center gap-2 text-base font-medium text-black underline-offset-4 hover:underline sm:text-sm"
          >
            Alle arrangementer <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="relative">
          <button
            type="button"
            onClick={() => swiperRef.current?.slidePrev()}
            className="absolute left-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/22 text-black backdrop-blur-sm"
            aria-label="Forrige arrangement"
          >
            <ChevronLeft
              className="h-5 w-5"
              aria-hidden="true"
              strokeWidth={2.25}
            />
          </button>

          <button
            type="button"
            onClick={() => swiperRef.current?.slideNext()}
            className="absolute right-2 top-1/2 z-10 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/22 text-black backdrop-blur-sm"
            aria-label="Neste arrangement"
          >
            <ChevronRight
              className="h-5 w-5"
              aria-hidden="true"
              strokeWidth={2.25}
            />
          </button>

          <Swiper
            modules={[A11y, Autoplay, Pagination]}
            onSwiper={(swiper) => {
              swiperRef.current = swiper;
            }}
            spaceBetween={20}
            slidesPerView={1.1}
            grabCursor
            pagination={{ clickable: true }}
            autoplay={{
              delay: 3500,
              disableOnInteraction: false,
              pauseOnMouseEnter: true,
            }}
            style={
              {
                "--swiper-pagination-color": "#000000",
              } as CSSProperties
            }
            className="pb-14 [&_.swiper-pagination]:!relative [&_.swiper-pagination]:!left-0 [&_.swiper-pagination]:!right-0 [&_.swiper-pagination]:!top-auto [&_.swiper-pagination]:!bottom-auto [&_.swiper-pagination]:!mt-6 [&_.swiper-pagination-bullet]:bg-black/30 [&_.swiper-pagination-bullet-active]:bg-black"
            breakpoints={{
              640: {
                slidesPerView: 1.35,
              },
              768: {
                slidesPerView: 2.1,
              },
              1024: {
                slidesPerView: 3,
              },
            }}
          >
            {events.map((event) => (
              <SwiperSlide key={event._id} className="h-auto">
                <Link
                  href={event.slug ? `/event/${event.slug}` : "/kalender"}
                  className="flex h-full min-h-[34rem] flex-col overflow-hidden rounded-[1.5rem] bg-[#E9E5E0]"
                >
                  {event.heroImageUrl ? (
                    <div
                      className="h-56 w-full shrink-0 bg-cover bg-center"
                      style={{ backgroundImage: `url(${event.heroImageUrl})` }}
                      aria-hidden
                    />
                  ) : (
                    <div
                      className="h-56 w-full shrink-0 bg-[#c5bbae]"
                      aria-hidden
                    />
                  )}

                  <div className="flex flex-1 flex-col space-y-4 p-6 text-[#312821]">
                    <h3 className="text-[2rem] font-semibold leading-tight tracking-tight">
                      {event.title}
                    </h3>

                    <div className="space-y-2 text-base text-black/65">
                      <div className="flex items-center gap-3">
                        <CalendarDays
                          className="h-4 w-4 shrink-0 opacity-55"
                          aria-hidden="true"
                        />
                        <span className="capitalize">
                          {dateFormatter.format(new Date(event.startsAt))}
                        </span>
                      </div>

                      <div className="flex items-center gap-3">
                        <MapPin
                          className="h-4 w-4 shrink-0 opacity-55"
                          aria-hidden="true"
                        />
                        <span>
                          {event.venue?.name
                            ? event.venue.city
                              ? `${event.venue.name}, ${event.venue.city}`
                              : event.venue.name
                            : "Sted kommer"}
                        </span>
                      </div>
                    </div>

                    <div className="mt-auto flex flex-wrap gap-2 pt-2 text-sm">
                      <span className="rounded-full bg-black/8 px-3 py-1 text-black/70">
                        {event.categories && event.categories.length > 0
                          ? event.categories[0]
                          : "Kategori kommer"}
                      </span>
                      {event.contributors && event.contributors.length > 0 ? (
                        <span className="rounded-full bg-black/8 px-3 py-1 text-black/70">
                          {event.contributors[0]}
                        </span>
                      ) : null}
                    </div>
                  </div>
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </section>
  );
}
