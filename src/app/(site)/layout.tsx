import { SiteFooter } from "@/app/components/footer/SiteFooter";
import { SiteHeader } from "@/app/components/header/SiteHeader";
import { MainPartnerHighlight } from "@/app/components/home/MainPartnerHighlight";
import { SponsorsCarousel } from "@/app/components/sponsors/SponsorsCarousel";
import { getHomePartners } from "@/app/lib/home-partner";
import { getMainNavigation } from "@/app/lib/navigation";
import { getAllSponsors } from "@/app/lib/sponsors";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navItems, homePartners, sponsors] = await Promise.all([
    getMainNavigation(),
    getHomePartners(),
    getAllSponsors(),
  ]);

  return (
    <>
      <SiteHeader navItems={navItems} />
      <MainPartnerHighlight partners={homePartners} compact />
      {children}
      <SponsorsCarousel sponsors={sponsors} />
      <SiteFooter />
    </>
  );
}
