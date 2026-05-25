import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/app/components/article/ArticlePage";
import { ContributionPromptPopup } from "@/app/components/contribution/ContributionPromptPopup";
import { getBackstageArticleBySlug } from "@/app/lib/articles";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";

type BackstageArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: BackstageArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getBackstageArticleBySlug(slug);

  if (!article) {
    return { title: "Artikkel ikke funnet" };
  }

  const seoDescription = sanitizeSeoDescription(article.seo?.metaDescription);
  const defaultDescription = sanitizeSeoDescription(article.excerpt);
  const description = seoDescription || defaultDescription;
  const seoOgImageUrl =
    getSanityImageUrl(article.seo?.ogImage, {
      width: 1200,
      height: 630,
    }) || article.seo?.ogImageUrl;
  const defaultOgImageUrl =
    getSanityImageUrl(article.heroImage, {
      width: 1200,
      height: 630,
    }) || article.heroImageUrl;
  const imageUrl = seoOgImageUrl || defaultOgImageUrl;
  const title = article.seo?.metaTitle?.trim() || article.title;

  return buildSeoMetadata({
    title,
    description,
    path: `/backstage/${slug}`,
    imageUrl,
    noIndex: article.seo?.noIndex,
  });
}

export default async function BackstageArticlePage({ params }: BackstageArticlePageProps) {
  const { slug } = await params;
  const article = await getBackstageArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return (
    <>
      <ArticlePage article={article} backLink={{ href: "/backstage", label: "Tilbake til Historier" }} />
      <ContributionPromptPopup />
    </>
  );
}
