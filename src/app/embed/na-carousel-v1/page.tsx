import type { Metadata } from "next";
import { NewspaperEmbedCarousel } from "@/app/components/embed/NewspaperEmbedCarousel";
import { getMainHomePartner } from "@/app/lib/home-partner";
import { getNewspaperEmbedCarouselItems } from "@/app/lib/newspaper-embed";

export const dynamic = "force-static";
export const revalidate = 300;

export const metadata: Metadata = {
  title: "Namdalsavisa karusell",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewspaperCarouselEmbedPage() {
  const [items, partner] = await Promise.all([
    getNewspaperEmbedCarouselItems(),
    getMainHomePartner(),
  ]);

  return (
    <main className="min-h-screen bg-[#fbfaf8]">
      <NewspaperEmbedCarousel items={items} partner={partner} />
    </main>
  );
}
