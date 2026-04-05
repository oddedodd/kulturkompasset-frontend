"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { CalendarEvent } from "@/app/lib/types";
import EventCard from "./EventCard";

type CalendarEventsGridProps = {
  initialEvents: CalendarEvent[];
  venueOptions: string[];
  pageSize?: number;
};

export default function CalendarEventsGrid({
  initialEvents,
  venueOptions,
  pageSize = 9,
}: CalendarEventsGridProps) {
  const [events, setEvents] = useState<CalendarEvent[]>(initialEvents);
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.length >= pageSize);
  const [nextOffset, setNextOffset] = useState(initialEvents.length);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedFilters = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasActiveFilters = Boolean(
    debouncedSearch || selectedVenue || selectedDate,
  );
  const filterParams = useMemo(
    () => ({
      q: debouncedSearch,
      venue: selectedVenue,
      date: selectedDate,
    }),
    [debouncedSearch, selectedDate, selectedVenue],
  );

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const fetchPage = useCallback(
    async (offset: number): Promise<CalendarEvent[]> => {
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(pageSize),
      });
      if (filterParams.q) params.set("q", filterParams.q);
      if (filterParams.venue) params.set("venue", filterParams.venue);
      if (filterParams.date) params.set("date", filterParams.date);

      const response = await fetch(`/api/events?${params.toString()}`);
      if (!response.ok) {
        throw new Error("Unable to fetch events");
      }
      const payload = (await response.json()) as { events?: CalendarEvent[] };
      return Array.isArray(payload.events) ? payload.events : [];
    },
    [filterParams, pageSize],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isRefreshing) return;

    setIsLoadingMore(true);
    setError(null);
    try {
      const [nextEvents] = await Promise.all([
        fetchPage(nextOffset),
        wait(800),
      ]);
      setEvents((current) => [...current, ...nextEvents]);
      setNextOffset((current) => current + nextEvents.length);
      setHasMore(nextEvents.length >= pageSize);
    } catch {
      setError("Kunne ikke hente arrangement akkurat nå.");
    } finally {
      setIsLoadingMore(false);
    }
  }, [fetchPage, hasMore, isLoadingMore, isRefreshing, nextOffset, pageSize]);

  useEffect(() => {
    if (!hasInitializedFilters.current) {
      hasInitializedFilters.current = true;
      return;
    }

    setIsRefreshing(true);
    setError(null);
    void fetchPage(0)
      .then((nextEvents) => {
        setEvents(nextEvents);
        setNextOffset(nextEvents.length);
        setHasMore(nextEvents.length >= pageSize);
      })
      .catch(() => {
        setError("Kunne ikke hente arrangement akkurat nå.");
        setEvents([]);
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
      {
        rootMargin: "240px 0px",
      },
    );

    observer.observe(target);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <>
      <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-3">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/80">Søk</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Søk i kommende arrangement"
            className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none transition focus:border-black"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/80">Sted</span>
          <select
            value={selectedVenue}
            onChange={(event) => setSelectedVenue(event.target.value)}
            className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none transition focus:border-black"
          >
            <option value="">Alle steder</option>
            {venueOptions.map((venue) => (
              <option key={venue} value={venue}>
                {venue}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/80">Dato</span>
          <input
            type="date"
            value={selectedDate}
            onChange={(event) => setSelectedDate(event.target.value)}
            className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none transition focus:border-black"
          />
          {selectedDate ? (
            <button
              type="button"
              onClick={() => setSelectedDate("")}
              className="mt-1 w-fit text-xs font-medium text-black/65 underline underline-offset-4 hover:text-black"
            >
              Fjern valgt dato
            </button>
          ) : null}
        </label>
      </section>

      {isRefreshing ? (
        <p className="mx-auto mt-4 w-full max-w-6xl text-sm text-black/60">
          Oppdaterer arrangement...
        </p>
      ) : null}

      {events.length === 0 && !isRefreshing ? (
        <section className="mx-auto mt-6 w-full max-w-6xl rounded-2xl bg-gray-100 px-6 py-16 text-center text-black/70">
          {hasActiveFilters
            ? "Ingen kommende arrangement matcher filtrene dine."
            : "Ingen kommende arrangement akkurat nå."}
        </section>
      ) : null}

      {selectedDate && events.length > 0 && !isRefreshing ? (
        <p className="mx-auto mt-4 w-full max-w-6xl text-sm text-black/60">
          Viser treff for valgt dato først, deretter nærmeste kommende
          arrangement.
        </p>
      ) : null}

      {events.length > 0 ? (
        <>
          <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className="transition-all duration-700 translate-y-0 opacity-100"
              >
                <EventCard event={event} />
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
                {isLoadingMore
                  ? "Laster flere arrangement..."
                  : "Last inn flere arrangementer"}
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
          Laster flere arrangement...
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

function wait(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms);
  });
}
