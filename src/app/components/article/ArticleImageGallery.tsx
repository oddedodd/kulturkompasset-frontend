"use client";

import Image from "next/image";
import { useEffect, useMemo, useState } from "react";

type GalleryImage = {
  _key?: string;
  url?: string;
  alt?: string;
  caption?: string;
};

type ArticleImageGalleryProps = {
  title?: string;
  images?: GalleryImage[];
};

export function ArticleImageGallery({ title, images = [] }: ArticleImageGalleryProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const safeImages = useMemo(() => images.filter((image) => Boolean(image.url)), [images]);
  const activeImage = activeIndex !== null ? safeImages[activeIndex] : null;

  useEffect(() => {
    if (activeIndex === null) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveIndex(null);
      } else if (event.key === "ArrowRight") {
        setActiveIndex((prev) => {
          if (prev === null || safeImages.length === 0) return prev;
          return (prev + 1) % safeImages.length;
        });
      } else if (event.key === "ArrowLeft") {
        setActiveIndex((prev) => {
          if (prev === null || safeImages.length === 0) return prev;
          return (prev - 1 + safeImages.length) % safeImages.length;
        });
      }
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", onKeyDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevOverflow;
    };
  }, [activeIndex, safeImages.length]);

  if (safeImages.length === 0) return null;

  return (
    <section className="space-y-4">
      {title ? <h3 className="text-2xl font-semibold tracking-tight">{title}</h3> : null}

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {safeImages.map((image, imageIndex) => (
          <button
            key={image._key || `gallery-image-${imageIndex}`}
            type="button"
            onClick={() => setActiveIndex(imageIndex)}
            className="group cursor-pointer space-y-2 text-left"
            aria-label={`Åpne bilde ${imageIndex + 1} i lysboks`}
          >
            <Image
              src={image.url!}
              alt={image.alt || "Galleriillustrasjon"}
              width={1200}
              height={900}
              className="h-auto w-full cursor-pointer object-cover transition-transform duration-300 group-hover:scale-[1.01]"
            />
          </button>
        ))}
      </div>

      {activeImage?.url ? (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Lysboks for bildegalleri"
          className="fixed inset-0 z-[70] bg-black/85 p-4 sm:p-6"
          onClick={() => setActiveIndex(null)}
        >
          <div className="relative mx-auto flex h-full max-w-6xl items-center justify-center">
            <button
              type="button"
              onClick={() => setActiveIndex(null)}
              className="absolute right-0 top-0 z-20 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
            >
              Lukk
            </button>

            {safeImages.length > 1 ? (
              <>
                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveIndex((prev) => {
                      if (prev === null) return prev;
                      return (prev - 1 + safeImages.length) % safeImages.length;
                    });
                  }}
                  className="absolute left-0 z-20 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
                >
                  Forrige
                </button>

                <button
                  type="button"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveIndex((prev) => {
                      if (prev === null) return prev;
                      return (prev + 1) % safeImages.length;
                    });
                  }}
                  className="absolute right-0 z-20 rounded-full bg-white/15 px-4 py-2 text-sm font-medium text-white hover:bg-white/25"
                >
                  Neste
                </button>
              </>
            ) : null}

            <div className="w-full px-8 sm:px-16" onClick={(event) => event.stopPropagation()}>
              <Image
                src={activeImage.url}
                alt={activeImage.alt || "Galleriillustrasjon"}
                width={1800}
                height={1200}
                className="mx-auto h-auto max-h-[75vh] w-auto object-contain"
                priority
              />
              {activeImage.caption ? (
                <p className="mt-4 text-center text-sm text-white/85">{activeImage.caption}</p>
              ) : null}
              <p className="mt-2 text-center text-xs text-white/60">
                {activeIndex! + 1} / {safeImages.length}
              </p>
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
