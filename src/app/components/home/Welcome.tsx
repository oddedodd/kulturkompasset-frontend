import Image from "next/image";

export function Welcome() {
  return (
    <section className="mx-auto mt-6 flex h-[260px] max-h-[260px] max-w-5xl flex-col items-center justify-center px-6 py-6 text-center">
      <h1 className="text-5xl font-light tracking-wide">Kulturkompasset.</h1>
      <p className="mt-5 max-w-md text-sm text-black/60">
        Din veileder i kultur og fritid i Namdalen
      </p>

      <div className="relative mt-9 w-full max-w-3xl">
        <div className="absolute left-0 right-0 top-1/2 h-px -translate-y-1/2 bg-black" />
        <div className="relative mx-auto flex h-16 w-16 items-center justify-center bg-white">
          <Image
            src="/kk-symbol.svg"
            alt="Kulturkompasset symbol"
            width={46}
            height={46}
            className="h-[46px] w-[46px]"
            priority
          />
        </div>
      </div>
    </section>
  );
}
