import { SiteHeader } from "@/app/components/header/SiteHeader";
import { MainPartnerHighlight } from "@/app/components/home/MainPartnerHighlight";
import { getHomePartners } from "@/app/lib/home-partner";
import { getMainNavigation } from "@/app/lib/navigation";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const [navItems, homePartners] = await Promise.all([
    getMainNavigation(),
    getHomePartners(),
  ]);

  return (
    <>
      <SiteHeader navItems={navItems} />
      <MainPartnerHighlight partners={homePartners} />
      {children}
    </>
  );
}
