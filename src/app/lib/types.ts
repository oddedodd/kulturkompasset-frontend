import type { PortableTextBlock } from "@portabletext/types";

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

export type EventDetail = {
  _id: string;
  title: string;
  startsAt?: string;
  endsAt?: string;
  slug?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  contributors?: string[];
  location?: string;
  ticketUrl?: string;
  ingress?: string;
  description?: string;
  body?: PortableTextBlock[];
};

export type CalendarEvent = {
  _id: string;
  title: string;
  startsAt: string;
  slug?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  venue?: {
    name?: string;
    city?: string;
  };
  contributors?: string[];
  categories?: string[];
};

export type BackstageArticleCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
};

export type BackstageArticleDetail = {
  _id: string;
  title: string;
  slug: string;
  subtitle?: string;
  excerpt?: string;
  publishedAt?: string;
  heroImageUrl?: string;
  heroImageAlt?: string;
  body?: PortableTextBlock[];
};
