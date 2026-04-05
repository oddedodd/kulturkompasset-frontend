import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CACHE_TAGS } from "@/app/lib/cache-tags";

const TOP_LEVEL_PATHS = [
  "/",
  "/kalender",
  "/backstage",
  "/venues",
  "/bulletin",
  "/om",
  "/news",
] as const;

const REVALIDATE_TAGS = Object.values(CACHE_TAGS);

type RevalidatePayload = {
  _type?: string;
  slug?: string | { current?: string };
  contentType?: string;
} | null;

function hasValidSecret(secret: string | null): boolean {
  return Boolean(
    secret &&
      process.env.REVALIDATE_SECRET &&
      secret.length > 0 &&
      secret === process.env.REVALIDATE_SECRET,
  );
}

function revalidatePaths(paths: Set<string>) {
  for (const path of paths) {
    revalidatePath(path);
  }
}

function revalidateLayouts(paths: Set<string>) {
  for (const path of paths) {
    revalidatePath(path, "layout");
  }
}

function revalidateTags(tags: Set<string>) {
  for (const tag of tags) {
    revalidateTag(tag, "max");
  }
}

function extractSlug(payload: RevalidatePayload): string | undefined {
  if (!payload?.slug) return undefined;
  if (typeof payload.slug === "string") return payload.slug;
  if (typeof payload.slug.current === "string") return payload.slug.current;
  return undefined;
}

function resolveTargetPathsAndTags(payload: RevalidatePayload): {
  paths: Set<string>;
  layoutPaths: Set<string>;
  tags: Set<string>;
  fallback: boolean;
  type: string;
  slug?: string;
} {
  const type = payload?._type?.trim() ?? "";
  const slug = extractSlug(payload);
  const contentType = payload?.contentType?.trim() ?? "";
  const paths = new Set<string>();
  const layoutPaths = new Set<string>();
  const tags = new Set<string>();

  switch (type) {
    case "event":
      tags.add(CACHE_TAGS.events);
      paths.add("/");
      paths.add("/kalender");
      if (slug) paths.add(`/event/${slug}`);
      break;
    case "article":
      tags.add(CACHE_TAGS.articles);
      if (contentType === "backstage") {
        paths.add("/backstage");
        if (slug) paths.add(`/backstage/${slug}`);
      } else if (slug === "om-kulturkompasset") {
        paths.add("/om");
      } else {
        paths.add("/backstage");
        paths.add("/om");
        if (slug) paths.add(`/backstage/${slug}`);
      }
      paths.add("/");
      break;
    case "bulletin":
      tags.add(CACHE_TAGS.bulletins);
      paths.add("/bulletin");
      if (slug) paths.add(`/bulletin/${slug}`);
      break;
    case "venue":
      tags.add(CACHE_TAGS.venues);
      paths.add("/");
      paths.add("/kalender");
      paths.add("/venues");
      if (slug) paths.add(`/venues/${slug}`);
      break;
    case "partner":
      tags.add(CACHE_TAGS.partners);
      tags.add(CACHE_TAGS.siteSettings);
      tags.add(CACHE_TAGS.events);
      paths.add("/");
      layoutPaths.add("/");
      break;
    case "siteSettings":
      tags.add(CACHE_TAGS.siteSettings);
      TOP_LEVEL_PATHS.forEach((path) => paths.add(path));
      layoutPaths.add("/");
      break;
    case "news":
      tags.add(CACHE_TAGS.news);
      paths.add("/news");
      break;
    default:
      TOP_LEVEL_PATHS.forEach((path) => paths.add(path));
      REVALIDATE_TAGS.forEach((tag) => tags.add(tag));
      layoutPaths.add("/");
      return { paths, layoutPaths, tags, fallback: true, type, slug };
  }

  if (paths.size === 0 || tags.size === 0) {
    TOP_LEVEL_PATHS.forEach((path) => paths.add(path));
    REVALIDATE_TAGS.forEach((tag) => tags.add(tag));
    layoutPaths.add("/");
    return { paths, layoutPaths, tags, fallback: true, type, slug };
  }

  return { paths, layoutPaths, tags, fallback: false, type, slug };
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!hasValidSecret(secret)) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  const payload = (await request.json().catch(() => null)) as RevalidatePayload;
  const { paths, layoutPaths, tags, fallback, type, slug } = resolveTargetPathsAndTags(payload);

  revalidatePaths(paths);
  revalidateLayouts(layoutPaths);
  revalidateTags(tags);

  const invalidatedPaths = [...paths];
  const invalidatedLayoutPaths = [...layoutPaths];
  const invalidatedTags = [...tags];
  console.info("[revalidate] completed", {
    type: type || "unknown",
    slug: slug ?? null,
    fallback,
    paths: invalidatedPaths,
    layoutPaths: invalidatedLayoutPaths,
    tags: invalidatedTags,
  });

  return NextResponse.json({
    revalidated: true,
    fallback,
    type: type || null,
    slug: slug || null,
    paths: invalidatedPaths,
    layoutPaths: invalidatedLayoutPaths,
    tags: invalidatedTags,
    at: new Date().toISOString(),
  });
}

// Optional GET endpoint for quick manual verification in browser.
export async function GET(request: Request) {
  return POST(request);
}
