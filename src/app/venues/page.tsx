import type { Metadata } from "next";
import VenuesGrid from "../components/venues/VenuesGrid";
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

      <VenuesGrid venues={venues} />
    </main>
  );
}
