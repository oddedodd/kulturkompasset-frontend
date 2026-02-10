import { eventBySlugQuery, upcomingEventsQuery } from "./queries";
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

    return events.filter(
      (event): event is CalendarEvent =>
        Boolean(
          event &&
            typeof event._id === "string" &&
            typeof event.title === "string" &&
            typeof event.startsAt === "string",
        ),
    );
  } catch {
    return [];
  }
}
