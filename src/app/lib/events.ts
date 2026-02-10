import {
  eventBySlugQuery,
  upcomingEventVenuesQuery,
  upcomingEventsPaginatedQuery,
  upcomingEventsQuery,
} from "./queries";
import { sanityClient } from "./sanity.client";
import type { CalendarEvent, EventDetail } from "./types";

export async function getEventBySlug(slug: string): Promise<EventDetail | null> {
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

  try {
    const events = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<CalendarEvent[]>(upcomingEventsPaginatedQuery, {
        offset: 0,
        end: 500,
        venueName: "",
        dateStart: "",
        dateEnd: "",
        searchPattern: "",
      });

    const sanitized = sanitizeEvents(events);
    const filtered = filterEvents(sanitized, {
      venueName,
      date,
      search,
    });

    return filtered.slice(safeOffset, safeOffset + safeLimit);
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

function filterEvents(
  events: CalendarEvent[],
  input: { venueName?: string; date?: string; search?: string },
): CalendarEvent[] {
  const venueFilter = input.venueName?.trim() ?? "";
  const searchFilter = normalizeText(input.search ?? "");
  const dateRange = toDayRange(input.date ?? "");

  const filtered = events.filter((event) => {
    if (venueFilter && (event.venue?.name ?? "") !== venueFilter) {
      return false;
    }

    if (searchFilter) {
      const haystack = normalizeText(
        [
          event.title,
          event.venue?.name,
          event.venue?.city,
          ...(event.contributors ?? []),
          ...(event.categories ?? []),
        ]
          .filter(Boolean)
          .join(" "),
      );

      if (!haystack.includes(searchFilter)) {
        return false;
      }
    }

    return true;
  });

  if (!dateRange) {
    return filtered;
  }

  const sameDay: CalendarEvent[] = [];
  const afterDay: CalendarEvent[] = [];

  for (const event of filtered) {
    const startsAt = new Date(event.startsAt);
    if (Number.isNaN(startsAt.getTime())) {
      continue;
    }
    if (startsAt >= dateRange.start && startsAt < dateRange.end) {
      sameDay.push(event);
      continue;
    }
    if (startsAt >= dateRange.end) {
      afterDay.push(event);
    }
  }

  return [...sameDay, ...afterDay];
}

function toDayRange(date: string): { start: Date; end: Date } | null {
  if (!date) return null;
  const start = new Date(`${date}T00:00:00`);
  if (Number.isNaN(start.getTime())) return null;
  const end = new Date(start);
  end.setDate(end.getDate() + 1);
  return { start, end };
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
