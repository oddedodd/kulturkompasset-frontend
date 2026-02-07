export type NavItem = {
  label: string;
  href: string;
  featured?: boolean; // brukes for f.eks. "Backstage" med bullet/markering
};

export type FeaturedEvent = {
  _id: string;
  title: string;
  startsAt?: string;
  slug?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  contributors?: string[];
};
