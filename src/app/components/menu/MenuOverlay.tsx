// Fullskjerms overlay som viser navigasjonen (hardkodet)

"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { navItems } from "./navItems";

type MenuOverlayProps = {
  isOpen: boolean;
  onClose: () => void;
};

export function MenuOverlay({ isOpen, onClose }: MenuOverlayProps) {
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);

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
      <div className="relative mx-auto flex h-full max-w-md flex-col items-center justify-center px-6 text-center">
        <nav aria-label="Hovedmeny" className="w-full">
          <ul className="flex flex-col items-center gap-7">
            {navItems.map((item, idx) => (
              <li key={item.href} className="w-full">
                <Link
                  href={item.href}
                  ref={idx === 0 ? firstLinkRef : undefined}
                  onClick={onClose}
                  className="group inline-flex w-full items-center justify-center gap-3 text-2xl tracking-wide outline-none focus:ring-2 focus:ring-black/30"
                >
                  {/* Bullet for featured (Backstage i skissa) */}
                  {item.featured ? (
                    <span aria-hidden className="text-xl leading-none">
                      •
                    </span>
                  ) : (
                    <span aria-hidden className="w-[1ch]" />
                  )}

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
  );
}
