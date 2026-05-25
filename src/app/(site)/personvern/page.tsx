import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Personvernerklæring",
  description: "Personvernerklæring for Kulturkompasset.",
};

export default function PersonvernPage() {
  return (
    <main className="min-h-screen bg-[#f8f7f4] px-6 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black"
        >
          <span aria-hidden>←</span> Tilbake til forsiden
        </Link>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
          Personvernerklæring for Kulturkompasset
        </h1>
        <p className="mt-3 text-black/70">Sist oppdatert: 25.05.2026</p>

        <section className="mt-10 space-y-10 text-black/85">
          <section>
            <h2 className="text-2xl font-semibold">1. Om Kulturkompasset</h2>
            <p className="mt-3 leading-relaxed">
              Kulturkompasset (
              <a
                href="https://kulturnamdal.no"
                target="_blank"
                rel="noreferrer"
                className="underline decoration-black/30 underline-offset-2 hover:decoration-black"
              >
                https://kulturnamdal.no
              </a>
              ) er en nettside som gir oversikt over konserter, forestillinger,
              festivaler og andre kulturaktiviteter i Namdalen.
            </p>
            <p className="mt-3 leading-relaxed">
              Nettsiden produseres og driftes av NA Kreativ, en del av
              Namdalsavisa. Kulturkompasset er et annonsørfinansiert prosjekt.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              2. Hvilke opplysninger vi samler inn
            </h2>
            <p className="mt-3 leading-relaxed">
              Vi samler i utgangspunktet ikke inn personopplysninger direkte fra
              deg som vanlig besøkende på nettsiden.
            </p>
            <p className="mt-3 leading-relaxed">
              Dersom du sender inn et arrangement til oppslagstavla, behandler vi
              informasjonen du oppgir i skjemaet, for eksempel navn på
              arrangement, dato, tidspunkt, arrangør, sted, kontaktperson,
              beskrivelse, pris og bilde.
            </p>
            <p className="mt-3 leading-relaxed">
              Dersom du sender inn et tips til Kulturkompasset, behandler vi
              informasjonen du oppgir i skjemaet, for eksempel navn på tips,
              dato, sted, pris, eventuell lenke til billettsalg, beskrivelse,
              bilde, navn på innsender, telefonnummer og e-postadresse.
            </p>
            <p className="mt-3 leading-relaxed">
              Det eneste verktøyet vi benytter for innsikt i bruk av nettsiden
              er:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Google Analytics</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Gjennom dette kan vi samle inn:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>IP-adresse (anonymisert)</li>
              <li>Informasjon om enhet (mobil, desktop, nettbrett)</li>
              <li>Nettleser og operativsystem</li>
              <li>Hvilke sider som besøkes</li>
              <li>Tid brukt på siden</li>
              <li>Generell geografisk plassering (land/region)</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              Disse opplysningene brukes kun til statistikk og forbedring av
              nettsiden.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              3. Informasjonskapsler (cookies)
            </h2>
            <p className="mt-3 leading-relaxed">
              Kulturkompasset bruker informasjonskapsler via Google Analytics
              for å analysere trafikk og bruksmønster.
            </p>
            <p className="mt-3 leading-relaxed">
              Vi bruker også en nødvendig informasjonskapsel,
              <code className="rounded bg-black/5 px-1 py-0.5 text-sm">
                kk_contribution_prompt_seen
              </code>
              , for å huske at du har lukket eller klikket på påminnelsen om å
              sende inn tips eller arrangement. Den lagres i 7 dager og brukes
              kun til å unngå at påminnelsen vises for ofte.
            </p>
            <p className="mt-3 leading-relaxed">Dette kan inkludere:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Cookies som skiller mellom brukere</li>
              <li>Cookies som måler trafikk og brukeratferd</li>
              <li>
                Cookies som husker en enkel visningspreferanse på nettsiden
              </li>
            </ul>
            <p className="mt-3 leading-relaxed">Du kan selv:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Blokkere eller slette cookies i nettleseren din</li>
              <li>
                Trekke tilbake samtykke via cookie-banner for cookies som krever
                samtykke
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              4. Formål med behandlingen
            </h2>
            <p className="mt-3 leading-relaxed">Vi bruker dataene til å:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Forstå hvordan nettsiden brukes</li>
              <li>Forbedre innhold og funksjonalitet</li>
              <li>
                Se hvilke arrangementer og sider som er mest relevante for
                brukerne
              </li>
              <li>Behandle innsendte arrangementer og tips</li>
              <li>Kontakte innsender ved behov for oppfølging</li>
            </ul>
            <p className="mt-3 leading-relaxed">Vi bruker ikke data til:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Profilering av enkeltpersoner</li>
              <li>Salg av personopplysninger</li>
              <li>Direkte markedsføring mot deg som individ</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">
              5. Deling av opplysninger
            </h2>
            <p className="mt-3 leading-relaxed">
              Data som samles inn via Google Analytics behandles av Google.
            </p>
            <p className="mt-3 leading-relaxed">
              Google kan lagre data på servere utenfor EU/EØS. Vi baserer oss på
              standard mekanismer for overføring av data i tråd med gjeldende
              regelverk.
            </p>
            <p className="mt-3 leading-relaxed">
              Vi deler ellers ikke personopplysninger med tredjeparter.
            </p>
            <p className="mt-3 leading-relaxed">
              Innsendte tips og arrangementer lagres i vårt publiseringssystem
              Sanity. Opplysninger fra skjemaene brukes til å vurdere,
              administrere og eventuelt publisere innsendt innhold.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">6. Lagring av data</h2>
            <p className="mt-3 leading-relaxed">
              Data lagres så lenge det er nødvendig for analyseformål.
            </p>
            <p className="mt-3 leading-relaxed">
              Innsendte tips og arrangementer lagres så lenge det er nødvendig
              for å behandle, følge opp og dokumentere innsendingen, eller til
              du ber om sletting der vi ikke har et saklig behov for videre
              lagring.
            </p>
            <p className="mt-3 leading-relaxed">
              Du kan selv begrense dette gjennom:
            </p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Nettleserinnstillinger</li>
              <li>Eventuell cookie-samtykkeløsning</li>
            </ul>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">7. Dine rettigheter</h2>
            <p className="mt-3 leading-relaxed">Du har rett til:</p>
            <ul className="mt-3 list-disc space-y-1 pl-6">
              <li>Innsyn i hvilke opplysninger som behandles</li>
              <li>Å be om retting eller sletting</li>
              <li>Å protestere mot behandling</li>
            </ul>
            <p className="mt-3 leading-relaxed">
              For opplysninger du selv har sendt inn via skjema, kan du kontakte
              oss dersom du ønsker innsyn, retting eller sletting.
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">8. Kontaktinformasjon</h2>
            <p className="mt-3 leading-relaxed">
              Hvis du har spørsmål om personvern:
            </p>
            <p className="mt-3 leading-relaxed">
              NA Kreativ / Namdalsavisa
              <br />
              [annonse@namdalsavisa.no]
            </p>
          </section>

          <section>
            <h2 className="text-2xl font-semibold">9. Endringer</h2>
            <p className="mt-3 leading-relaxed">
              Vi kan oppdatere denne erklæringen ved behov. Endringer publiseres
              på denne siden.
            </p>
          </section>
        </section>
      </article>
    </main>
  );
}
