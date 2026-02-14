import { backstageArticleBySlugQuery, latestBackstageArticlesQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { BackstageArticleCard, BackstageArticleDetail } from "./types";

export async function getLatestBackstageArticles(): Promise<BackstageArticleCard[]> {
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
}

export async function getBackstageArticleBySlug(slug: string): Promise<BackstageArticleDetail | null> {
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
}
