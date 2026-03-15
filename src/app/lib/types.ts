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
  heroImage?: SanityImageSource;
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
  heroImage?: SanityImageSource;
  heroImageUrl?: string;
  heroImageAlt?: string;
  contributors?: string[];
  location?: string;
  venue?: {
    name?: string;
    city?: string;
    address?: string;
    website?: string;
  };
  categories?: string[];
  priceFrom?: number;
  partners?: Array<{
    name?: string;
    website?: string;
  }>;
  relatedArticles?: Array<{
    _id: string;
    title: string;
    slug?: string;
  }>;
  ticketUrl?: string;
  summary?: string;
  ingress?: string;
  description?: string;
  body?: PortableTextBlock[];
};

export type CalendarEvent = {
  _id: string;
  title: string;
  startsAt: string;
  slug?: string;
  heroImage?: SanityImageSource;
  heroImageUrl?: string;
  heroImageAlt?: string;
  venue?: {
    name?: string;
    city?: string;
  };
  contributors?: string[];
  categories?: string[];
};

export type BulletinItem = {
  _id: string;
  title: string;
  startsAt: string;
  slug?: string;
  heroImage?: SanityImageSource;
  heroImageUrl?: string;
  heroImageAlt?: string;
  organizer?: string;
  description?: string;
  price?: string;
};

export type BulletinDetail = BulletinItem & {
  contact?: string;
};

type VenueGeoPoint = {
  lat?: number;
  lng?: number;
};

export type VenueListItem = {
  _id: string;
  name: string;
  slug?: string;
  city?: string;
  address?: string;
  logo?: SanityImageSource;
  logoUrl?: string;
  website?: string;
  geo?: VenueGeoPoint;
};

export type VenueDetail = VenueListItem;

export type BackstageArticleCard = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  publishedAt?: string;
  heroImage?: SanityImageSource;
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
  authors?: Array<{
    _id?: string;
    name?: string;
    image?: SanityImageSource;
    imageUrl?: string;
    imageAlt?: string;
  }>;
  heroImage?: SanityImageSource;
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
      backgroundImage?: SanityImageSource;
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
      image?: SanityImageSource;
      imageUrl?: string;
      imageAlt?: string;
      caption?: string;
    })
  | (PageBuilderBlockBase & {
      _type: "imageGalleryBlock";
      title?: string;
      images?: Array<{
        _key?: string;
        image?: SanityImageSource;
        url?: string;
        alt?: string;
        caption?: string;
      }>;
    })
  | (PageBuilderBlockBase & {
      _type: "imageTextLeftBlock" | "imageTextRightBlock";
      image?: SanityImageSource;
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
      backgroundImage?: SanityImageSource;
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

export type SanityImageSource = {
  asset?: {
    _ref?: string;
    _type?: string;
    url?: string;
  };
  crop?: {
    top?: number;
    bottom?: number;
    left?: number;
    right?: number;
  };
  hotspot?: {
    x?: number;
    y?: number;
    height?: number;
    width?: number;
  };
  alt?: string;
};
