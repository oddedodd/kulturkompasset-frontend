import Link from "next/link";
import type { HomePartner } from "@/app/lib/types";

type MainPartnerHighlightProps = {
  partners: HomePartner[];
};

export function MainPartnerHighlight({ partners }: MainPartnerHighlightProps) {
  if (partners.length === 0) return null;

  return (
    <section className="mt-8 w-full bg-[#f7f4ee] py-14 sm:py-16">
      <div className="mx-auto w-full max-w-6xl px-4 text-center">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/65">
          Kulturkompasset presenteres av samarbeidspartner
        </p>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-12 gap-y-8">
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
                    className="max-h-20 w-auto object-contain sm:max-h-24"
                  />
                </Link>
              ) : (
                <img
                  key={partner._id}
                  src={logoUrl}
                  alt={partner.name}
                  className="max-h-20 w-auto object-contain sm:max-h-24"
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
