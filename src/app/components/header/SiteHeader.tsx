// Header med hamburger-knapp (styrer overlay-menyen)

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { NavItem } from "../../lib/types";
import { MenuButton } from "../menu/MenuButton";
import { MenuOverlay } from "../menu/MenuOverlay";

type SiteHeaderProps = {
  navItems: NavItem[];
};

export function SiteHeader({ navItems }: SiteHeaderProps) {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggle = () => setIsMenuOpen((v) => !v);
  const close = () => setIsMenuOpen(false);

  return (
    <>
      <header className="relative z-40">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4">
          <Link href="/" className="flex items-center" aria-label="Gå til forsiden">
            <Image
              src="/logo01.svg"
              alt="KulturKompasset"
              width={1106}
              height={145}
              className="h-7 w-auto"
              priority
            />
          </Link>
          <MenuButton isOpen={isMenuOpen} onToggle={toggle} />
        </div>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={close} navItems={navItems} />
    </>
  );
}
