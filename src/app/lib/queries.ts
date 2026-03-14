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
      heroImage,
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
    heroImage,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "contributors": contributors[]->name,
    "venue": venue->{
      name,
      city,
      address,
      website
    },
    "categories": categories[]->title,
    location,
    priceFrom,
    "partners": partners[]->{
      name,
      website
    },
    "relatedArticles": relatedArticles[]->{
      _id,
      title,
      "slug": slug.current
    },
    ticketUrl,
    summary,
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
    heroImage,
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
      venue->city match $searchPattern ||
      count(contributors[]->name[@ match $searchPattern]) > 0 ||
      count(categories[]->title[@ match $searchPattern]) > 0
    )
  ] | order(startsAt asc, _id asc)[$offset...$end]{
    _id,
    title,
    startsAt,
    "slug": slug.current,
    heroImage,
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

export const allVenuesQuery = groq`
  *[
    _type == "venue" &&
    defined(slug.current)
  ] | order(name asc){
    _id,
    name,
    "slug": slug.current,
    city,
    address,
    logo,
    "logoUrl": logo.asset->url,
    website,
    "geo": geo{
      lat,
      lng
    }
  }
`;

export const venueBySlugQuery = groq`
  *[
    _type == "venue" &&
    slug.current == $slug
  ][0]{
    _id,
    name,
    "slug": slug.current,
    city,
    address,
    logo,
    "logoUrl": logo.asset->url,
    website,
    "geo": geo{
      lat,
      lng
    }
  }
`;

export const upcomingEventsByVenueSlugQuery = groq`
  *[
    _type == "event" &&
    status == "upcoming" &&
    startsAt >= now() &&
    defined(slug.current) &&
    venue->slug.current == $venueSlug
  ] | order(startsAt asc){
    _id,
    title,
    startsAt,
    "slug": slug.current,
    heroImage,
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

export const latestBackstageArticlesQuery = groq`
  *[
    _type == "article" &&
    contentType == "backstage" &&
    defined(slug.current)
  ] | order(coalesce(publishedAt, _createdAt) desc)[0...6]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    heroImage,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt
  }
`;

export const backstageArticlesPaginatedQuery = groq`
  *[
    _type == "article" &&
    contentType == "backstage" &&
    defined(slug.current) &&
    (
      $searchPattern == "" ||
      title match $searchPattern ||
      excerpt match $searchPattern ||
      count(authors[]->name[@ match $searchPattern]) > 0
    )
  ] | order(coalesce(publishedAt, _createdAt) desc, _id asc)[$offset...($offset + $limit)]{
    _id,
    title,
    "slug": slug.current,
    excerpt,
    publishedAt,
    heroImage,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt
  }
`;

export const backstageArticleBySlugQuery = groq`
  *[
    _type == "article" &&
    contentType == "backstage" &&
    slug.current == $slug
  ][0]{
    _id,
    title,
    subtitle,
    "slug": slug.current,
    excerpt,
    publishedAt,
    "authors": authors[]->{
      _id,
      name,
      image,
      "imageUrl": image.asset->url,
      "imageAlt": image.alt
    },
    heroImage,
    "heroImageUrl": heroImage.asset->url,
    "heroImageAlt": heroImage.alt,
    "pageBuilder": pageBuilder[]{
      ...,
      _type == "heroBlock" => {
        ...,
        backgroundImage,
        "backgroundImageUrl": backgroundImage.asset->url,
        "backgroundImageAlt": backgroundImage.alt
      },
      _type == "imageBlock" => {
        ...,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      _type == "imageGalleryBlock" => {
        ...,
        "images": images[]{
          ...,
          "image": {
            "asset": asset,
            "crop": crop,
            "hotspot": hotspot,
            "alt": alt
          },
          "url": asset->url,
          alt,
          caption
        }
      },
      _type == "imageTextLeftBlock" => {
        ...,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      _type == "imageTextRightBlock" => {
        ...,
        image,
        "imageUrl": image.asset->url,
        "imageAlt": image.alt
      },
      _type == "blockquoteBlock" => {
        ...,
        backgroundImage,
        "backgroundImageUrl": backgroundImage.asset->url,
        "backgroundImageAlt": backgroundImage.alt
      }
    },
    body
  }
`;
