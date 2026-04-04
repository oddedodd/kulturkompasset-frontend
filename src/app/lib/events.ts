import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import {
  eventBySlugQuery,
  upcomingEventVenuesQuery,
  upcomingEventsPaginatedQuery,
  upcomingEventsQuery,
} from "./queries";
import { sanityClient } from "./sanity.client";
import type { CalendarEvent, EventDetail } from "./types";

const getEventBySlugCached = unstable_cache(
  async (slug: string): Promise<EventDetail | null> => {
    try {
      const event = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<EventDetail | null>(eventBySlugQuery, { slug });

      if (!event || typeof event._id !== "string" || typeof event.title !== "string") {
        return null;
      }

      return event;
    } catch {
      return null;
    }
  },
  ["event-by-slug"],
  { tags: [CACHE_TAGS.events] },
);

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
  return getEventBySlugCached(slug);
}

export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  try {
    const events = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<CalendarEvent[]>(upcomingEventsQuery);

    return sanitizeEvents(events);
  } catch {
    return [];
  }
}

type GetUpcomingEventsPageInput = {
  offset?: number;
  limit?: number;
  venueName?: string;
  date?: string;
  search?: string;
};

export async function getUpcomingEventsPage({
  offset = 0,
  limit = 9,
  venueName = "",
  date = "",
  search = "",
}: GetUpcomingEventsPageInput = {}): Promise<CalendarEvent[]> {
  const safeOffset = Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(24, Math.floor(limit))) : 9;
  const safeVenueName = venueName.trim();
  const safeDateStart = toDateStartIso(date);
  const safeSearch = normalizeText(search);

  try {
    if (safeSearch) {
      const events = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<CalendarEvent[]>(upcomingEventsPaginatedQuery, {
          offset: 0,
          end: 500,
          venueName: safeVenueName,
          dateStart: safeDateStart,
          searchPattern: "",
        });

      const filtered = sanitizeEvents(events).filter((event) =>
        normalizeText(
          [
            event.title,
            event.venue?.name,
            event.venue?.city,
            ...(event.contributors ?? []),
            ...(event.categories ?? []),
          ]
            .filter(Boolean)
            .join(" "),
        ).includes(safeSearch),
      );

      return filtered.slice(safeOffset, safeOffset + safeLimit);
    }

    const events = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<CalendarEvent[]>(upcomingEventsPaginatedQuery, {
        offset: safeOffset,
        end: safeOffset + safeLimit,
        venueName: safeVenueName,
        dateStart: safeDateStart,
        searchPattern: "",
      });

    return sanitizeEvents(events);
  } catch {
    return [];
  }
}

export async function getUpcomingEventVenues(): Promise<string[]> {
  try {
    const venues = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<string[]>(upcomingEventVenuesQuery);

    return (Array.isArray(venues) ? venues : [])
      .filter((name): name is string => typeof name === "string" && name.trim().length > 0)
      .sort((a, b) => a.localeCompare(b, "nb"));
  } catch {
    return [];
  }
}

function sanitizeEvents(events: CalendarEvent[] = []): CalendarEvent[] {
  return events.filter(
    (event): event is CalendarEvent =>
      Boolean(
        event &&
          typeof event._id === "string" &&
          typeof event.title === "string" &&
          typeof event.startsAt === "string",
      ),
  );
}

function toDateStartIso(date: string): string {
  if (!date) return "";
  const start = new Date(`${date}T00:00:00`);
  return Number.isNaN(start.getTime()) ? "" : start.toISOString();
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
