// components/menu/MenuButton.tsx
// Hamburger-knapp som toggler menyen

"use client";

import { Menu, X } from "lucide-react";

type MenuButtonProps = {
  isOpen: boolean;
  onToggle: () => void;
};

export function MenuButton({ isOpen, onToggle }: MenuButtonProps) {
  return (
    <a
      role="button"
      tabIndex={0}
      onClick={onToggle}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onToggle();
        }
      }}
      aria-label={isOpen ? "Lukk meny" : "Åpne meny"}
      aria-expanded={isOpen}
      className="inline-flex h-11 w-11 items-center justify-center cursor-pointer focus:outline-none"
    >
      <span className="sr-only">{isOpen ? "Lukk" : "Meny"}</span>
      {isOpen ? (
        <X className="h-5 w-5" aria-hidden="true" />
      ) : (
        <Menu className="h-5 w-5" aria-hidden="true" />
      )}
    </a>
  );
}
