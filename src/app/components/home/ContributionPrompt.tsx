import Image from "next/image";

type ContributionPromptProps = {
  eyebrow?: string;
  title?: string;
  description?: string;
  primaryLabel?: string;
  secondaryLabel?: string;
};

export function ContributionPrompt({
  eyebrow = "Bidra til Kulturkompasset",
  title = "Kulturkompasset peker dit du tipser oss om.",
  description = "Et arrangement vi ikke har fanget opp? En historie som fortjener å bli fortalt? Send det inn — vi leser alt som kommer.",
  primaryLabel = "Send inn tips",
  secondaryLabel = "Meld inn arrangement",
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
          <button
            type="button"
            className="inline-flex h-11 min-w-36 cursor-default items-center justify-center rounded-full bg-[#171717] px-6 text-sm font-semibold text-white"
          >
            {primaryLabel}
            <span className="ml-2" aria-hidden="true">
              →
            </span>
          </button>
          <button
            type="button"
            className="inline-flex h-11 min-w-44 cursor-default items-center justify-center rounded-full border border-black/65 px-6 text-sm font-semibold text-[#1f1d1a]"
          >
            {secondaryLabel}
          </button>
        </div>
      </div>
    </section>
  );
}
