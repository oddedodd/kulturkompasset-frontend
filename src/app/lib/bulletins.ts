import { unstable_cache } from "next/cache";
import { CACHE_TAGS } from "./cache-tags";
import { bulletinBySlugQuery, bulletinsPaginatedQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { BulletinDetail, BulletinItem } from "./types";

const SEARCH_CORPUS_LIMIT = 500;

type GetBulletinsPageInput = {
  offset?: number;
  limit?: number;
  search?: string;
};

const getBulletinBySlugCached = unstable_cache(
  async (slug: string): Promise<BulletinDetail | null> => {
    try {
      const bulletin = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<BulletinDetail | null>(bulletinBySlugQuery, { slug });

      if (
        !bulletin ||
        typeof bulletin._id !== "string" ||
        typeof bulletin.title !== "string" ||
        typeof bulletin.startsAt !== "string"
      ) {
        return null;
      }

      return bulletin;
    } catch {
      return null;
    }
  },
  ["bulletin-by-slug"],
  { tags: [CACHE_TAGS.bulletins], revalidate: 86_400 },
);

const getBulletinsSearchCorpusCached = unstable_cache(
  async (): Promise<BulletinItem[]> => {
    try {
      const bulletins = await sanityClient
        .withConfig({ useCdn: false, perspective: "published" })
        .fetch<BulletinItem[]>(bulletinsPaginatedQuery, {
          offset: 0,
          end: SEARCH_CORPUS_LIMIT,
          searchPattern: "",
        });

      return sanitizeBulletins(bulletins);
    } catch {
      return [];
    }
  },
  ["bulletins-search-corpus"],
  { tags: [CACHE_TAGS.bulletins], revalidate: 86_400 },
);

export async function getBulletinsPage({
  offset = 0,
  limit = 9,
  search = "",
}: GetBulletinsPageInput = {}): Promise<BulletinItem[]> {
  const safeOffset = Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(24, Math.floor(limit))) : 9;
  const safeSearch = normalizeText(search);

  if (safeSearch) {
    const bulletins = await getBulletinsSearchCorpusCached();
    return bulletins
      .filter((bulletin) =>
        normalizeText(
          [
            bulletin.title,
            bulletin.organizer,
            bulletin.place,
            bulletin.description,
          ]
            .filter(Boolean)
            .join(" "),
        ).includes(safeSearch),
      )
      .slice(safeOffset, safeOffset + safeLimit);
  }

  return unstable_cache(
    async (): Promise<BulletinItem[]> => {
      try {
        const bulletins = await sanityClient
          .withConfig({ useCdn: false, perspective: "published" })
          .fetch<BulletinItem[]>(bulletinsPaginatedQuery, {
            offset: safeOffset,
            end: safeOffset + safeLimit,
            searchPattern: "",
          });

        return sanitizeBulletins(bulletins);
      } catch {
        return [];
      }
    },
    [
      "bulletins-page",
      String(safeOffset),
      String(safeLimit),
      "__no-search__",
    ],
    { tags: [CACHE_TAGS.bulletins], revalidate: 86_400 },
  )();
}

export async function getBulletinBySlug(slug: string): Promise<BulletinDetail | null> {
  return getBulletinBySlugCached(slug);
}

function sanitizeBulletins(items: BulletinItem[] = []): BulletinItem[] {
  return items.filter(
    (item): item is BulletinItem =>
      Boolean(
        item &&
          typeof item._id === "string" &&
          typeof item.title === "string" &&
          item.title.trim().length > 0 &&
          typeof item.startsAt === "string" &&
          item.startsAt.trim().length > 0,
      ),
  );
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
