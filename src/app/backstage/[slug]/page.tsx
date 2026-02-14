import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getBackstageArticleBySlug } from "../../lib/articles";

type BackstageArticlePageProps = {
  params: Promise<{ slug: string }>;
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export async function generateMetadata({
  params,
}: BackstageArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBackstageArticleBySlug(slug);

  if (!article) {
    return { title: "Artikkel ikke funnet" };
  }

  return {
    title: article.title,
    description: article.excerpt || article.subtitle || undefined,
  };
}

export default async function BackstageArticlePage({ params }: BackstageArticlePageProps) {
  const { slug } = await params;
  const article = await getBackstageArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white px-6 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl">
        <Link href="/backstage" className="text-sm text-black/60 hover:text-black">
          Tilbake til Backstage
        </Link>

        {article.publishedAt ? (
          <p className="mt-6 text-sm font-medium uppercase tracking-wide text-black/55">
            {dateFormatter.format(new Date(article.publishedAt))}
          </p>
        ) : null}

        <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>

        {article.subtitle ? (
          <p className="mt-3 text-xl leading-relaxed text-black/75">{article.subtitle}</p>
        ) : null}

        {article.heroImageUrl ? (
          <Image
            src={article.heroImageUrl}
            alt={article.heroImageAlt || article.title}
            width={1600}
            height={900}
            className="mt-8 h-auto w-full rounded-2xl object-cover"
          />
        ) : null}

        {article.excerpt ? (
          <p className="mt-8 text-lg leading-relaxed text-black/85">{article.excerpt}</p>
        ) : null}

        {article.body && article.body.length > 0 ? (
          <section className="prose prose-neutral mt-10 max-w-none">
            <PortableText value={article.body} />
          </section>
        ) : (
          <p className="mt-10 text-black/65">Artikkelinnhold kommer snart.</p>
        )}
      </article>
    </main>
  );
}
