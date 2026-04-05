import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import {
  backstageArticleBySlugQuery,
  backstageArticlesPaginatedQuery,
  latestBackstageArticlesQuery,
} from "./queries";
import { sanityClient } from "./sanity.client";
import type { BackstageArticleCard, BackstageArticleDetail } from "./types";

const getBackstageArticleBySlugCached = unstable_cache(
  async (slug: string): Promise<BackstageArticleDetail | null> => {
    try {
      const article = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<BackstageArticleDetail | null>(backstageArticleBySlugQuery, { slug });

      if (!article || typeof article._id !== "string" || typeof article.title !== "string") {
        return null;
      }

      return article;
    } catch {
      return null;
    }
  },
  ["backstage-article-by-slug"],
  { tags: [CACHE_TAGS.articles], revalidate: 86_400 },
);

export async function getLatestBackstageArticles(): Promise<BackstageArticleCard[]> {
  return unstable_cache(
    async (): Promise<BackstageArticleCard[]> => {
      try {
        const articles = await sanityClient
          .withConfig({ useCdn: false, perspective: "published" })
          .fetch<BackstageArticleCard[]>(latestBackstageArticlesQuery);

        return (Array.isArray(articles) ? articles : []).filter(
          (article): article is BackstageArticleCard =>
            Boolean(
              article &&
                typeof article._id === "string" &&
                typeof article.title === "string" &&
                typeof article.slug === "string",
            ),
        );
      } catch {
        return [];
      }
    },
    ["latest-backstage-articles"],
    { tags: [CACHE_TAGS.articles], revalidate: 86_400 },
  )();
}

export async function getBackstageArticleBySlug(slug: string): Promise<BackstageArticleDetail | null> {
  return getBackstageArticleBySlugCached(slug);
}

type GetBackstageArticlesPageInput = {
  offset?: number;
  limit?: number;
  search?: string;
};

export async function getBackstageArticlesPage({
  offset = 0,
  limit = 9,
  search = "",
}: GetBackstageArticlesPageInput = {}): Promise<BackstageArticleCard[]> {
  const safeOffset = Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(24, Math.floor(limit))) : 9;
  const safeSearch = normalizeText(search);
  const safeSearchPattern = toSearchPattern(search);

  const cacheKey = [
    "backstage-articles-page",
    String(safeOffset),
    String(safeLimit),
    safeSearch || "__no-search__",
  ];

  return unstable_cache(
    async (): Promise<BackstageArticleCard[]> => {
      try {
        if (safeSearch) {
          const articles = await sanityClient
            .withConfig({ useCdn: false, perspective: "published" })
            .fetch<BackstageArticleCard[]>(backstageArticlesPaginatedQuery, {
              offset: 0,
              limit: 500,
              searchPattern: "",
            });

          const filtered = sanitizeCards(articles).filter((article) =>
            normalizeText([article.title, article.excerpt].filter(Boolean).join(" ")).includes(safeSearch),
          );

          return filtered.slice(safeOffset, safeOffset + safeLimit);
        }

        const articles = await sanityClient
          .withConfig({ useCdn: false, perspective: "published" })
          .fetch<BackstageArticleCard[]>(backstageArticlesPaginatedQuery, {
            offset: safeOffset,
            limit: safeLimit,
            searchPattern: safeSearchPattern,
          });

        return sanitizeCards(articles);
      } catch {
        return [];
      }
    },
    cacheKey,
    { tags: [CACHE_TAGS.articles], revalidate: 86_400 },
  )();
}

function sanitizeCards(cards: BackstageArticleCard[] = []): BackstageArticleCard[] {
  return (Array.isArray(cards) ? cards : []).filter(
    (article): article is BackstageArticleCard =>
      Boolean(
        article &&
          typeof article._id === "string" &&
          typeof article.title === "string" &&
          typeof article.slug === "string",
      ),
  );
}

function toSearchPattern(search: string): string {
  const value = search.trim();
  if (!value) return "";
  const sanitized = value.replace(/[*?]/g, "").replace(/\s+/g, "*");
  if (!sanitized) return "";
  return `*${sanitized}*`;
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
