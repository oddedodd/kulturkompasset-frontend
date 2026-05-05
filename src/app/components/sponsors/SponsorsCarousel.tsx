import Link from "next/link";
import type { CSSProperties } from "react";
import type { HomePartner } from "@/app/lib/types";

type SponsorsCarouselProps = {
  sponsors: HomePartner[];
};

const LOGO_HEIGHT = 48;
const MIN_LOGO_WIDTH = 48;
const MAX_LOGO_WIDTH = 220;

function getLogoStyle(sponsor: HomePartner): CSSProperties | undefined {
  const aspectRatio = sponsor.logoDimensions?.aspectRatio;

  if (!aspectRatio || aspectRatio <= 0) {
    return undefined;
  }

  return {
    width: `${Math.round(
      Math.min(
        Math.max(LOGO_HEIGHT * aspectRatio, MIN_LOGO_WIDTH),
        MAX_LOGO_WIDTH,
      ),
    )}px`,
  };
}

export function SponsorsCarousel({ sponsors }: SponsorsCarouselProps) {
  if (sponsors.length === 0) return null;

  return (
    <section className="w-full bg-[#ece9e3] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-7xl overflow-hidden px-4">
        <p className="mb-8 text-center text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
          Samarbeidspartnere
        </p>

        <div className="kk-sponsors-marquee">
          <div className="kk-sponsors-track">
            {[...sponsors, ...sponsors].map((sponsor, index) => {
              const logoStyle = getLogoStyle(sponsor);
              const logoClassName = logoStyle
                ? "h-full w-full object-contain"
                : "max-h-12 w-auto object-contain";

              return (
                <div
                  key={`${sponsor._id}-${index}`}
                  className="inline-flex h-12 flex-none items-center justify-center"
                  style={logoStyle}
                >
                  {sponsor.website ? (
                    <Link
                      href={sponsor.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={`Besok sponsor: ${sponsor.name}`}
                      className="inline-flex h-full w-full items-center justify-center"
                    >
                      <img
                        src={sponsor.logoUrl}
                        alt={sponsor.name}
                        className={logoClassName}
                      />
                    </Link>
                  ) : (
                    <img
                      src={sponsor.logoUrl}
                      alt={sponsor.name}
                      className={logoClassName}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
