import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Barn og familie",
};

export default function BarnOgFamiliePage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight">Barn og familie</h1>
        <p className="mt-4 text-base text-black/70">
          Her kommer innhold for barn og familie fra Sanity.
        </p>
      </div>
    </main>
  );
}
