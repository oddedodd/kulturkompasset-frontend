export function SiteFooter() {
  const currentYear = new Date().getFullYear();

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
              <li>Kalender</li>
              <li>Historier</li>
              <li>Oppslagstavla</li>
            </ul>
          </section>

          <section className="text-center">
            <h2 className="text-sm font-semibold uppercase tracking-[0.12em] text-white/70">
              Følg Oss
            </h2>
            <ul className="mt-4 space-y-2 text-sm text-white/85">
              <li>Instagram</li>
              <li>Facebook</li>
              <li>YouTube</li>
            </ul>
          </section>
        </div>

        <p className="mt-10 border-t border-white/15 pt-6 text-center text-sm leading-relaxed text-white/75">
          Kulturkompasset driftes av NA Kreativ, markedsavdelingen i Namdalsavisa. Innholdet er
          uavhengig av avisens redaksjonelle virksomhet.
        </p>

        <div className="mt-4 text-center text-sm text-white/75">
          &copy; NA Kreativ {currentYear}
        </div>
      </div>
    </footer>
  );
}
