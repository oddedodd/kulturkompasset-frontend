"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";

const COOKIE_NAME = "kk_contribution_prompt_seen";
const COOKIE_MAX_AGE_SECONDS = 60 * 60 * 24 * 7;
const POPUP_DELAY_MS = 5000;

const eyebrow = "Bidra til Kulturkompasset";
const description =
  "Et arrangement vi ikke har fanget opp? En historie som fortjener å bli fortalt? Send det inn — vi leser alt som kommer.";

function hasSeenCookie(): boolean {
  return document.cookie
    .split(";")
    .some((cookie) => cookie.trim().startsWith(`${COOKIE_NAME}=`));
}

function setSeenCookie() {
  document.cookie = `${COOKIE_NAME}=1; max-age=${COOKIE_MAX_AGE_SECONDS}; path=/; SameSite=Lax`;
}

export function ContributionPromptPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const primaryLinkRef = useRef<HTMLAnchorElement | null>(null);

  function closePopup() {
    setSeenCookie();
    setIsOpen(false);
  }

  useEffect(() => {
    if (hasSeenCookie()) return;

    const timer = window.setTimeout(() => {
      setIsOpen(true);
    }, POPUP_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closePopup();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const focusTimer = window.setTimeout(() => primaryLinkRef.current?.focus(), 0);

    return () => {
      window.clearTimeout(focusTimer);
      document.body.style.overflow = previousOverflow;
    };
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="contribution-popup-title"
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/45 px-4 py-8 backdrop-blur-sm"
      onClick={closePopup}
    >
      <div
        className="relative w-full max-w-2xl rounded-3xl bg-[#f8f7f4] px-6 py-8 text-center text-[#1f1d1a] shadow-2xl sm:px-10 sm:py-10"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          onClick={closePopup}
          className="absolute right-4 top-4 rounded-full border border-black/15 px-4 py-2 text-sm font-semibold text-black/60 transition hover:border-black/35 hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/30"
          aria-label="Lukk påminnelse"
        >
          Lukk
        </button>

        <div className="mx-auto flex w-full max-w-[12rem] items-center gap-4 text-black/25">
          <div className="h-px flex-1 bg-current" />
          <Image
            src="/kk-symbol.svg"
            alt=""
            width={18}
            height={18}
            className="h-5 w-5 opacity-50"
            aria-hidden="true"
          />
          <div className="h-px flex-1 bg-current" />
        </div>

        <p className="mt-8 text-[0.68rem] font-bold uppercase tracking-[0.28em] text-black/55">
          {eyebrow}
        </p>

        <h2
          id="contribution-popup-title"
          className="mt-4 font-serif text-3xl font-semibold leading-[1.08] tracking-tight sm:text-4xl"
        >
          Kulturkompasset peker dit <em className="font-normal italic">du</em>{" "}
          tipser oss om.
        </h2>

        <p className="mx-auto mt-6 max-w-xl text-base font-medium leading-relaxed text-black/75">
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            ref={primaryLinkRef}
            href="/tips/submit"
            onClick={closePopup}
            className="inline-flex h-11 min-w-36 items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-black/80 focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/30"
          >
            Send inn tips
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
          <Link
            href="/bulletin/submit"
            onClick={closePopup}
            className="inline-flex h-11 min-w-44 items-center justify-center rounded-full border border-black/65 px-6 text-sm font-semibold text-[#1f1d1a] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#171717] hover:bg-[#171717] hover:text-white focus-visible:-translate-y-0.5 focus-visible:border-[#171717] focus-visible:bg-[#171717] focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/30"
          >
            Meld inn arrangement
          </Link>
        </div>
      </div>
    </div>
  );
}
