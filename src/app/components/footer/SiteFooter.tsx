import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-0 bg-[#1f1d1b] px-6 py-12 text-white">
      <div className="mx-auto w-full max-w-6xl">
        <p className="pt-6 text-center text-sm leading-relaxed text-white/75">
          <strong>Kulturkompasset</strong> er utviklet og produsert av{" "}
          <strong>NA Kreativ</strong>, markedsavdelingen i Namdalsavisa.
          Innholdet er <u>uavhengig</u> av avisens redaksjonelle innhold.
        </p>
        <div className="mt-6 flex justify-center">
          <Link
            href="/personvern"
            className="text-sm font-medium text-white/65 underline underline-offset-4 transition hover:text-white"
          >
            Personvernerklæring
          </Link>
        </div>
      </div>
    </footer>
  );
}
