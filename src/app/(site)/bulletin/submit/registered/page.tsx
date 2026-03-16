import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Arrangement registrert",
};

export default function BulletinRegisteredPage() {
  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-2xl rounded-2xl bg-white p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Ditt arrangement er registrert
        </h1>

        <Link
          href="/"
          className="mt-8 inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
        >
          Tilbake til hovedsiden
        </Link>
      </section>
    </main>
  );
}
