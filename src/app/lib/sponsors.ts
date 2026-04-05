import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import { allSponsorsQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { HomePartner } from "./types";

const getSponsorsCached = unstable_cache(
  async (): Promise<HomePartner[]> => {
    try {
      const partners = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<HomePartner[]>(allSponsorsQuery);

      return (Array.isArray(partners) ? partners : []).filter(
        (partner): partner is HomePartner =>
          Boolean(
            partner &&
              typeof partner._id === "string" &&
              typeof partner.name === "string" &&
              typeof partner.logoUrl === "string" &&
              partner.logoUrl.trim().length > 0,
          ),
      );
    } catch {
      return [];
    }
  },
  ["all-sponsors"],
  { tags: [CACHE_TAGS.partners], revalidate: 86_400 },
);

export async function getAllSponsors(): Promise<HomePartner[]> {
  return getSponsorsCached();
}
