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
  pageBuilder?: ArticlePageBuilderBlock[];
  body?: PortableTextBlock[];
};

type PageBuilderBlockBase = {
  _key?: string;
  _type: string;
};

export type ArticlePageBuilderBlock =
  | (PageBuilderBlockBase & {
      _type: "heroBlock";
      heading?: string;
      subheading?: string;
      backgroundImageUrl?: string;
      backgroundImageAlt?: string;
      cta?: { label?: string; link?: string };
    })
  | (PageBuilderBlockBase & {
      _type: "leadBlock";
      lead?: string;
    })
  | (PageBuilderBlockBase & {
      _type: "textBlock";
      content?: PortableTextBlock[];
    })
  | (PageBuilderBlockBase & {
      _type: "imageBlock";
      imageUrl?: string;
      imageAlt?: string;
      caption?: string;
    })
  | (PageBuilderBlockBase & {
      _type: "imageGalleryBlock";
      title?: string;
      images?: Array<{ _key?: string; url?: string; alt?: string; caption?: string }>;
    })
  | (PageBuilderBlockBase & {
      _type: "imageTextLeftBlock" | "imageTextRightBlock";
      imageUrl?: string;
      imageAlt?: string;
      content?: PortableTextBlock[];
    })
  | (PageBuilderBlockBase & {
      _type: "videoBlock";
      url?: string;
      title?: string;
      caption?: string;
    })
  | (PageBuilderBlockBase & {
      _type: "embedBlock";
      url?: string;
      title?: string;
      caption?: string;
    })
  | (PageBuilderBlockBase & {
      _type: "blockquoteBlock";
      quote?: string;
      attribution?: string;
      textColor?: "auto" | "light" | "dark" | "brand";
      backgroundImageUrl?: string;
      backgroundImageAlt?: string;
    })
  | (PageBuilderBlockBase & {
      _type: "dividerBlock";
    })
  | (PageBuilderBlockBase & {
      _type: "cta";
      label?: string;
      link?: string;
    });
