import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import { homePartnerRefsQuery, partnersByIdsQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { HomePartner } from "./types";

type HomePartnerRefsResult = {
  partnerRefs?: string[];
} | null;

const getHomePartnersCached = unstable_cache(
  async (): Promise<HomePartner[]> => {
    try {
      const settings = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<HomePartnerRefsResult>(homePartnerRefsQuery);

      const refs = (settings?.partnerRefs ?? []).filter(
        (ref): ref is string => typeof ref === "string" && ref.trim().length > 0,
      );

      const normalizedRefs = refs.map(normalizeDocumentId);
      const ids = [...new Set(normalizedRefs)];

      if (ids.length === 0) {
        return [];
      }

      const partnerDocs = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<HomePartner[]>(partnersByIdsQuery, { ids });

      const byBaseId = new Map<string, HomePartner>();
      for (const partner of partnerDocs ?? []) {
        if (partner && typeof partner._id === "string" && typeof partner.name === "string") {
          byBaseId.set(normalizeDocumentId(partner._id), partner);
        }
      }

      const orderedPartners: HomePartner[] = [];
      for (const ref of normalizedRefs) {
        const partner = byBaseId.get(ref);
        if (partner) {
          orderedPartners.push(partner);
        }
      }

      return orderedPartners;
    } catch {
      return [];
    }
  },
  ["site-settings-home-partners"],
  {
    tags: [CACHE_TAGS.siteSettings, CACHE_TAGS.partners, CACHE_TAGS.events],
    revalidate: 86_400,
  },
);

export async function getMainHomePartner(): Promise<HomePartner | null> {
  const partners = await getHomePartnersCached();

  if (partners.length === 0) return null;

  return (
    partners.find((partner) => partner.active !== false && partner.tier === "main") ||
    partners.find((partner) => partner.active !== false) ||
    partners[0]
  );
}

export async function getHomePartners(): Promise<HomePartner[]> {
  const partners = await getHomePartnersCached();

  if (partners.length === 0) return [];

  const activePartners = partners.filter((partner) => partner.active !== false);
  return activePartners.length > 0 ? activePartners : partners;
}

function normalizeDocumentId(id: string): string {
  return id.startsWith("drafts.") ? id.slice("drafts.".length) : id;
}
