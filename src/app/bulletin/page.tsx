import type { Metadata } from "next";
import Link from "next/link";
import BulletinsGrid from "../components/bulletin/BulletinsGrid";
import { getBulletinsPage } from "../lib/bulletins";

export const metadata: Metadata = {
  title: "Oppslagstavla",
};

export const revalidate = 3600;

export default async function BulletinPage() {
  const bulletins = await getBulletinsPage({ offset: 0, limit: 9 });

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-6xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-semibold tracking-tight">Oppslagstavla</h1>
            <p className="mt-3 text-black/70">Arrangementer sendt inn av brukere.</p>
          </div>
          <Link
            href="/bulletin/submit"
            className="inline-flex rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80"
          >
            Send inn ditt arrangement
          </Link>
        </div>
      </section>

      <section className="mx-auto mt-8 w-full max-w-6xl">
        <BulletinsGrid initialBulletins={bulletins} pageSize={9} />
      </section>
    </main>
  );
}
