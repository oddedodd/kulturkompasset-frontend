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

export const upcomingEventsPaginatedQuery = groq`
  *[
    _type == "event" &&
    status == "upcoming" &&
    startsAt >= now() &&
    ($venueName == "" || venue->name == $venueName) &&
    ($dateStart == "" || startsAt >= $dateStart) &&
    (
      $searchPattern == "" ||
      title match $searchPattern ||
      venue->name match $searchPattern ||
      count(contributors[]->name[@ match $searchPattern]) > 0 ||
      count(categories[]->title[@ match $searchPattern]) > 0
    )
  ] | order(startsAt asc, _id asc)[$offset...($offset + $limit)]{
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

export const upcomingEventVenuesQuery = groq`
  array::compact(
    array::unique(
      *[
        _type == "event" &&
        status == "upcoming" &&
        startsAt >= now() &&
        defined(venue->name)
      ].venue->name
    )
  )
`;
