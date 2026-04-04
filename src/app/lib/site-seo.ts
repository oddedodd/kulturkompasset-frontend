import { cache } from "react";
import { siteSettingsSeoQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { SanityImageSource, SeoFields } from "./types";

type SiteSeoPage = "home" | "events" | "bulletin" | "backstage" | "venues";

type UnknownRecord = Record<string, unknown>;

const seoKeyCandidates: Record<SiteSeoPage, string[]> = {
  home: [
    "homeSeo",
    "seoHome",
    "homepageSeo",
    "homePageSeo",
    "frontpageSeo",
    "forsideSeo",
    "seoForside",
  ],
  events: [
    "eventsSeo",
    "seoEvents",
    "eventSeo",
    "calendarSeo",
    "seoCalendar",
    "kalenderSeo",
    "seoKalender",
  ],
  bulletin: [
    "bulletinSeo",
    "seoBulletin",
    "bulletinPageSeo",
    "oppslagstavlaSeo",
    "seoOppslagstavla",
  ],
  backstage: [
    "backstageSeo",
    "seoBackstage",
    "storiesSeo",
    "historierSeo",
    "seoHistorier",
  ],
  venues: [
    "venuesSeo",
    "seoVenues",
    "venueSeo",
    "seoVenue",
    "spillestederSeo",
    "seoSpillesteder",
  ],
};

function isRecord(value: unknown): value is UnknownRecord {
  return typeof value === "object" && value !== null;
}

function asSanityImageSource(value: unknown): SanityImageSource | undefined {
  return isRecord(value) ? (value as SanityImageSource) : undefined;
}

function parseSeoObject(value: unknown): SeoFields | undefined {
  if (!isRecord(value)) return undefined;

  const metaTitle = typeof value.metaTitle === "string" ? value.metaTitle.trim() : undefined;
  const metaDescription =
    typeof value.metaDescription === "string" ? value.metaDescription.trim() : undefined;
  const noIndex = typeof value.noIndex === "boolean" ? value.noIndex : undefined;
  const ogImage = asSanityImageSource(value.ogImage);
  const ogImageUrl = typeof value.ogImageUrl === "string" ? value.ogImageUrl : undefined;

  if (!metaTitle && !metaDescription && noIndex === undefined && !ogImage && !ogImageUrl) {
    return undefined;
  }

  return {
    metaTitle,
    metaDescription,
    noIndex,
    ogImage,
    ogImageUrl,
  };
}

export const getSitePageSeo = cache(async (page: SiteSeoPage): Promise<SeoFields | undefined> => {
  try {
    const settings = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<UnknownRecord | null>(siteSettingsSeoQuery);

    if (!settings || !isRecord(settings)) return undefined;

    const containers: UnknownRecord[] = [settings];

    if (isRecord(settings.seo)) {
      containers.push(settings.seo);
    }
    if (isRecord(settings.pageSeo)) {
      containers.push(settings.pageSeo);
    }

    for (const container of containers) {
      for (const key of seoKeyCandidates[page]) {
        const parsed = parseSeoObject(container[key]);
        if (parsed) return parsed;
      }
    }

    return undefined;
  } catch {
    return undefined;
  }
});
