import type { Metadata } from "next";
import BackstageArticlesGrid from "../components/backstage/BackstageArticlesGrid";
import { getBackstageArticlesPage } from "../lib/articles";

export const metadata: Metadata = {
  title: "Backstage",
};

export default async function BackstagePage() {
  const articles = await getBackstageArticlesPage({ offset: 0, limit: 9 });

  return (
    <main className="min-h-screen bg-white px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Backstage</h1>
        <p className="mt-3 text-black/70">
          Redaksjonelle saker, intervjuer og innsikt fra backstage.
        </p>
      </section>

      <BackstageArticlesGrid initialArticles={articles} pageSize={9} />
    </main>
  );
}
