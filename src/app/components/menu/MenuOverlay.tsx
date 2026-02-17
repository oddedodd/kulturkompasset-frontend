// Fullskjerms overlay som viser navigasjonen (hardkodet)

"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import type { NavItem } from "../../lib/types";
import { MenuButton } from "./MenuButton";

type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
  navItems: NavItem[];
};

export function MenuOverlay({ isOpen, onClose, navItems }: MenuOverlayProps) {
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const pathname = usePathname();

  const isActivePath = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname?.startsWith(`${href}/`);
  };

  // ESC for å lukke
  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  // Scroll-lock + fokus på første lenke
  useEffect(() => {
    if (!isOpen) return;

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    // Fokus etter neste tick (så elementet finnes i DOM)
    const t = window.setTimeout(() => firstLinkRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(t);
      document.body.style.overflow = prevOverflow;
    };
  }, [isOpen]);

  return (
    <div
      className={[
        "fixed inset-0 z-50 transition",
        isOpen
          ? "pointer-events-auto opacity-100"
          : "pointer-events-none opacity-0",
      ].join(" ")}
      aria-hidden={!isOpen}
    >
      {/* Bakgrunn */}
      <div className="absolute inset-0 bg-white" onClick={onClose} />

      {/* Innhold */}
      {/* Ytre container matcher headerens bredde/padding så X-knappen havner samme sted */}
      <div className="relative h-full px-4">
        <div className="mx-auto flex h-full w-full max-w-6xl flex-col text-center">
          {/* Lukk-knapp øverst til høyre (samme layout som i headeren) */}
          <div className="flex h-16 items-center justify-between">
            <Link href="/" onClick={onClose} className="flex items-center" aria-label="Gå til forsiden">
              <Image
                src="/logo01.svg"
                alt="KulturKompasset"
                width={1106}
                height={145}
                className="h-7 w-auto"
                priority
              />
            </Link>
            <MenuButton isOpen={isOpen} onToggle={onClose} />
          </div>

          {/* Selve menyen sentrert i en smalere kolonne */}
          <div className="flex flex-1 flex-col items-center justify-center">
            <div className="w-full max-w-md">
              <nav aria-label="Hovedmeny" className="w-full">
                <ul className="flex flex-col items-center gap-7">
                  {navItems.map((item, idx) => (
                    <li key={item.href} className="w-full">
                      {/** Aktiv side markeres med fet tekst i stedet for border/ring */}
                      <Link
                        href={item.href}
                        ref={idx === 0 ? firstLinkRef : undefined}
                        onClick={onClose}
                        className={[
                          "group inline-flex w-full items-center justify-center text-2xl tracking-wide outline-none",
                          "focus-visible:underline focus-visible:underline-offset-4",
                          isActivePath(item.href) ? "font-semibold" : "font-normal",
                        ].join(" ")}
                      >
                        <span className="relative">
                          {item.label}
                          {/* Understrek */}
                          <span className="absolute left-0 right-0 top-[110%] mx-auto block h-px w-[110%] bg-black/40 transition-opacity group-hover:opacity-70" />
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>

              {/* Lite hint nederst (valgfritt) */}
              <button
                type="button"
                onClick={onClose}
                className="mt-12 text-sm text-black/60 underline underline-offset-4 hover:text-black"
              >
                Lukk
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
