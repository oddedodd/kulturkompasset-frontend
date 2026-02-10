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
  const [visibleIds, setVisibleIds] = useState<Set<string>>(
    () => new Set(initialEvents.map((event) => event._id)),
  );
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedVenue, setSelectedVenue] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [hasMore, setHasMore] = useState(initialEvents.length >= pageSize);
  const [error, setError] = useState<string | null>(null);
  const hasInitializedFilters = useRef(false);
  const requestIdRef = useRef(0);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  const hasActiveFilters = Boolean(debouncedSearch || selectedVenue || selectedDate);
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
    async ({ offset, append }: { offset: number; append: boolean }) => {
      const requestId = ++requestIdRef.current;
      const params = new URLSearchParams({
        offset: String(offset),
        limit: String(pageSize),
      });
      if (filterParams.q) params.set("q", filterParams.q);
      if (filterParams.venue) params.set("venue", filterParams.venue);
      if (filterParams.date) params.set("date", filterParams.date);

      try {
        const response = await fetch(`/api/events?${params.toString()}`, {
          cache: "no-store",
        });
        if (!response.ok) throw new Error("Unable to fetch events");
        const payload = (await response.json()) as { events?: CalendarEvent[] };
        const nextEvents = Array.isArray(payload.events) ? payload.events : [];
        if (requestId !== requestIdRef.current) return;

        if (append) {
          let appendedIds: string[] = [];
          setEvents((current) => {
            const currentIds = new Set(current.map((event) => event._id));
            const uniqueEvents = nextEvents.filter((event) => !currentIds.has(event._id));
            appendedIds = uniqueEvents.map((event) => event._id);
            return [...current, ...uniqueEvents];
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
          const nextIds = nextEvents.map((event) => event._id);
          setEvents(nextEvents);
          setVisibleIds(new Set());
          requestAnimationFrame(() => {
            setVisibleIds(new Set(nextIds));
          });
        }

        setHasMore(nextEvents.length >= pageSize);
      } catch {
        if (requestId === requestIdRef.current) {
          setError("Kunne ikke hente arrangement akkurat nå.");
        }
      }
    },
    [filterParams, pageSize],
  );

  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || isRefreshing) return;
    setIsLoadingMore(true);
    setError(null);
    await fetchPage({ offset: events.length, append: true });
    setIsLoadingMore(false);
  }, [events.length, fetchPage, hasMore, isLoadingMore, isRefreshing]);

  useEffect(() => {
    if (!hasInitializedFilters.current) {
      hasInitializedFilters.current = true;
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
          Viser treff for valgt dato først, deretter nærmeste kommende arrangement.
        </p>
      ) : null}

      {events.length > 0 ? (
        <>
          <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {events.map((event) => (
              <div
                key={event._id}
                className={`transition-all duration-1000 ${
                  visibleIds.has(event._id) ? "translate-y-0 opacity-100" : "translate-y-3 opacity-0"
                }`}
              >
                <EventCard event={event} />
              </div>
            ))}
          </section>

          <div ref={sentinelRef} className="mx-auto h-8 w-full max-w-6xl" aria-hidden />
        </>
      ) : null}

      {isLoadingMore ? (
        <p className="mx-auto mt-2 w-full max-w-6xl text-center text-sm text-black/60">
          Laster flere arrangement...
        </p>
      ) : null}

      {error ? (
        <p className="mx-auto mt-2 w-full max-w-6xl text-center text-sm text-red-700">{error}</p>
      ) : null}
    </>
  );
}
