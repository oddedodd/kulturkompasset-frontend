import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import {
  allVenuesQuery,
  upcomingEventsByVenueSlugQuery,
  venueBySlugQuery,
} from "./queries";
import { sanityClient } from "./sanity.client";
import type { CalendarEvent, VenueDetail, VenueListItem } from "./types";

const getVenueBySlugCached = unstable_cache(
  async (slug: string): Promise<VenueDetail | null> => {
    try {
      const venue = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<VenueDetail | null>(venueBySlugQuery, { slug });

      if (!venue || typeof venue._id !== "string" || typeof venue.name !== "string") {
        return null;
      }

      return venue;
    } catch {
      return null;
    }
  },
  ["venue-by-slug"],
  { tags: [CACHE_TAGS.venues], revalidate: 86_400 },
);

export async function getVenues(): Promise<VenueListItem[]> {
  return unstable_cache(
    async (): Promise<VenueListItem[]> => {
      try {
        const venues = await sanityClient
          .withConfig({ useCdn: false, perspective: "published" })
          .fetch<VenueListItem[]>(allVenuesQuery);

        return sanitizeVenues(venues);
      } catch {
        return [];
      }
    },
    ["venues-list"],
    { tags: [CACHE_TAGS.venues], revalidate: 86_400 },
  )();
}

export async function getVenueBySlug(slug: string): Promise<VenueDetail | null> {
  return getVenueBySlugCached(slug);
}

export async function getUpcomingEventsForVenueSlug(venueSlug: string): Promise<CalendarEvent[]> {
  return unstable_cache(
    async (): Promise<CalendarEvent[]> => {
      try {
        const events = await sanityClient
          .withConfig({ useCdn: false, perspective: "published" })
          .fetch<CalendarEvent[]>(upcomingEventsByVenueSlugQuery, { venueSlug });

        return sanitizeEvents(events);
      } catch {
        return [];
      }
    },
    ["upcoming-events-by-venue-slug", venueSlug],
    { tags: [CACHE_TAGS.events, CACHE_TAGS.venues], revalidate: 86_400 },
  )();
}

function sanitizeVenues(venues: VenueListItem[] = []): VenueListItem[] {
  return venues.filter(
    (venue): venue is VenueListItem =>
      Boolean(venue && typeof venue._id === "string" && typeof venue.name === "string"),
  );
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
