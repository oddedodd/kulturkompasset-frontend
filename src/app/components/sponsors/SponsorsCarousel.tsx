"use client";

import Link from "next/link";
import { A11y, Autoplay, FreeMode } from "swiper/modules";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/free-mode";
import type { HomePartner } from "@/app/lib/types";

type SponsorsCarouselProps = {
  sponsors: HomePartner[];
};

export function SponsorsCarousel({ sponsors }: SponsorsCarouselProps) {
  if (sponsors.length === 0) return null;
  const repeatedSponsors =
    sponsors.length < 6 ? [...sponsors, ...sponsors, ...sponsors, ...sponsors] : [...sponsors, ...sponsors];

  return (
    <section className="w-full bg-[#D7C9B3] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl px-4">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
          Sponsorer
        </p>

        <Swiper
          modules={[A11y, Autoplay, FreeMode]}
          slidesPerView="auto"
          spaceBetween={44}
          loop
          loopAdditionalSlides={repeatedSponsors.length}
          speed={2600}
          freeMode={{
            enabled: true,
            momentum: false,
          }}
          autoplay={{
            delay: 1,
            disableOnInteraction: false,
            pauseOnMouseEnter: false,
          }}
          allowTouchMove
          grabCursor
          className="[&_.swiper-wrapper]:ease-linear"
        >
          {repeatedSponsors.map((sponsor, index) => (
            <SwiperSlide key={`${sponsor._id}-${index}`} className="!w-auto">
              {sponsor.website ? (
                <Link
                  href={sponsor.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Besøk sponsor: ${sponsor.name}`}
                  className="inline-flex h-12 items-center justify-center"
                >
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="max-h-12 w-auto object-contain"
                  />
                </Link>
              ) : (
                <div className="inline-flex h-12 items-center justify-center">
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="max-h-12 w-auto object-contain"
                  />
                </div>
              )}
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </section>
  );
}
