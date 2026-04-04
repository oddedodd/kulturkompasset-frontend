import type { Metadata } from "next";

type SeoMetadataInput = {
  title: string;
  description?: string;
  path: string;
  imageUrl?: string;
};

const DEFAULT_MAX_DESCRIPTION_LENGTH = 160;

function normalizeBaseUrl(value?: string): string | undefined {
  if (!value) return undefined;
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  if (trimmed.startsWith("http://") || trimmed.startsWith("https://")) {
    return trimmed.replace(/\/+$/, "");
  }
  return `https://${trimmed.replace(/\/+$/, "")}`;
}

export function resolveSiteBaseUrl(): string {
  const fromPublic = normalizeBaseUrl(process.env.NEXT_PUBLIC_SITE_URL);
  if (fromPublic) return fromPublic;

  const fromProd = normalizeBaseUrl(process.env.VERCEL_PROJECT_PRODUCTION_URL);
  if (fromProd) return fromProd;

  const fromVercelUrl = normalizeBaseUrl(process.env.VERCEL_URL);
  if (fromVercelUrl) return fromVercelUrl;

  return "http://localhost:3000";
}

export function toAbsoluteUrl(pathOrUrl: string): string {
  try {
    return new URL(pathOrUrl).toString();
  } catch {
    const base = resolveSiteBaseUrl();
    return new URL(pathOrUrl, base).toString();
  }
}

export function sanitizeSeoDescription(
  value?: string,
  maxLength: number = DEFAULT_MAX_DESCRIPTION_LENGTH,
): string | undefined {
  if (!value) return undefined;

  const normalized = value
    .replace(/<[^>]*>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (!normalized) return undefined;
  if (normalized.length <= maxLength) return normalized;

  return `${normalized.slice(0, Math.max(0, maxLength - 1)).trimEnd()}…`;
}

export function buildSeoMetadata({
  title,
  description,
  path,
  imageUrl,
}: SeoMetadataInput): Metadata {
  const canonicalUrl = toAbsoluteUrl(path);
  const absoluteImageUrl = imageUrl ? toAbsoluteUrl(imageUrl) : undefined;

  return {
    title,
    description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title,
      description,
      url: canonicalUrl,
      type: "article",
      ...(absoluteImageUrl
        ? {
            images: [
              {
                url: absoluteImageUrl,
              },
            ],
          }
        : {}),
    },
    twitter: {
      card: absoluteImageUrl ? "summary_large_image" : "summary",
      title,
      description,
      ...(absoluteImageUrl ? { images: [absoluteImageUrl] } : {}),
    },
  };
}
