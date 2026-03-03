# Kulturkompasset Frontend

Frontend for Kulturkompasset, bygget med Next.js og koblet mot Sanity som innholdsplattform.

Løsningen henter innhold for navigasjon, arrangementer og artikler fra Sanity, og presenterer dette i et redaksjonelt nettsted med fokus på:

- forside med velkomstseksjon og kuraterte karuseller
- kalender med filtrering, søk og innlasting av flere arrangementer
- Backstage-seksjon med artikkellister og artikkelsider
- dynamisk rendering av fleksibelt innhold fra Sanity Page Builder

## Teknologi

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- Sanity / next-sanity
- Swiper.js

## Innhold som hentes fra Sanity

Applikasjonen bruker Sanity som kilde for blant annet:

- hovednavigasjon
- utvalgte arrangement på forsiden
- kommende arrangement i kalender og forsidekaruseller
- Backstage-artikler
- artikkelinnhold bygget med `pageBuilder`

## Viktige funksjoner

### Forside

- logo-basert header og meny
- velkomstseksjon med profilert merkevareuttrykk
- karusell for fremhevede arrangement
- karusell for kommende arrangement
- seksjon for siste fra Backstage

### Kalender

- viser kommende arrangement kronologisk
- søk i kommende arrangement
- filtrering på sted
- filtrering på dato
- "last inn flere"-flyt og progressiv innlasting

### Artikler

- Backstage-liste med søk og progressiv innlasting
- artikkeldetaljer med støtte for Sanity `pageBuilder`
- støtte for blant annet:
  - hero-blokk
  - ingressblokk
  - tekstblokker (Portable Text)
  - enkeltbilder
  - bildegalleri med lightbox
  - bilde + tekst-oppsett
  - video (YouTube/Vimeo)
  - embed-blokker
  - sitatblokker
  - CTA-er

## Lokal utvikling

Start utviklingsserver:

```bash
npm run dev
```

Åpne deretter `http://localhost:3000`.

## Miljøvariabler

Prosjektet forventer Sanity-konfigurasjon via miljøvariabler, typisk i `.env.local`:

```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=...
NEXT_PUBLIC_SANITY_DATASET=...
SANITY_API_VERSION=...
SANITY_API_READ_TOKEN=...
```

`SANITY_API_READ_TOKEN` er nødvendig dersom datasettet eller enkelte dokumenttyper ikke er anonymt lesbare.

## Struktur

Noen sentrale mapper:

- `src/app/` – sider, layout og API-ruter
- `src/app/components/` – UI-komponenter
- `src/app/lib/` – datainnhenting, queries og typer
- `public/` – statiske filer som logoer, symboler og ikoner

## Status

README-en beskriver nåværende hovedstruktur og funksjonalitet slik frontend-koden er satt opp per i dag. Ved større endringer i innholdsmodell eller navigasjonsflyt bør denne oppdateres tilsvarende.
