# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev      # Start dev server with Turbopack
npm run build    # Production build with Turbopack
npm run start    # Run production server
npm run lint     # Run ESLint
```

No test suite is configured.

## Architecture Overview

KulturKompasset is a Next.js App Router application serving as a cultural events hub for Namdalen, Norway. Content is managed in **Sanity CMS** and fetched via GROQ queries.

### Key directories

- `src/app/(site)/` — All page routes (grouped layout)
- `src/app/api/` — API routes for paginated data (`/events`, `/backstage`, `/bulletin`, `/revalidate`)
- `src/app/lib/` — Sanity client, GROQ queries, cache helpers, image utilities
- `src/app/components/` — Feature-organized components (`home/`, `events/`, `article/`, `shared/`)

### Data fetching

All Sanity queries live in `src/app/lib/queries.ts`. Server Components fetch using `unstable_cache` wrappers with 24-hour revalidation. Cache tags are centralized in `CACHE_TAGS` (events, articles, venues, partners, siteSettings, bulletins, news).

On-demand revalidation is triggered by a Sanity webhook POSTing to `/api/revalidate`. The webhook handler maps content types to paths and tags to revalidate (e.g., event changes revalidate `/kalender` and `/`).

### Pagination and client-side data

Interactive grids (`CalendarEventsGrid`, `BackstageArticlesGrid`) use Intersection Observer to trigger "load more" fetches against the API routes. API routes accept `offset`, `limit` (max 24), `q` (search), `venue`, and `date` query params.

### Page Builder system

Articles support flexible layouts via `PageBuilderRenderer.tsx`. Supported block types include: `heroBlock`, `leadBlock`, `textBlock`, `imageBlock`, `imageGalleryBlock`, `imageTextLeftBlock`, `imageTextRightBlock`, `videoBlock`, `embedBlock`, `blockquoteBlock`, `dividerBlock`, `cta`. New block types require additions to both the renderer switch statement and Sanity schema.

### Component conventions

- Server Components by default; add `"use client"` only for interactivity (search, filters, carousels, Intersection Observer)
- `getSanityImageUrl()` from `src/app/lib/imageUrl.ts` for all Sanity image URLs
- Sanity Portable Text rendered via `@portabletext/react` with custom component overrides

### Styling

Tailwind CSS v4 (PostCSS plugin). No CSS Modules — all styles are inline Tailwind classes. Custom animations (sponsor marquee) are in `src/app/globals.css`. Path alias: `@/*` → `./src/*`.

### Environment variables

```
NEXT_PUBLIC_SANITY_PROJECT_ID
NEXT_PUBLIC_SANITY_DATASET
NEXT_PUBLIC_SANITY_API_VERSION
SANITY_API_READ_TOKEN
SANITY_API_WRITE_TOKEN
REVALIDATE_SECRET        # Validates incoming Sanity webhooks
```
