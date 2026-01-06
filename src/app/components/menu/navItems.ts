// Hardkodet navigasjonsmeny

export type NavItem = {
  label: string;
  href: string;
  featured?: boolean; // brukes for f.eks. "Backstage" med bullet/markering
};

export const navItems: NavItem[] = [
  { label: "Kalender", href: "/kalender" },
  { label: "Backstage", href: "/backstage", featured: true },
  { label: "Barn og familie", href: "/barn-og-familie" },
  { label: "Spillelister", href: "/spillelister" },
  { label: "Om Kulturkompasset", href: "/om" },
];
