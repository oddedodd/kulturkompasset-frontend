import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Preview",
  robots: {
    index: false,
    follow: false,
    googleBot: {
      index: false,
      follow: false,
    },
  },
};

export default function PreviewPage() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f8f7f4] px-6 text-center">
      <h1 className="max-w-2xl text-4xl font-semibold tracking-tight text-[#312821] sm:text-6xl">
        This is not the page you are looking for.
      </h1>
    </main>
  );
}
