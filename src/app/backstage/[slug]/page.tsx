import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBuilderRenderer } from "../../components/article/PageBuilderRenderer";
import { articlePortableTextComponents } from "../../components/article/portableTextComponents";
import { getBackstageArticleBySlug } from "../../lib/articles";
import { getSanityImageUrl } from "../../lib/sanity-image";

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

  const startsWithHeroBlock = article.pageBuilder?.[0]?._type === "heroBlock";
  const articleHeroImageUrl =
    getSanityImageUrl(article.heroImage, {
      width: 1600,
      height: 900,
    }) || article.heroImageUrl;
  const remainingBlocks = startsWithHeroBlock ? (article.pageBuilder?.slice(1) ?? []) : (article.pageBuilder ?? []);

  return (
    <main className="min-h-screen bg-white px-6 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/backstage"
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black"
        >
          <span aria-hidden>←</span> Tilbake til Historier
        </Link>

        {!startsWithHeroBlock ? (
          <>
            <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">
              {article.title}
            </h1>
            {article.subtitle ? (
              <p className="mt-3 text-xl leading-relaxed text-black/75">{article.subtitle}</p>
            ) : null}
          </>
        ) : null}

        {!startsWithHeroBlock && articleHeroImageUrl ? (
          <Image
            src={articleHeroImageUrl}
            alt={article.heroImageAlt || article.title}
            width={1600}
            height={900}
            className="mt-8 h-auto w-full rounded-2xl object-cover sm:rounded-3xl"
          />
        ) : null}

        {startsWithHeroBlock && article.pageBuilder && article.pageBuilder.length > 0 ? (
          <PageBuilderRenderer blocks={article.pageBuilder.slice(0, 1)} useHeroAsPageTitle />
        ) : null}

        {article.publishedAt ? (
          <section className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
            <p className="text-sm font-medium uppercase tracking-wide text-black/55">
              {dateFormatter.format(new Date(article.publishedAt))}
            </p>
          </section>
        ) : null}

        {remainingBlocks.length > 0 ? (
          <PageBuilderRenderer blocks={remainingBlocks} />
        ) : article.body && article.body.length > 0 ? (
          <section className="prose prose-neutral mt-10 max-w-none">
            <PortableText value={article.body} components={articlePortableTextComponents} />
          </section>
        ) : (
          <p className="mt-10 text-black/65">Artikkelinnhold kommer snart.</p>
        )}
      </article>
    </main>
  );
}
