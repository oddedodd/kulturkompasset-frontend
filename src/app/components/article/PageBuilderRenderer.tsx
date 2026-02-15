import { PortableText } from "@portabletext/react";
import Image from "next/image";
import type { ArticlePageBuilderBlock } from "@/app/lib/types";
import { ArticleImageGallery } from "./ArticleImageGallery";
import { articlePortableTextComponents } from "./portableTextComponents";

type PageBuilderRendererProps = {
  blocks: ArticlePageBuilderBlock[];
};

export function PageBuilderRenderer({ blocks }: PageBuilderRendererProps) {
  return (
    <section className="mt-10 space-y-10">
      {blocks.map((block, index) => {
        const key = block._key || `${block._type}-${index}`;

        switch (block._type) {
          case "heroBlock":
            return (
              <section key={key} className="relative overflow-hidden rounded-2xl">
                {block.backgroundImageUrl ? (
                  <Image
                    src={block.backgroundImageUrl}
                    alt={block.backgroundImageAlt || block.heading || "Hero"}
                    width={1600}
                    height={900}
                    className="h-[360px] w-full object-cover sm:h-[420px]"
                  />
                ) : (
                  <div className="h-[260px] w-full bg-gray-200 sm:h-[320px]" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                  {block.heading ? (
                    <h2 className="text-3xl font-semibold tracking-tight sm:text-4xl">
                      {block.heading}
                    </h2>
                  ) : null}
                  {block.subheading ? (
                    <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/90 sm:text-base">
                      {block.subheading}
                    </p>
                  ) : null}
                  {block.cta?.label && block.cta?.link ? (
                    <a
                      href={block.cta.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-5 inline-flex rounded-full bg-white px-5 py-2 text-sm font-medium text-black hover:bg-white/90"
                    >
                      {block.cta.label}
                    </a>
                  ) : null}
                </div>
              </section>
            );

          case "leadBlock":
            return block.lead ? (
              <p key={key} className="text-xl leading-relaxed text-black/85">
                {block.lead}
              </p>
            ) : null;

          case "textBlock":
            return block.content && block.content.length > 0 ? (
              <section key={key} className="prose prose-neutral max-w-none">
                <PortableText value={block.content} components={articlePortableTextComponents} />
              </section>
            ) : null;

          case "imageBlock":
            return block.imageUrl ? (
              <figure key={key} className="space-y-2">
                <Image
                  src={block.imageUrl}
                  alt={block.imageAlt || "Illustrasjon"}
                  width={1600}
                  height={1000}
                  className="h-auto w-full rounded-2xl object-cover"
                />
                {block.caption ? (
                  <figcaption className="text-sm text-black/60">{block.caption}</figcaption>
                ) : null}
              </figure>
            ) : null;

          case "imageGalleryBlock":
            return <ArticleImageGallery key={key} title={block.title} images={block.images} />;

          case "imageTextLeftBlock":
          case "imageTextRightBlock":
            return (
              <section
                key={key}
                className="grid grid-cols-1 items-start gap-6 md:grid-cols-2 md:gap-8"
              >
                <div
                  className={
                    block._type === "imageTextRightBlock" ? "order-1 md:order-2" : "order-1"
                  }
                >
                  {block.imageUrl ? (
                    <Image
                      src={block.imageUrl}
                      alt={block.imageAlt || "Illustrasjon"}
                      width={1200}
                      height={900}
                      className="h-auto w-full rounded-2xl object-cover"
                    />
                  ) : null}
                </div>
                <div
                  className={
                    block._type === "imageTextRightBlock" ? "order-2 md:order-1" : "order-2"
                  }
                >
                  {block.content && block.content.length > 0 ? (
                    <div className="prose prose-neutral max-w-none">
                      <PortableText value={block.content} components={articlePortableTextComponents} />
                    </div>
                  ) : null}
                </div>
              </section>
            );

          case "videoBlock":
            return (
              <section key={key} className="space-y-3">
                {block.title ? <h3 className="text-xl font-semibold tracking-tight">{block.title}</h3> : null}
                {toEmbedUrl(block.url) ? (
                  <div className="aspect-video overflow-hidden rounded-2xl bg-black">
                    <iframe
                      src={toEmbedUrl(block.url)!}
                      title={block.title || "Video"}
                      className="h-full w-full border-0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      allowFullScreen
                    />
                  </div>
                ) : block.url ? (
                  <a
                    href={block.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
                  >
                    Åpne video i ny fane
                  </a>
                ) : null}
                {block.caption ? <p className="text-sm text-black/60">{block.caption}</p> : null}
              </section>
            );

          case "embedBlock":
            return <EmbedBlock key={key} url={block.url} title={block.title} caption={block.caption} />;

          case "blockquoteBlock":
            return (
              <blockquote key={key} className="relative overflow-hidden rounded-2xl bg-black/5 p-8">
                {block.backgroundImageUrl ? (
                  <Image
                    src={block.backgroundImageUrl}
                    alt={block.backgroundImageAlt || "Bakgrunn"}
                    fill
                    className="object-cover"
                  />
                ) : null}
                {block.backgroundImageUrl ? <div className="absolute inset-0 bg-black/45" /> : null}
                <div
                  className={[
                    "relative",
                    block.textColor === "light" ? "text-white" : "",
                    block.textColor === "dark" ? "text-black" : "",
                    block.textColor === "brand" ? "text-sky-700" : "",
                    !block.textColor || block.textColor === "auto"
                      ? block.backgroundImageUrl
                        ? "text-white"
                        : "text-black/85"
                      : "",
                  ].join(" ")}
                >
                  {block.quote ? (
                    <p className="text-2xl font-medium leading-relaxed sm:text-3xl">"{block.quote}"</p>
                  ) : null}
                  {block.attribution ? (
                    <footer className="mt-4 text-sm uppercase tracking-wide opacity-80">
                      {block.attribution}
                    </footer>
                  ) : null}
                </div>
              </blockquote>
            );

          case "dividerBlock":
            return <hr key={key} className="border-black/15" />;

          case "cta":
            return block.label && block.link ? (
              <a
                key={key}
                href={toSafeExternalHref(block.link)}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex rounded-full bg-black px-6 py-3 text-sm font-medium text-white hover:bg-black/85"
              >
                {block.label}
              </a>
            ) : null;

          default:
            return null;
        }
      })}
    </section>
  );
}

function toSafeExternalHref(value?: string): string {
  if (!value) return "#";
  try {
    const url = new URL(value);
    if (url.protocol === "http:" || url.protocol === "https:") {
      return value;
    }
    return "#";
  } catch {
    return "#";
  }
}

function toEmbedUrl(input?: string): string | null {
  if (!input) return null;

  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "youtu.be") {
      const id = url.pathname.replace("/", "");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "youtube.com") {
      const id = url.searchParams.get("v");
      return id ? `https://www.youtube.com/embed/${id}` : null;
    }
    if (host === "vimeo.com") {
      const id = url.pathname.split("/").filter(Boolean)[0];
      return id ? `https://player.vimeo.com/video/${id}` : null;
    }
    if (host === "player.vimeo.com") {
      return input;
    }
    return null;
  } catch {
    return null;
  }
}

type EmbedBlockProps = {
  url?: string;
  title?: string;
  caption?: string;
};

async function EmbedBlock({ url, title, caption }: EmbedBlockProps) {
  const oembed = await fetchOEmbed(url);

  return (
    <section className="space-y-3 rounded-2xl p-1">
      {title ? <h3 className="text-lg font-semibold tracking-tight">{title}</h3> : null}

      {oembed?.html ? (
        <div
          className="oembed-wrapper overflow-hidden rounded-xl"
          dangerouslySetInnerHTML={{ __html: oembed.html }}
        />
      ) : url ? (
        <a
          href={toSafeExternalHref(url)}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-black/70 underline underline-offset-4 hover:text-black"
        >
          Åpne innhold
        </a>
      ) : null}

      {caption ? <p className="text-sm text-black/60">{caption}</p> : null}
    </section>
  );
}

type OEmbedResponse = {
  html?: string;
};

async function fetchOEmbed(input?: string): Promise<OEmbedResponse | null> {
  if (!input) return null;

  const provider = detectOEmbedProvider(input);
  if (!provider) return null;

  const endpoint =
    provider === "spotify"
      ? `https://open.spotify.com/oembed?url=${encodeURIComponent(input)}`
      : `https://soundcloud.com/oembed?format=json&url=${encodeURIComponent(input)}`;

  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 3600 },
    });
    if (!response.ok) return null;

    const data = (await response.json()) as OEmbedResponse;
    return data?.html ? data : null;
  } catch {
    return null;
  }
}

function detectOEmbedProvider(input: string): "spotify" | "soundcloud" | null {
  try {
    const url = new URL(input);
    const host = url.hostname.replace(/^www\./, "");

    if (host === "open.spotify.com" || host === "spotify.link") {
      return "spotify";
    }
    if (host === "soundcloud.com" || host.endsWith(".soundcloud.com")) {
      return "soundcloud";
    }

    return null;
  } catch {
    return null;
  }
}
