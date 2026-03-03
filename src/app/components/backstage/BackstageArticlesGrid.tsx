"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { BackstageArticleCard } from "@/app/lib/types";

type BackstageArticlesGridProps = {
  initialArticles: BackstageArticleCard[];
  pageSize?: number;
};

const dateFormatter = new Intl.DateTimeFormat("nb-NO", {
  day: "2-digit",
  month: "long",
  year: "numeric",
});

export default function BackstageArticlesGrid({
  initialArticles,
  pageSize = 9,
}: BackstageArticlesGridProps) {
  const [articles, setArticles] = useState<BackstageArticleCard[]>(initialArticles);
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    () => new Set(initialArticles.map((article) => article._id)),
  );
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(initialArticles.length >= pageSize);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedSearch = useRef(false);
  const requestIdRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasActiveFilters = Boolean(debouncedSearch);
  const filterParams = useMemo(
    () => ({
      q: debouncedSearch,
    }),
    [debouncedSearch],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const fetchPage = useCallback(
    async ({ offset, append }: { offset: number; append: boolean }) => {
      const requestId = ++requestIdRef.current;
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(pageSize),
      });
      if (filterParams.q) params.set("q", filterParams.q);

      try {
        const response = await fetch(`/api/backstage?${params.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Unable to fetch backstage articles");
        const payload = (await response.json()) as { articles?: BackstageArticleCard[] };
        const nextArticles = Array.isArray(payload.articles) ? payload.articles : [];
        if (requestId !== requestIdRef.current) return;

        if (append) {
          let appendedIds: string[] = [];
          setArticles((current) => {
            const currentIds = new Set(current.map((article) => article._id));
            const uniqueArticles = nextArticles.filter((article) => !currentIds.has(article._id));
            appendedIds = uniqueArticles.map((article) => article._id);
            return [...current, ...uniqueArticles];
          });
          if (appendedIds.length > 0) {
            requestAnimationFrame(() => {
              setVisibleIds((current) => {
                const updated = new Set(current);
                appendedIds.forEach((id) => updated.add(id));
                return updated;
              });
            });
          }
        } else {
          const nextIds = nextArticles.map((article) => article._id);
          setArticles(nextArticles);
          setVisibleIds(new Set());
          requestAnimationFrame(() => {
            setVisibleIds(new Set(nextIds));
          });
        }

        setHasMore(nextArticles.length >= pageSize);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Kunne ikke hente backstage-artikler akkurat nå.");
        }
      }
    },
    [filterParams, pageSize],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isRefreshing) return;
    setIsLoadingMore(true);
    setError(null);
    await fetchPage({ offset: articles.length, append: true });
    setIsLoadingMore(false);
  }, [articles.length, fetchPage, hasMore, isLoadingMore, isRefreshing]);

  useEffect(() => {
    if (!hasInitializedSearch.current) {
      hasInitializedSearch.current = true;
      return;
    }
    setIsRefreshing(true);
    setError(null);
    void fetchPage({ offset: 0, append: false }).finally(() => {
      setIsRefreshing(false);
    });
  }, [fetchPage]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          void loadMore();
        }
      },
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/80">Søk</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Søk i backstage-artikler"
            className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none transition focus:border-black"
          />
        </label>
      </section>

      {isRefreshing ? (
        <p className="mx-auto mt-4 w-full max-w-6xl text-sm text-black/60">
          Oppdaterer backstage-artikler...
        </p>
      ) : null}

      {articles.length === 0 && !isRefreshing ? (
        <section className="mx-auto mt-6 w-full max-w-6xl bg-gray-100 px-6 py-16 text-center text-black/70">
          {hasActiveFilters
            ? "Ingen backstage-artikler matcher søket ditt."
            : "Ingen backstage-artikler akkurat nå."}
        </section>
      ) : null}

      {articles.length > 0 ? (
        <>
          <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {articles.map((article) => (
              <article
                key={article._id}
                className={`relative aspect-[4/5] w-full overflow-hidden transition-all duration-1000 md:aspect-[3/4] ${
                  visibleIds.has(article._id) ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                {article.heroImageUrl ? (
                  <div
                    className="absolute inset-0 bg-cover bg-center"
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
                  <h2 className="mt-2 text-2xl font-semibold leading-tight">{article.title}</h2>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-white/90">
                    {article.excerpt?.trim() || "Les saken i Backstage."}
                  </p>
                </div>
              </article>
            ))}
          </section>

          <div ref={sentinelRef} className="mx-auto h-8 w-full max-w-6xl" aria-hidden />
        </>
      ) : null}

      {isLoadingMore ? (
        <p className="mx-auto mt-2 w-full max-w-6xl text-center text-sm text-black/60">
          Laster flere artikler...
        </p>
      ) : null}

      {error ? (
        <p className="mx-auto mt-2 w-full max-w-6xl text-center text-sm text-red-700">{error}</p>
      ) : null}
    </>
  );
}
