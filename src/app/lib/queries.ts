// src/lib/queries.ts
import { groq } from 'next-sanity';

export const latestNewsQuery = groq`
  *[_type == "news"] | order(date desc) [0..4]{
    _id,
    title,
    "slug": slug.current,
    date,
    body,
    featuredImage{
      asset->,
      alt
    }
  }
`;

export const mainNavigationQuery = groq`
  *[
    _type == "siteSettings" &&
    (_id == "site-settings" || _id == "drafts.site-settings")
  ][0]{
    mainNavigation[]{
      label,
      section
    }
  }
`;

export const featuredEventsQuery = groq`
  *[
    _type == "siteSettings" &&
    _id == "site-settings"
  ][0]{
    featuredEvents[]->{
      _id,
      title,
      startsAt,
      "slug": slug.current,
      "heroImageUrl": heroImage.asset->url,
      "heroImageAlt": heroImage.alt,
      "contributors": contributors[]->name
    }
  }
`;
