import { eventBySlugQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { EventDetail } from "./types";

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
