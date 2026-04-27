import Image from "next/image";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import type { SanityImageSource } from "@/app/lib/types";

type TextBox = {
  _key?: string;
  text?: string;
  textColor?: string;
  backgroundColor?: string;
};

type ScrollytellBlockProps = {
  backgroundType?: "image" | "video";
  backgroundImage?: SanityImageSource;
  backgroundImageUrl?: string;
  backgroundImageAlt?: string;
  backgroundVideoUrl?: string;
  textBoxes?: TextBox[];
};

export function ScrollytellBlock({
  backgroundType,
  backgroundImage,
  backgroundImageUrl,
  backgroundImageAlt,
  backgroundVideoUrl,
  textBoxes,
}: ScrollytellBlockProps) {
  const isVideo = backgroundType === "video";
  const vimeoSrc = isVideo ? getVimeoEmbedUrl(backgroundVideoUrl) : null;
  const resolvedImageUrl = !isVideo
    ? getSanityImageUrl(backgroundImage, { width: 1920 }) || backgroundImageUrl
    : null;
  const hasBackground = isVideo ? !!vimeoSrc : !!resolvedImageUrl;

  if (!textBoxes || textBoxes.length === 0) return null;

  return (
    <div
      className="relative scrollytell-block"
      style={{
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        marginTop: 0,
        marginBottom: 0,
        paddingTop: 0,
        paddingBottom: 0,
      }}
    >
      {hasBackground ? (
        <div className="scrollytell-media sticky top-0 h-screen overflow-hidden">
          {vimeoSrc ? (
            <iframe
              src={vimeoSrc}
              title="Bakgrunnsvideo"
              allow="autoplay; fullscreen"
              allowFullScreen
              className="scrollytell-iframe"
              style={coverVideoStyle}
            />
          ) : resolvedImageUrl ? (
            <Image
              src={resolvedImageUrl}
              alt={backgroundImageAlt || ""}
              fill
              className="object-cover m-0 p-0"
              sizes="100vw"
              priority
            />
          ) : null}
        </div>
      ) : null}

      <div
        className="relative"
        style={{
          zIndex: 1,
          marginTop: hasBackground ? "-100vh" : undefined,
        }}
      >
        {textBoxes.map((box, index) => (
          <div
            key={box._key || index}
            className="flex h-screen items-end justify-center px-6 pb-12"
          >
            {box.text ? (
              <div
                className="max-w-lg px-8 py-6 text-center"
                style={{
                  backgroundColor: box.backgroundColor ?? "rgba(0,0,0,0.6)",
                  color: box.textColor ?? "#ffffff",
                }}
              >
                <p className="text-lg font-medium leading-relaxed sm:text-xl">
                  {box.text}
                </p>
              </div>
            ) : null}
          </div>
        ))}
        <div style={{ height: "100vh" }} />
      </div>
    </div>
  );
}

function getVimeoEmbedUrl(url?: string): string | null {
  if (!url) return null;
  try {
    const parsed = new URL(url);
    const host = parsed.hostname.replace(/^www\./, "");
    if (host === "vimeo.com") {
      const id = parsed.pathname.split("/").filter(Boolean)[0];
      return id
        ? `https://player.vimeo.com/video/${id}?background=1&autoplay=1&loop=1&muted=1`
        : null;
    }
    if (host === "player.vimeo.com") {
      return `${parsed.protocol}//${parsed.host}${parsed.pathname}?background=1&autoplay=1&loop=1&muted=1`;
    }
    return null;
  } catch {
    return null;
  }
}

const coverVideoStyle = {
  position: "absolute" as const,
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "max(100%, 177.78vh)",
  height: "max(100%, 56.25vw)",
  border: 0,
  margin: 0,
  padding: 0,
  display: "block",
  pointerEvents: "none" as const,
};
