import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Spillelister",
};

export default function SpillelisterPage() {
  return (
    <main className="min-h-screen bg-white px-6 py-24">
      <div className="mx-auto max-w-4xl">
        <h1 className="text-4xl font-semibold tracking-tight">Spillelister</h1>
        <p className="mt-4 text-base text-black/70">
          Her kommer spillelister og anbefalinger fra Sanity.
        </p>
      </div>
    </main>
  );
}
