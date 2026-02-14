import Link from "next/link";
import type { BackstageArticleCard } from "../../lib/types";

type LatestBackstageArticlesGridProps = {
  articles: BackstageArticleCard[];
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export function LatestBackstageArticlesGrid({ articles }: LatestBackstageArticlesGridProps) {
  if (articles.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto mt-12 w-full max-w-6xl px-4 pb-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <h2 className="text-2xl font-semibold tracking-tight sm:text-3xl">Siste fra Backstage</h2>
        <Link
          href="/backstage"
          className="text-sm font-medium text-black/70 underline underline-offset-4 hover:text-black"
        >
          Se alle
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
        {articles.map((article) => (
          <article
            key={article._id}
            className="relative aspect-[4/5] w-full overflow-hidden rounded-2xl md:aspect-[3/4]"
          >
            {article.heroImageUrl ? (
              <div
                className="absolute inset-0 bg-cover bg-center transition-transform duration-300"
                style={{ backgroundImage: `url(${article.heroImageUrl})` }}
                aria-hidden
              />
            ) : (
              <div className="absolute inset-0 bg-gray-300" aria-hidden />
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/45 to-black/20" />

            <Link
              href={`/backstage/${article.slug}`}
              aria-label={`Åpne artikkel: ${article.title}`}
              className="absolute inset-0 z-10"
            />

            <div className="pointer-events-none relative z-20 flex h-full flex-col justify-end p-5 text-white sm:p-6">
              {article.publishedAt ? (
                <p className="text-xs font-medium uppercase tracking-wide text-white/80">
                  {dateFormatter.format(new Date(article.publishedAt))}
                </p>
              ) : null}
              <h3 className="mt-2 text-2xl font-semibold leading-tight">{article.title}</h3>
              <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/90">
                {article.excerpt?.trim() || "Les saken i Backstage."}
              </p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
