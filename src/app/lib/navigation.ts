import { defaultNavItems } from "../components/menu/navItems";
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
  "barn-og-familie": "/barn-og-familie",
  spillelister: "/spillelister",
  "om-kulturkompasset": "/om",
};

const homeNavItem: NavItem = {
  label: "Hjem",
  href: "/",
};

function mapToNavItem(item: SanityMenuItem): NavItem | null {
  if (!item.label || !item.section) return null;

  return {
    label: item.label,
    href: sectionToPath[item.section] ?? `/${item.section}`,
    featured: item.section === "backstage",
  };
}

export async function getMainNavigation(): Promise<NavItem[]> {
  try {
    const settings = await sanityClient.fetch<SiteSettings | null>(mainNavigationQuery);
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
