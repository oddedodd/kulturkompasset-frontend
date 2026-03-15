"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { BulletinItem } from "@/app/lib/types";
import BulletinCard from "./BulletinCard";

type BulletinsGridProps = {
  initialBulletins: BulletinItem[];
  pageSize?: number;
};

export default function BulletinsGrid({
  initialBulletins,
  pageSize = 9,
}: BulletinsGridProps) {
  const [bulletins, setBulletins] = useState<BulletinItem[]>(initialBulletins);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(initialBulletins.length >= pageSize);
  const [nextOffset, setNextOffset] = useState(initialBulletins.length);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedSearch = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const fetchPage = useCallback(
    async (offset: number): Promise<BulletinItem[]> => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(pageSize),
      });
      if (debouncedSearch) params.set("q", debouncedSearch);

      const response = await fetch(`/api/bulletin?${params.toString()}`, {
        cache: "no-store",
      });
      if (!response.ok) {
        throw new Error("Unable to fetch bulletins");
      }
      const payload = (await response.json()) as { bulletins?: BulletinItem[] };
      return Array.isArray(payload.bulletins) ? payload.bulletins : [];
    },
    [debouncedSearch, pageSize],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isRefreshing) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const nextBatch = await fetchPage(nextOffset);
      setBulletins((current) => [...current, ...nextBatch]);
      setNextOffset((current) => current + nextBatch.length);
      setHasMore(nextBatch.length >= pageSize);
    } catch {
      setError("Kunne ikke hente bulletiner akkurat nå.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPage, hasMore, isLoadingMore, isRefreshing, nextOffset, pageSize]);

  useEffect(() => {
    if (!hasInitializedSearch.current) {
      hasInitializedSearch.current = true;
      return;
    }

    setIsRefreshing(true);
    setError(null);
    void fetchPage(0)
      .then((nextBatch) => {
        setBulletins(nextBatch);
        setNextOffset(nextBatch.length);
        setHasMore(nextBatch.length >= pageSize);
      })
      .catch(() => {
        setError("Kunne ikke hente bulletiner akkurat nå.");
        setBulletins([]);
        setNextOffset(0);
        setHasMore(false);
      })
      .finally(() => {
        setIsRefreshing(false);
      });
  }, [fetchPage, pageSize]);

  useEffect(() => {
    const target = sentinelRef.current;
    if (!target) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          void loadMore();
        }
      },
      { rootMargin: "240px 0px" },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <section className="mx-auto mt-8 w-full max-w-6xl">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/80">Søk</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Søk i oppslagstavla"
            className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none transition focus:border-black"
          />
        </label>
      </section>

      {isRefreshing ? (
        <p className="mx-auto mt-4 w-full max-w-6xl text-sm text-black/60">
          Oppdaterer bulletin...
        </p>
      ) : null}

      {bulletins.length === 0 && !isRefreshing ? (
        <section className="mx-auto mt-6 w-full max-w-6xl rounded-2xl bg-gray-100 px-6 py-16 text-center text-black/70">
          {debouncedSearch
            ? "Ingen bulletiner matcher søket ditt."
            : "Ingen bulletiner akkurat nå."}
        </section>
      ) : null}

      {bulletins.length > 0 ? (
        <>
          <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {bulletins.map((bulletin) => (
              <div
                key={bulletin._id}
                className="transition-all duration-700 translate-y-0 opacity-100"
              >
                <BulletinCard bulletin={bulletin} />
              </div>
            ))}
          </section>

          {hasMore && !isRefreshing ? (
            <div className="mx-auto mt-6 flex w-full max-w-6xl justify-center">
              <button
                type="button"
                onClick={() => {
                  void loadMore();
                }}
                disabled={isLoadingMore}
                className="rounded-full border border-black/20 px-5 py-2 text-sm font-medium text-black transition hover:border-black disabled:cursor-not-allowed disabled:opacity-60"
              >
                {isLoadingMore ? "Laster flere bulletiner..." : "Last inn flere bulletiner"}
              </button>
            </div>
          ) : null}

          <div
            ref={sentinelRef}
            className="mx-auto h-8 w-full max-w-6xl"
            aria-hidden
          />
        </>
      ) : null}

      {isLoadingMore ? (
        <p className="mx-auto mt-2 w-full max-w-6xl text-center text-sm text-black/60">
          Laster flere bulletiner...
        </p>
      ) : null}

      {error ? (
        <p className="mx-auto mt-2 w-full max-w-6xl text-center text-sm text-red-700">
          {error}
        </p>
      ) : null}
    </>
  );
}
