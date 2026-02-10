"use client";

import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { A11y, Autoplay, Pagination } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import type { FeaturedEvent } from "../../lib/types";

type FeaturedEventsCarouselProps = {
  events: Array<FeaturedEvent | null | undefined>;
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function FeaturedEventsCarousel({ events }: FeaturedEventsCarouselProps) {
  const safeEvents = events.filter(
    (event): event is FeaturedEvent =>
      event !== null &&
      event !== undefined &&
      typeof event._id === "string" &&
      typeof event.title === "string",
  );

  const sectionHeader = (
    <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
      <h2 className="whitespace-nowrap text-3xl font-semibold leading-tight tracking-tight sm:text-2xl">
        Fremhevede arrangement
      </h2>
      <Link
        href="/kalender"
        className="inline-flex w-fit items-center gap-2 text-base font-medium text-black underline-offset-4 hover:underline sm:text-sm"
      >
        Alle arrangementer <span aria-hidden>→</span>
      </Link>
    </div>
  );

  if (safeEvents.length === 0) {
    return (
      <section className="mx-auto w-full max-w-6xl px-4 pt-8">
        {sectionHeader}
        <div className="rounded-2xl bg-gray-100 px-6 py-16 text-center text-black/70">
          Ingen utvalgte arrangement publisert ennå.
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto w-full max-w-6xl px-4 pt-8">
      {sectionHeader}
      <Swiper
        modules={[Pagination, A11y, Autoplay]}
        slidesPerView={1}
        pagination={{ clickable: true }}
        autoplay={{
          delay: 3000,
          disableOnInteraction: false,
          pauseOnMouseEnter: true,
        }}
        className="overflow-hidden rounded-2xl"
      >
        {safeEvents.map((event) => (
          <SwiperSlide key={event._id}>
            {event.slug ? (
              <Link
                href={`/event/${event.slug}`}
                className="group block rounded-2xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-black/60 focus-visible:ring-offset-2"
                aria-label={`Gå til arrangement: ${event.title}`}
              >
                <article className="relative h-[420px] w-full overflow-hidden rounded-2xl">
                  {event.heroImageUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300 group-hover:scale-105"
                      style={{ backgroundImage: `url(${event.heroImageUrl})` }}
                      aria-hidden
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300" aria-hidden />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />

                  <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                    <p className="text-sm font-medium uppercase tracking-wide text-white/85">
                      {event.startsAt
                        ? dateFormatter.format(new Date(event.startsAt))
                        : "Dato kommer"}
                    </p>
                    <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
                      {event.title}
                    </h2>
                    <p className="mt-3 text-base text-white/90">
                      {event.contributors && event.contributors.length > 0
                        ? event.contributors.join(", ")
                        : "Medvirkende kommer"}
                    </p>
                  </div>
                </article>
              </Link>
            ) : (
              <article className="relative h-[420px] w-full overflow-hidden rounded-2xl">
                {event.heroImageUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
                    style={{ backgroundImage: `url(${event.heroImageUrl})` }}
                    aria-hidden
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-300" aria-hidden />
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/35 to-black/20" />

                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                  <p className="text-sm font-medium uppercase tracking-wide text-white/85">
                    {event.startsAt
                      ? dateFormatter.format(new Date(event.startsAt))
                      : "Dato kommer"}
                  </p>
                  <h2 className="mt-2 text-3xl font-semibold leading-tight sm:text-4xl">
                    {event.title}
                  </h2>
                  <p className="mt-3 text-base text-white/90">
                    {event.contributors && event.contributors.length > 0
                      ? event.contributors.join(", ")
                      : "Medvirkende kommer"}
                  </p>
                </div>
              </article>
            )}
          </SwiperSlide>
        ))}
      </Swiper>
    </section>
  );
}
