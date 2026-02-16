import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBuilderRenderer } from "../../components/article/PageBuilderRenderer";
import { articlePortableTextComponents } from "../../components/article/portableTextComponents";
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

  const startsWithHeroBlock = article.pageBuilder?.[0]?._type === "heroBlock";
  const firstAuthor = article.authors?.find((author) => typeof author?.name === "string");
  const remainingBlocks = startsWithHeroBlock ? (article.pageBuilder?.slice(1) ?? []) : (article.pageBuilder ?? []);

  const ArticleMeta = (
    <section className="mx-auto mt-8 flex max-w-3xl flex-col items-center text-center">
      {article.publishedAt ? (
        <p className="text-sm font-medium uppercase tracking-wide text-black/55">
          {dateFormatter.format(new Date(article.publishedAt))}
        </p>
      ) : null}

      {firstAuthor ? (
        <div className="mt-4 flex items-center gap-3">
          {firstAuthor.imageUrl ? (
            <Image
              src={firstAuthor.imageUrl}
              alt={firstAuthor.imageAlt || firstAuthor.name || "Forfatter"}
              width={48}
              height={48}
              className="h-12 w-12 rounded-full object-cover"
            />
          ) : (
            <div className="h-12 w-12 rounded-full bg-black/10" aria-hidden />
          )}
          <p className="text-base font-medium text-black/75">{firstAuthor.name}</p>
        </div>
      ) : null}
    </section>
  );

  return (
    <main className="min-h-screen bg-white px-6 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl">
        <Link href="/backstage" className="text-sm text-black/60 hover:text-black">
          Tilbake til Backstage
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

        {!startsWithHeroBlock && article.heroImageUrl ? (
          <Image
            src={article.heroImageUrl}
            alt={article.heroImageAlt || article.title}
            width={1600}
            height={900}
            className="mt-8 h-auto w-full object-cover"
          />
        ) : null}

        {startsWithHeroBlock && article.pageBuilder && article.pageBuilder.length > 0 ? (
          <PageBuilderRenderer blocks={article.pageBuilder.slice(0, 1)} useHeroAsPageTitle />
        ) : null}

        {ArticleMeta}

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
