import Image from "next/image";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import { getSectionLabel, sectionHref } from "@/app/lib/navigation";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import type { ArticlePageBuilderBlock, LinkBlockTarget } from "@/app/lib/types";

/**
 * Standardingressen fra skjemaet (`DEFAULT_LINK_SUMMARY` i studioet). Kortet
 * skal aldri stå uten ingress.
 */
const DEFAULT_SUMMARY = "Les mer her";

/**
 * Ruta hver dokumenttype har i frontend. `playlist`, `contributor` og
 * `category` kan velges i studioet, men har ingen detaljside — de gir null, og
 * da rendres ikke kortet.
 */
function internalHref(target?: LinkBlockTarget): string | null {
  if (!target?.slug) return null;

  switch (target._type) {
    case "article":
      return target.contentType === "aktuelt"
        ? `/aktuelt/${target.slug}`
        : `/backstage/${target.slug}`;
    case "event":
      return `/event/${target.slug}`;
    case "venue":
      return `/venues/${target.slug}`;
    case "bulletin":
      return `/bulletin/${target.slug}`;
    default:
      return null;
  }
}

/** Skjemaet tillater http, https, mailto og tel — alt annet forkastes. */
function externalHref(value?: string): string | null {
  if (!value) return null;

  try {
    const url = new URL(value);
    const allowed = ["http:", "https:", "mailto:", "tel:"];
    return allowed.includes(url.protocol) ? value : null;
  } catch {
    return null;
  }
}

/** Vertsnavnet vises som mållinje på eksterne kort, slik stedet gjør på arrangementskortet. */
function externalHost(value: string): string | null {
  try {
    return new URL(value).hostname.replace(/^www\./, "");
  } catch {
    return null;
  }
}

type LinkBlock = Extract<ArticlePageBuilderBlock, { _type: "linkBlock" }>;

type ArticleLinkCardProps = {
  block: LinkBlock;
};

export async function ArticleLinkCard({ block }: ArticleLinkCardProps) {
  // Bytter redaktøren linkType etter å ha fylt ut, blir den gamle verdien
  // liggende igjen i dokumentet. Derfor styrer linkType alt som leses her.
  const linkType = block.linkType;

  let href: string | null = null;
  let fallbackTitle: string | undefined;
  let host: string | null = null;

  if (linkType === "external") {
    href = externalHref(block.externalUrl);
    host = href ? externalHost(href) : null;
  } else if (linkType === "section") {
    if (block.section) {
      href = sectionHref(block.section);
      fallbackTitle = await getSectionLabel(block.section);
    }
  } else if (linkType === "internal") {
    href = internalHref(block.internalTarget);
    fallbackTitle = block.internalTarget?.title;
  }

  const title = block.title || fallbackTitle;

  // Uten mål eller tittel er kortet ufullstendig, og en lenke som ikke går
  // noe sted hjelper ingen.
  if (!href || !title) return null;

  const summary = block.summary || DEFAULT_SUMMARY;
  const isExternal = linkType === "external";
  const imageUrl =
    getSanityImageUrl(block.image, {
      width: 240,
      height: 240,
    }) || block.imageUrl;

  const className =
    "not-prose group flex items-center gap-4 overflow-hidden rounded-lg bg-[#E9E5E0] pr-4 transition-colors hover:bg-[#e2ddd6]";

  const body = (
    <>
      {imageUrl ? (
        <Image
          src={imageUrl}
          alt={block.imageAlt || title}
          width={320}
          height={320}
          className="h-24 w-24 shrink-0 object-cover"
        />
      ) : (
        <div className="h-24 w-24 shrink-0 bg-[#c5bbae]" aria-hidden />
      )}

      <div className="min-w-0 py-2.5 text-[#312821]">
        {host ? (
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-black/60">
            <span className="flex min-w-0 items-center gap-1.5">
              <ExternalLink className="h-3.5 w-3.5 shrink-0 opacity-55" aria-hidden="true" />
              <span className="truncate">{host}</span>
            </span>
          </div>
        ) : null}

        <h3 className="mt-0.5 truncate text-base font-semibold leading-snug tracking-tight">
          {title}
        </h3>

        <p className="line-clamp-2 text-sm leading-snug text-black/70">{summary}</p>
      </div>
    </>
  );

  if (isExternal) {
    return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`Åpne ekstern side: ${title}`}
        className={className}
      >
        {body}
      </a>
    );
  }

  return (
    <Link href={href} aria-label={`Åpne side: ${title}`} className={className}>
      {body}
    </Link>
  );
}
