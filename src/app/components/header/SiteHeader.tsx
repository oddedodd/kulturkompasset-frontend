// Header med hamburger-knapp (styrer overlay-menyen)

"use client";

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
      <header className="absolute left-0 right-0 top-0 z-40">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4">
          <Link
            href="/"
            className="text-xl font-medium tracking-wide"
            aria-label="Gå til forsiden"
          >
            KulturKompasset
          </Link>
          <MenuButton isOpen={isMenuOpen} onToggle={toggle} />
        </div>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={close} navItems={navItems} />
    </>
  );
}
