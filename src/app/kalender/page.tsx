import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Kalender",
};

export default function KalenderPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight">Kalender</h1>
        <p className="mt-4 text-base text-black/70">
          Her kommer kalenderinnhold fra Sanity.
        </p>
      </div>
    </main>
  );
}
