// components/menu/MenuButton.tsx
// Hamburger-knapp som toggler menyen

"use client";

import Image from "next/image";

type MenuButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function MenuButton({ isOpen, onToggle }: MenuButtonProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isOpen ? "Lukk meny" : "Åpne meny"}
      aria-expanded={isOpen}
      className="inline-flex h-11 w-11 cursor-pointer items-center justify-center focus:outline-none"
    >
      <span className="sr-only">{isOpen ? "Lukk" : "Meny"}</span>
      <Image
        src={isOpen ? "/menu_close.svg" : "/menu_open.svg"}
        alt=""
        aria-hidden="true"
        width={38}
        height={38}
        className="h-9 w-9"
      />
    </button>
  );
}
