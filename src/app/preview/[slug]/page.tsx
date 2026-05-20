import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "@/app/components/article/ArticlePage";
import { getPreviewArticleBySlug } from "@/app/lib/articles";
import { getSanityImageUrl } from "@/app/lib/sanity-image";
import { buildSeoMetadata, sanitizeSeoDescription } from "@/app/lib/seo";

type PreviewArticlePageProps = {
  params: Promise<{ slug: string }>;
};

export async function generateMetadata({
  params,
}: PreviewArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPreviewArticleBySlug(slug);

  if (!article) {
    return {
      title: "Preview ikke funnet",
      robots: {
        index: false,
        follow: false,
      },
    };
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
    path: `/preview/${slug}`,
    imageUrl,
    noIndex: true,
  });
}

export default async function PreviewArticlePage({ params }: PreviewArticlePageProps) {
  const { slug } = await params;
  const article = await getPreviewArticleBySlug(slug);

  if (!article) {
    notFound();
  }

  return <ArticlePage article={article} />;
}
