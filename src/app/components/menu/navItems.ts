// Standard/fallback navigasjonsmeny

import type { NavItem } from "../../lib/types";

export const defaultNavItems: NavItem[] = [
  { label: "Kalender", href: "/kalender" },
  { label: "Backstage", href: "/backstage", featured: true },
  { label: "Barn og familie", href: "/barn-og-familie" },
  { label: "Spillelister", href: "/spillelister" },
  { label: "Om Kulturkompasset", href: "/om" },
];
