// Header med hamburger-knapp (styrer overlay-menyen)

"use client";

import { useState } from "react";
import { MenuButton } from "../menu/MenuButton";
import { MenuOverlay } from "../menu/MenuOverlay";

export function SiteHeader() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggle = () => setIsMenuOpen((v) => !v);
  const close = () => setIsMenuOpen(false);

  return (
    <>
      <header className="absolute left-0 right-0 top-0 z-40">
        <div className="mx-auto flex max-w-5xl items-center justify-end px-4 py-4">
          <MenuButton isOpen={isMenuOpen} onToggle={toggle} />
        </div>
      </header>

      <MenuOverlay isOpen={isMenuOpen} onClose={close} />
    </>
  );
}
