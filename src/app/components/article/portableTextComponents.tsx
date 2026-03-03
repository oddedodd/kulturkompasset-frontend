import Link from "next/link";
import type { PortableTextComponents } from "@portabletext/react";

export const articlePortableTextComponents: PortableTextComponents = {
  block: {
    normal: ({ children }) => <p className="mb-5 leading-relaxed text-black/90">{children}</p>,
    h1: ({ children }) => (
      <h1 className="mb-5 mt-10 text-4xl font-semibold tracking-tight text-black">{children}</h1>
    ),
    h2: ({ children }) => (
      <h2 className="mb-4 mt-9 text-3xl font-semibold tracking-tight text-black">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mb-4 mt-8 text-2xl font-semibold tracking-tight text-black">{children}</h3>
    ),
    h4: ({ children }) => <h4 className="mb-3 mt-7 text-xl font-semibold text-black">{children}</h4>,
    blockquote: ({ children }) => (
      <blockquote className="my-8 border-l-4 border-black/25 pl-5 text-lg italic text-black/80">
        {children}
      </blockquote>
    ),
  },
  marks: {
    strong: ({ children }) => <strong className="font-semibold text-black">{children}</strong>,
    em: ({ children }) => <em className="italic">{children}</em>,
    link: ({ children, value }) => {
      const href = typeof value?.href === "string" ? value.href : "#";
      const isExternal = href.startsWith("http://") || href.startsWith("https://");

      if (isExternal) {
        return (
          <a
            href={href}
            target="_blank"
            rel="noopener noreferrer"
            className="underline decoration-black/40 underline-offset-4 hover:decoration-black"
          >
            {children}
          </a>
        );
      }

      return (
        <Link
          href={href}
          className="underline decoration-black/40 underline-offset-4 hover:decoration-black"
        >
          {children}
        </Link>
      );
    },
  },
  list: {
    bullet: ({ children }) => <ul className="mb-5 ml-6 list-disc space-y-2">{children}</ul>,
    number: ({ children }) => <ol className="mb-5 ml-6 list-decimal space-y-2">{children}</ol>,
  },
  listItem: {
    bullet: ({ children }) => <li className="leading-relaxed text-black/90">{children}</li>,
    number: ({ children }) => <li className="leading-relaxed text-black/90">{children}</li>,
  },
  hardBreak: () => <br />,
};
