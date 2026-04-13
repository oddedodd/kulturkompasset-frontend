import Link from "next/link";
import type { HomePartner } from "@/app/lib/types";

type MainPartnerHighlightProps = {
  partners: HomePartner[];
  compact?: boolean;
};

export function MainPartnerHighlight({ partners, compact = false }: MainPartnerHighlightProps) {
  if (partners.length === 0) return null;

  return (
    <section className={`w-full bg-[#ece9e3] ${compact ? "mt-0 py-8 sm:py-10" : "mt-8 py-14 sm:py-16"}`}>
      <div className={`mx-auto w-full px-4 text-center ${compact ? "max-w-5xl" : "max-w-6xl"}`}>
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
          Kulturkompasset presenteres av
        </p>

        <div className={`flex flex-wrap items-center justify-center ${compact ? "mt-5 gap-x-10 gap-y-6" : "mt-8 gap-x-12 gap-y-8"}`}>
          {partners.map((partner) => {
            const logoUrl = partner.logoUrl;

            if (logoUrl) {
              return partner.website ? (
                <Link
                  key={partner._id}
                  href={partner.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center justify-center"
                  aria-label={`Besøk ${partner.name}`}
                >
                  <img
                    src={logoUrl}
                    alt={partner.name}
                    className={compact ? "max-h-14 w-auto object-contain sm:max-h-16" : "max-h-20 w-auto object-contain sm:max-h-24"}
                  />
                </Link>
              ) : (
                <img
                  key={partner._id}
                  src={logoUrl}
                  alt={partner.name}
                  className={compact ? "max-h-14 w-auto object-contain sm:max-h-16" : "max-h-20 w-auto object-contain sm:max-h-24"}
                />
              );
            }

            return partner.website ? (
              <Link
                key={partner._id}
                href={partner.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-2xl font-semibold tracking-tight text-black"
              >
                {partner.name}
              </Link>
            ) : (
              <p key={partner._id} className="text-2xl font-semibold tracking-tight text-black">
                {partner.name}
              </p>
            );
          })}
        </div>
      </div>
    </section>
  );
}
