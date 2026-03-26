import { PortableText } from "@portabletext/react";
import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PageBuilderRenderer } from "@/app/components/article/PageBuilderRenderer";
import { articlePortableTextComponents } from "@/app/components/article/portableTextComponents";
import { articleBySlugQuery } from "@/app/lib/queries";
import { sanityClient } from "@/app/lib/sanity.client";
import type { BackstageArticleDetail } from "@/app/lib/types";

const OM_SLUG = "om-kulturkompasset";

async function getOmArticle() {
  return sanityClient.fetch<BackstageArticleDetail | null>(articleBySlugQuery, {
    slug: OM_SLUG,
  });
}

export async function generateMetadata(): Promise<Metadata> {
  const article = await getOmArticle();

  return {
    title: article?.title || "Om",
    description: article?.excerpt || article?.subtitle || undefined,
  };
}

export default async function OmPage() {
  const article = await getOmArticle();

  if (!article) {
    notFound();
  }

  const articleBody = article.body ?? [];
  const hasPageBuilder = Array.isArray(article.pageBuilder) && article.pageBuilder.length > 0;
  const hasBody = articleBody.length > 0;

  return (
    <main className="min-h-screen bg-white px-6 py-16 sm:py-24">
      <article className="mx-auto max-w-4xl">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm text-black/60 hover:text-black"
        >
          <span aria-hidden>←</span> Tilbake til forsiden
        </Link>

        <h1 className="mt-6 text-4xl font-semibold tracking-tight sm:text-5xl">{article.title}</h1>
        {article.subtitle ? (
          <p className="mt-3 text-xl leading-relaxed text-black/75">{article.subtitle}</p>
        ) : null}

        {hasPageBuilder ? (
          <PageBuilderRenderer blocks={article.pageBuilder!} />
        ) : hasBody ? (
          <section className="prose prose-neutral mt-10 max-w-none">
            <PortableText value={articleBody} components={articlePortableTextComponents} />
          </section>
        ) : (
          <p className="mt-10 text-black/65">Innhold kommer snart.</p>
        )}
      </article>
    </main>
  );
}
