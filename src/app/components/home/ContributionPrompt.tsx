import Image from "next/image";
import Link from "next/link";

type ContributionPromptProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
};

export function ContributionPrompt({
  eyebrow = "Bidra til Kulturkompasset",
  title = "Kulturkompasset peker dit du tipser oss om.",
  description = "Et arrangement vi ikke har fanget opp? En historie som fortjener å bli fortalt? Send det inn — vi leser alt som kommer.",
  primaryLabel = "Send inn tips",
  primaryHref = "/tips/submit",
  secondaryLabel = "Meld inn arrangement",
  secondaryHref = "/bulletin/submit",
}: ContributionPromptProps) {
  const titleParts = title.split(" du ");

  return (
    <section className="w-full bg-[#f8f7f4] px-6 py-20 sm:py-24">
      <div className="mx-auto flex max-w-3xl flex-col items-center text-center text-[#1f1d1a]">
        <div className="flex w-full max-w-[16rem] items-center gap-5 text-black/25">
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

        <h2 className="mt-4 max-w-2xl font-serif text-4xl font-semibold leading-[1.08] tracking-tight sm:text-5xl">
          {titleParts.length === 2 ? (
            <>
              {titleParts[0]} <em className="font-normal italic">du</em>{" "}
              {titleParts[1]}
            </>
          ) : (
            title
          )}
        </h2>

        <p className="mt-6 max-w-2xl text-base font-medium leading-relaxed text-black/75 sm:text-lg">
          {description}
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Link
            href={primaryHref}
            className="inline-flex h-11 min-w-36 items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-semibold text-white transition-all duration-200 ease-out hover:-translate-y-0.5 hover:bg-black/80 focus-visible:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/30"
          >
            {primaryLabel}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </Link>
          <Link
            href={secondaryHref}
            className="inline-flex h-11 min-w-44 items-center justify-center rounded-full border border-black/65 px-6 text-sm font-semibold text-[#1f1d1a] transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-[#171717] hover:bg-[#171717] hover:text-white focus-visible:-translate-y-0.5 focus-visible:border-[#171717] focus-visible:bg-[#171717] focus-visible:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-black/30"
          >
            {secondaryLabel}
          </Link>
        </div>
      </div>
    </section>
  );
}
