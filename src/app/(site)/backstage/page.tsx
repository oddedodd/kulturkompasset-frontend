import type { Metadata } from "next";
import BackstageArticlesGrid from "@/app/components/backstage/BackstageArticlesGrid";
import { getBackstageArticlesPage } from "@/app/lib/articles";

export const metadata: Metadata = {
  title: "Historier",
};

export default async function BackstagePage() {
  const articles = await getBackstageArticlesPage({ offset: 0, limit: 9 });

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Historier</h1>
        <p className="mt-3 text-black/70">
        Møt noen av menneskene som på en eller annen måte har satt Namdalen på det kulturelle kartet.
        </p>
      </section>

      <BackstageArticlesGrid initialArticles={articles} pageSize={9} />
    </main>
  );
}
