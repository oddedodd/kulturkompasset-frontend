import { featuredEventsQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { FeaturedEvent } from "./types";

type SiteSettingsFeaturedEventsResult = {
  featuredEvents?: Array<FeaturedEvent | null>;
} | null;

export async function getHomepageFeaturedEvents(): Promise<FeaturedEvent[]> {
  try {
    const data = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<SiteSettingsFeaturedEventsResult>(featuredEventsQuery);

    return (
      data?.featuredEvents?.filter(
        (event): event is FeaturedEvent =>
          Boolean(event && typeof event._id === "string" && typeof event.title === "string"),
      ) ?? []
    );
  } catch {
    return [];
  }
}
