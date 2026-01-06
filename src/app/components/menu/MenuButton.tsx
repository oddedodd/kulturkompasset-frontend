// components/menu/MenuButton.tsx
// Hamburger-knapp som toggler menyen

"use client";

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
      className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-black/10 hover:bg-black/5 focus:outline-none focus:ring-2 focus:ring-black/30"
    >
      {/* Enkel hamburger / close icon */}
      <span className="sr-only">{isOpen ? "Lukk" : "Meny"}</span>
      <div className="relative h-4 w-5">
        <span
          className={[
            "absolute left-0 top-0 h-[2px] w-5 bg-black transition-transform duration-200",
            isOpen ? "translate-y-[7px] rotate-45" : "",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-0 top-[7px] h-[2px] w-5 bg-black transition-opacity duration-200",
            isOpen ? "opacity-0" : "opacity-100",
          ].join(" ")}
        />
        <span
          className={[
            "absolute left-0 top-[14px] h-[2px] w-5 bg-black transition-transform duration-200",
            isOpen ? "-translate-y-[7px] -rotate-45" : "",
          ].join(" ")}
        />
      </div>
    </button>
  );
}
