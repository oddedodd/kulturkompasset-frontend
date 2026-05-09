import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import {
  backstageArticlesPaginatedQuery,
  upcomingEventsPaginatedQuery,
} from "./queries";
import { sanityClient } from "./sanity.client";
import type {
  BackstageArticleCard,
  CalendarEvent,
  NewspaperEmbedCarouselItem,
} from "./types";

const EVENT_LIMIT = 8;
const ARTICLE_LIMIT = 4;

const getNewspaperEmbedCarouselItemsCached = unstable_cache(
  async (): Promise<NewspaperEmbedCarouselItem[]> => {
    try {
      const [events, articles] = await Promise.all([
        sanityClient
          .withConfig({ useCdn: false, perspective: "published" })
          .fetch<CalendarEvent[]>(upcomingEventsPaginatedQuery, {
            offset: 0,
            end: EVENT_LIMIT,
            venueName: "",
            dateStart: "",
            searchPattern: "",
          }),
        sanityClient
          .withConfig({ useCdn: false, perspective: "published" })
          .fetch<BackstageArticleCard[]>(backstageArticlesPaginatedQuery, {
            offset: 0,
            limit: ARTICLE_LIMIT,
            searchPattern: "",
          }),
      ]);

      return interleaveItems(
        sanitizeEvents(events).slice(0, EVENT_LIMIT),
        sanitizeArticles(articles).slice(0, ARTICLE_LIMIT),
      );
    } catch {
      return [];
    }
  },
  ["newspaper-embed-carousel-items"],
  {
    tags: [CACHE_TAGS.events, CACHE_TAGS.venues, CACHE_TAGS.articles],
    revalidate: 86_400,
  },
);

export async function getNewspaperEmbedCarouselItems(): Promise<
  NewspaperEmbedCarouselItem[]
> {
  return getNewspaperEmbedCarouselItemsCached();
}

function interleaveItems(
  events: CalendarEvent[],
  articles: BackstageArticleCard[],
): NewspaperEmbedCarouselItem[] {
  const items: NewspaperEmbedCarouselItem[] = [];
  const maxGroups = Math.max(Math.ceil(events.length / 2), articles.length);

  for (let groupIndex = 0; groupIndex < maxGroups; groupIndex += 1) {
    const firstEvent = events[groupIndex * 2];
    const secondEvent = events[groupIndex * 2 + 1];
    const article = articles[groupIndex];

    if (firstEvent) items.push({ ...firstEvent, type: "event" });
    if (secondEvent) items.push({ ...secondEvent, type: "event" });
    if (article) items.push({ ...article, type: "article" });
  }

  return items.slice(0, EVENT_LIMIT + ARTICLE_LIMIT);
}

function sanitizeEvents(events: CalendarEvent[] = []): CalendarEvent[] {
  return (Array.isArray(events) ? events : []).filter(
    (event): event is CalendarEvent =>
      Boolean(
        event &&
          typeof event._id === "string" &&
          typeof event.title === "string" &&
          typeof event.startsAt === "string",
      ),
  );
}

function sanitizeArticles(
  articles: BackstageArticleCard[] = [],
): BackstageArticleCard[] {
  return (Array.isArray(articles) ? articles : []).filter(
    (article): article is BackstageArticleCard =>
      Boolean(
        article &&
          typeof article._id === "string" &&
          typeof article.title === "string" &&
          typeof article.slug === "string",
      ),
  );
}
