"use client";

import { useEffect, useMemo, useState } from "react";
import type { VenueListItem } from "@/app/lib/types";
import VenueCard from "./VenueCard";

type VenuesGridProps = {
  venues: VenueListItem[];
};

export default function VenuesGrid({ venues }: VenuesGridProps) {
  const [searchInput, setSearchInput] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [selectedCity, setSelectedCity] = useState("");

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      setDebouncedSearch(searchInput.trim());
    }, 300);

    return () => window.clearTimeout(timeout);
  }, [searchInput]);

  const cityOptions = useMemo(() => {
    const uniqueCities = Array.from(
      new Set(venues.map((venue) => venue.city?.trim()).filter((city): city is string => Boolean(city))),
    );

    return uniqueCities.sort((a, b) => a.localeCompare(b, "nb"));
  }, [venues]);

  const filteredVenues = useMemo(() => {
    const normalizedSearch = normalizeText(debouncedSearch);

    return venues.filter((venue) => {
      if (selectedCity && venue.city !== selectedCity) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      const searchable = normalizeText(
        [venue.name, venue.city, venue.address].filter(Boolean).join(" "),
      );

      return searchable.includes(normalizedSearch);
    });
  }, [debouncedSearch, selectedCity, venues]);

  const hasActiveFilters = Boolean(debouncedSearch || selectedCity);

  return (
    <>
      <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-3 md:grid-cols-2">
        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/80">Søk</span>
          <input
            type="search"
            value={searchInput}
            onChange={(event) => setSearchInput(event.target.value)}
            placeholder="Søk i steder"
            className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none transition focus:border-black"
          />
        </label>

        <label className="flex flex-col gap-1 text-sm">
          <span className="font-medium text-black/80">By eller tettsted</span>
          <select
            value={selectedCity}
            onChange={(event) => setSelectedCity(event.target.value)}
            className="h-11 rounded-lg border border-black/20 bg-white px-3 outline-none transition focus:border-black"
          >
            <option value="">Alle steder</option>
            {cityOptions.map((city) => (
              <option key={city} value={city}>
                {city}
              </option>
            ))}
          </select>
        </label>
      </section>

      {filteredVenues.length === 0 ? (
        <section className="mx-auto mt-8 w-full max-w-6xl rounded-2xl bg-gray-100 px-6 py-16 text-center text-black/70">
          {hasActiveFilters ? "Ingen steder matcher filtrene dine." : "Ingen steder funnet akkurat nå."}
        </section>
      ) : (
        <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {filteredVenues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </section>
      )}
    </>
  );
}

function normalizeText(value: string): string {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}
