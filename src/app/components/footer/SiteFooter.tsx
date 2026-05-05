import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-0 bg-[#1f1d1b] px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-3">
          <section className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
              Kontakt
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>NA Kreativ</li>
              <li>post@kulturnamdal.no</li>
            </ul>
          </section>

          <section className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
              Utforsk
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>
                <Link href="/" className="hover:text-white">
                  Hjem
                </Link>
              </li>
              <li>
                <Link href="/kalender" className="hover:text-white">
                  Kalender
                </Link>
              </li>
              <li>
                <Link href="/backstage" className="hover:text-white">
                  Historier
                </Link>
              </li>
              <li>
                <Link href="/bulletin" className="hover:text-white">
                  Oppslagstavla
                </Link>
              </li>
              <li>
                <Link href="/personvern" className="hover:text-white">
                  Personvernerklæring
                </Link>
              </li>
            </ul>
          </section>

          <section className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
              Følg Oss
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>Instagram</li>
              <li>Facebook</li>
            </ul>
          </section>
        </div>

        <p className="mt-10 border-t border-white/15 pt-6 text-center text-sm leading-relaxed text-white/75">
          Kulturkompasset er utviklet og produsert av NA Kreativ,
          markedsavdelingen i Namdalsavisa. Innholdet er uavhengig av avisens
          redaksjonelle innhold.
        </p>

      </div>
    </footer>
  );
}
