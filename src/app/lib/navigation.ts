import { unstable_cache } from "next/cache";
import { defaultNavItems } from "../components/menu/navItems";
import { CACHE_TAGS } from "./cache-tags";
import type { NavItem } from "./types";
import { mainNavigationQuery } from "./queries";
import { sanityClient } from "./sanity.client";

type SanityMenuItem = {
  label: string;
  section?: string;
};

type SiteSettings = {
  mainNavigation?: SanityMenuItem[];
};

const sectionToPath: Record<string, string> = {
  kalender: "/kalender",
  backstage: "/backstage",
  aktuelt: "/aktuelt",
  "barn-og-familie": "/barn-og-familie",
  spillelister: "/spillelister",
  "om-kulturkompasset": "/om",
};

/**
 * Kanonisk navn per seksjon, brukt når menyen ikke har et punkt for den.
 * Speiler NAVIGATION_SECTIONS i studioet, som er lista redaktøren velger fra.
 */
const sectionTitles: Record<string, string> = {
  kalender: "Kalender",
  backstage: "Backstage",
  aktuelt: "Aktuelt",
  venues: "Venues",
  "barn-og-familie": "Barn og familie",
  spillelister: "Spillelister",
  bulletin: "Oppslagstavla",
  "om-kulturkompasset": "Om Kulturkompasset",
};

/**
 * Stien en seksjon peker på. Menyen og `linkBlock` i sidebyggeren bruker den
 * samme oppslagstabellen, så de to kan ikke komme i utakt.
 *
 * Studioets seksjonsliste og `sectionToPath` er ikke identiske — studioet
 * tilbyr blant annet `venues` og `bulletin`, som ikke står her. De faller
 * tilbake til `/<seksjon>`, som treffer riktig rute for begge.
 */
export function sectionHref(section: string): string {
  return sectionToPath[section] ?? `/${section}`;
}

/** Teksten en seksjon vises med: menyens egen tekst, ellers kanonisk navn. */
export async function getSectionLabel(section: string): Promise<string | undefined> {
  const settings = await getMainNavigationSettingsCached();
  const match = settings?.mainNavigation?.find((item) => item?.section === section);
  return match?.label || sectionTitles[section];
}

const homeNavItem: NavItem = {
  label: "Hjem",
  href: "/",
};

const getMainNavigationSettingsCached = unstable_cache(
  async (): Promise<SiteSettings | null> => {
    try {
      return await sanityClient.fetch<SiteSettings | null>(mainNavigationQuery);
    } catch {
      return null;
    }
  },
  ["site-settings-main-navigation"],
  { tags: [CACHE_TAGS.siteSettings], revalidate: 86_400 },
);

function mapToNavItem(item: SanityMenuItem): NavItem | null {
  if (!item.label || !item.section) return null;

  return {
    label: item.label,
    href: sectionHref(item.section),
    featured: item.section === "backstage",
  };
}

export async function getMainNavigation(): Promise<NavItem[]> {
  try {
    const settings = await getMainNavigationSettingsCached();
    const menuItems =
      settings?.mainNavigation
        ?.map(mapToNavItem)
        .filter((item): item is NavItem => item !== null) ?? [];

    const baseItems = menuItems.length > 0 ? menuItems : defaultNavItems;
    return baseItems.some((item) => item.href === "/")
      ? baseItems
      : [homeNavItem, ...baseItems];
  } catch {
    return defaultNavItems.some((item) => item.href === "/")
      ? defaultNavItems
      : [homeNavItem, ...defaultNavItems];
  }
}
