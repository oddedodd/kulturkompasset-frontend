import {
  allVenuesQuery,
  upcomingEventsByVenueSlugQuery,
  venueBySlugQuery,
} from "./queries";
import { sanityClient } from "./sanity.client";
import type { CalendarEvent, VenueDetail, VenueListItem } from "./types";

export async function getVenues(): Promise<VenueListItem[]> {
  try {
    const venues = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<VenueListItem[]>(allVenuesQuery);

    return sanitizeVenues(venues);
  } catch {
    return [];
  }
}

export async function getVenueBySlug(slug: string): Promise<VenueDetail | null> {
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
}

export async function getUpcomingEventsForVenueSlug(venueSlug: string): Promise<CalendarEvent[]> {
  try {
    const events = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<CalendarEvent[]>(upcomingEventsByVenueSlugQuery, { venueSlug });

    return sanitizeEvents(events);
  } catch {
    return [];
  }
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
