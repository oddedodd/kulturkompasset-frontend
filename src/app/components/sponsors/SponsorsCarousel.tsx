import Link from "next/link";
import type { HomePartner } from "@/app/lib/types";

type SponsorsCarouselProps = {
  sponsors: HomePartner[];
};

export function SponsorsCarousel({ sponsors }: SponsorsCarouselProps) {
  if (sponsors.length === 0) return null;

  return (
    <section className="w-full bg-[#ece9e3] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl overflow-hidden px-4">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
          Sponsorer
        </p>

        <div className="kk-sponsors-marquee">
          <div className="kk-sponsors-track">
            {[...sponsors, ...sponsors].map((sponsor, index) => (
              <div
                key={`${sponsor._id}-${index}`}
                className="inline-flex h-12 flex-none items-center justify-center"
              >
                {sponsor.website ? (
                  <Link
                    href={sponsor.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Besok sponsor: ${sponsor.name}`}
                    className="inline-flex h-12 items-center justify-center"
                  >
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className="max-h-12 w-auto object-contain"
                    />
                  </Link>
                ) : (
                  <img
                    src={sponsor.logoUrl}
                    alt={sponsor.name}
                    className="max-h-12 w-auto object-contain"
                  />
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
