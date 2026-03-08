import type { Metadata } from "next";
import VenueCard from "../components/venues/VenueCard";
import { getVenues } from "../lib/venues";

export const metadata: Metadata = {
  title: "Steder",
};

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Steder</h1>
        <p className="mt-3 text-black/70">Utforsk scener og kulturarenaer i regionen.</p>
      </section>

      {venues.length === 0 ? (
        <section className="mx-auto mt-8 w-full max-w-6xl rounded-2xl bg-gray-100 px-6 py-16 text-center text-black/70">
          Ingen steder funnet akkurat nå.
        </section>
      ) : (
        <section className="mx-auto mt-8 grid w-full max-w-6xl grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
          {venues.map((venue) => (
            <VenueCard key={venue._id} venue={venue} />
          ))}
        </section>
      )}
    </main>
  );
}
