import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import { featuredEventsQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { FeaturedEvent } from "./types";

type SiteSettingsFeaturedEventsResult = {
  featuredEvents?: Array<FeaturedEvent | null>;
} | null;

const getFeaturedEventsSettingsCached = unstable_cache(
  async (): Promise<SiteSettingsFeaturedEventsResult> => {
    try {
      return await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<SiteSettingsFeaturedEventsResult>(featuredEventsQuery);
    } catch {
      return null;
    }
  },
  ["site-settings-featured-events"],
  { tags: [CACHE_TAGS.siteSettings, CACHE_TAGS.events] },
);

export async function getHomepageFeaturedEvents(): Promise<FeaturedEvent[]> {
  try {
    const data = await getFeaturedEventsSettingsCached();

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
