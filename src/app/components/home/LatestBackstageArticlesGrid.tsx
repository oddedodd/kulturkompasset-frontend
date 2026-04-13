"use client";

import Link from "next/link";
import { useRef } from "react";
import type { CSSProperties } from "react";
import type { Swiper as SwiperType } from "swiper";
import { A11y, Pagination } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import "swiper/css";
import "swiper/css/pagination";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import type { BackstageArticleCard } from "../../lib/types";

type LatestBackstageArticlesGridProps = {
  articles: BackstageArticleCard[];
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function LatestBackstageArticlesGrid({
  articles,
}: LatestBackstageArticlesGridProps) {
  const swiperRef = useRef<SwiperType | null>(null);

  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-12 w-full max-w-6xl px-4 pb-16">
      <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="whitespace-nowrap text-3xl font-semibold leading-tight tracking-tight sm:text-2xl">
          Siste historier
        </h2>
        <Link
          href="/backstage"
          className="inline-flex w-fit items-center gap-2 text-base font-medium text-black underline-offset-4 hover:underline sm:text-sm"
        >
          Alle historier <span aria-hidden>→</span>
        </Link>
      </div>

      <div className="relative">
        <button
          type="button"
          onClick={() => swiperRef.current?.slidePrev()}
          className="absolute left-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/22 text-black backdrop-blur-sm md:flex"
          aria-label="Forrige historie"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>

        <button
          type="button"
          onClick={() => swiperRef.current?.slideNext()}
          className="absolute right-2 top-1/2 z-10 hidden h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-black/22 text-black backdrop-blur-sm md:flex"
          aria-label="Neste historie"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        <Swiper
          modules={[A11y, Pagination]}
          onSwiper={(swiper) => {
            swiperRef.current = swiper;
          }}
          spaceBetween={14}
          slidesPerView={1.15}
          grabCursor
          pagination={{ clickable: true }}
          style={
            {
              "--swiper-pagination-color": "#000000",
            } as CSSProperties
          }
          className="overflow-visible pb-14 [&_.swiper-pagination]:!relative [&_.swiper-pagination]:!left-0 [&_.swiper-pagination]:!right-0 [&_.swiper-pagination]:!top-auto [&_.swiper-pagination]:!bottom-auto [&_.swiper-pagination]:!mt-6 [&_.swiper-pagination-bullet]:bg-black/30 [&_.swiper-pagination-bullet-active]:bg-black"
          breakpoints={{
            560: {
              slidesPerView: 1.35,
              spaceBetween: 16,
            },
            900: {
              slidesPerView: 2.2,
              spaceBetween: 18,
            },
            1200: {
              slidesPerView: 3,
              spaceBetween: 20,
            },
          }}
        >
          {articles.map((article) => {
            const heroImageUrl =
              getSanityImageUrl(article.heroImage, {
                width: 900,
                height: 1200,
              }) || article.heroImageUrl;

            return (
              <SwiperSlide key={article._id} className="h-auto">
                <article className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-[3/4]">
                  {heroImageUrl ? (
                    <div
                      className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                      style={{ backgroundImage: `url(${heroImageUrl})` }}
                      aria-hidden
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-300" aria-hidden />
                  )}

                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

                  <Link
                    href={`/backstage/${article.slug}`}
                    aria-label={`Åpne artikkel: ${article.title}`}
                    className="absolute inset-0 z-10"
                  />

                  <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end p-5 text-white sm:p-6">
                    <h3 className="line-clamp-2 text-2xl font-semibold leading-tight">
                      {article.title}
                    </h3>
                    <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/90">
                      {article.excerpt?.trim() || "Les saken i Backstage."}
                    </p>
                    {article.publishedAt ? (
                      <p className="mt-3 text-xs font-medium uppercase tracking-wide text-white/80">
                        {dateFormatter.format(new Date(article.publishedAt))}
                      </p>
                    ) : null}
                  </div>
                </article>
              </SwiperSlide>
            );
          })}
        </Swiper>
      </div>
    </section>
  );
}
