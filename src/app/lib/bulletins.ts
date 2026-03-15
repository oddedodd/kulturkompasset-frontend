import { bulletinBySlugQuery, bulletinsPaginatedQuery } from "./queries";
import { sanityClient } from "./sanity.client";
import type { BulletinDetail, BulletinItem } from "./types";

type GetBulletinsPageInput = {
  offset?: number;
  limit?: number;
  search?: string;
};

export async function getBulletinsPage({
  offset = 0,
  limit = 9,
  search = "",
}: GetBulletinsPageInput = {}): Promise<BulletinItem[]> {
  const safeOffset = Number.isFinite(offset) ? Math.max(0, Math.floor(offset)) : 0;
  const safeLimit = Number.isFinite(limit) ? Math.max(1, Math.min(24, Math.floor(limit))) : 9;
  const safeSearch = search.trim();

  try {
    const bulletins = await sanityClient
      .withConfig({ useCdn: false, perspective: "published" })
      .fetch<BulletinItem[]>(bulletinsPaginatedQuery, {
        offset: safeOffset,
        end: safeOffset + safeLimit,
        searchPattern: safeSearch ? `*${safeSearch}*` : "",
      });

    return sanitizeBulletins(bulletins);
  } catch {
    return [];
  }
}

export async function getBulletinBySlug(slug: string): Promise<BulletinDetail | null> {
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
