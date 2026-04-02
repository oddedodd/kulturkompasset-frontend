import type { Metadata } from "next";
import VenuesGrid from "@/app/components/venues/VenuesGrid";
import { getVenues } from "@/app/lib/venues";

export const metadata: Metadata = {
  title: "Spillesteder",
};

export default async function VenuesPage() {
  const venues = await getVenues();

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <h1 className="text-4xl font-semibold tracking-tight">Spillesteder</h1>
        <p className="mt-3 text-black/70">Ingen scene for stor eller for liten – her ser du den stadig voksende listen over Namdalens kultur-rom.</p>
      </section>

      <VenuesGrid venues={venues} />
    </main>
  );
}
