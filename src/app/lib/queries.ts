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

export const eventBySlugQuery = groq`
  *[
    _type == "event" &&
    slug.current == $slug
  ][0]{
    _id,
    title,
    startsAt,
    endsAt,
    "slug": slug.current,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "contributors": contributors[]->name,
    location,
    ticketUrl,
    ingress,
    description,
    body
  }
`;

export const upcomingEventsQuery = groq`
  *[
    _type == "event" &&
    status == "upcoming" &&
    startsAt >= now()
  ] | order(startsAt asc){
    _id,
    title,
    startsAt,
    "slug": slug.current,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "venue": venue->{
      name,
      city
    },
    "contributors": contributors[]->name,
    "categories": categories[]->title
  }
`;
