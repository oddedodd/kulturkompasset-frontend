import { SiteHeader } from "@/app/components/header/SiteHeader";
import { getMainNavigation } from "@/app/lib/navigation";

export default async function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const navItems = await getMainNavigation();

  return (
    <>
      <SiteHeader navItems={navItems} />
      {children}
    </>
  );
}
