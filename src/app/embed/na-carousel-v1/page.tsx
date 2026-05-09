import type { Metadata } from "next";
import { NewspaperEmbedCarousel } from "@/app/components/embed/NewspaperEmbedCarousel";
import { getNewspaperEmbedCarouselItems } from "@/app/lib/newspaper-embed";

export const metadata: Metadata = {
  title: "Namdalsavisa karusell",
  robots: {
    index: false,
    follow: false,
  },
};

export default async function NewspaperCarouselEmbedPage() {
  const items = await getNewspaperEmbedCarouselItems();

  return (
    <main className="min-h-screen bg-[#fff6d7]">
      <NewspaperEmbedCarousel items={items} />
    </main>
  );
}
