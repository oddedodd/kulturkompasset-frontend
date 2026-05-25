"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type BulletinFormData = {
  navn: string;
  dato: string;
  tid: string;
  arrangor: string;
  sted: string;
  kontaktperson: string;
  beskrivelse: string;
  pris: string;
  bilde: File | null;
};

const initialFormData: BulletinFormData = {
  navn: "",
  dato: "",
  tid: "",
  arrangor: "",
  sted: "",
  kontaktperson: "",
  beskrivelse: "",
  pris: "",
  bilde: null,
};

export default function SubmitBulletinForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<BulletinFormData>(initialFormData);
  const [contactFaxNumber, setContactFaxNumber] = useState("");
  const [formStartedAt] = useState<number>(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!formData.bilde) {
      setSubmitError("Du må velge en bildefil.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.navn);
      payload.append("date", formData.dato);
      payload.append("time", formData.tid);
      payload.append("organizer", formData.arrangor);
      payload.append("place", formData.sted);
      payload.append("contact", formData.kontaktperson);
      payload.append("description", formData.beskrivelse);
      payload.append("price", formData.pris);
      payload.append("image", formData.bilde);
      payload.append("contactFaxNumber", contactFaxNumber);
      payload.append("formStartedAt", String(formStartedAt));
      payload.append("tzOffsetMinutes", String(new Date().getTimezoneOffset()));

      const response = await fetch("/api/bulletin", {
        method: "POST",
        body: payload,
      });

      const result = (await response.json()) as {
        ok?: boolean;
        message?: string;
        error?: string;
      };

      if (!response.ok || !result.ok) {
        setSubmitError(
          result.error || "Kunne ikke sende inn akkurat nå. Prøv igjen senere.",
        );
        return;
      }

      router.push("/bulletin/submit/registered");
    } catch {
      setSubmitError("Nettverksfeil. Sjekk tilkoblingen og prøv igjen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#f7f4ee] px-4 py-20">
      <section className="mx-auto w-full max-w-3xl rounded-2xl bg-[#f8f7f4] p-8 shadow-sm">
        <h1 className="text-3xl font-semibold tracking-tight">
          Send inn arrangement
        </h1>
        <p className="mt-4 text-black/70">
          Her kan du sende inn offentlige arrangementer som du ønsker å dele med
          lokalmiljøet.
        </p>
        <p className="mt-2 text-black/70">
          Alle innsendte arrangementer gjennomgås før publisering. Noen
          arrangementer kan bli løftet fram som redaksjonelle saker eller
          arrangementer av NA Kreativ, mens øvrige publiseres på oppslagstavla.
        </p>
        <p className="mt-3 text-black/70">
          Fyll ut skjemaet under for å sende inn et arrangement.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="contactFaxNumber">Ikke fyll ut dette feltet</label>
            <input
              id="contactFaxNumber"
              name="contactFaxNumber"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={contactFaxNumber}
              onChange={(event) => setContactFaxNumber(event.target.value)}
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Navn</span>
            <input
              required
              type="text"
              value={formData.navn}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  navn: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Dato</span>
            <input
              required
              type="date"
              value={formData.dato}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  dato: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Tid (00, 15, 30, 45)
            </span>
            <input
              required
              type="text"
              inputMode="numeric"
              value={formData.tid}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  tid: event.target.value,
                }))
              }
              placeholder="HH:MM, f.eks. 19:30"
              pattern="^([01][0-9]|2[0-3]):(00|15|30|45)$"
              title="Bruk format HH:MM og minutter må være 00, 15, 30 eller 45."
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Arrangør</span>
            <input
              required
              type="text"
              value={formData.arrangor}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  arrangor: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Sted</span>
            <input
              required
              type="text"
              value={formData.sted}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  sted: event.target.value,
                }))
              }
              placeholder="f.eks. Kulturhuset, Namsos"
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Kontaktperson</span>
            <input
              required
              type="text"
              value={formData.kontaktperson}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  kontaktperson: event.target.value,
                }))
              }
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Beskrivelse</span>
            <textarea
              required
              value={formData.beskrivelse}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  beskrivelse: event.target.value,
                }))
              }
              rows={5}
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Pris</span>
            <input
              required
              type="text"
              value={formData.pris}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  pris: event.target.value,
                }))
              }
              placeholder="f.eks. Gratis eller 250 kr"
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Bilde</span>
            <input
              required
              type="file"
              accept="image/*"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  bilde: event.target.files?.[0] ?? null,
                }))
              }
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <button
            type="submit"
            disabled={isSubmitting}
            className="cursor-pointer rounded-lg bg-black px-5 py-3 text-sm font-medium text-white transition hover:bg-black/80 disabled:cursor-not-allowed disabled:opacity-70"
          >
            Send inn
          </button>
        </form>

        {submitError ? (
          <div className="mt-6 rounded-lg border border-red-200 bg-red-50 p-4 text-red-800">
            {submitError}
          </div>
        ) : null}
      </section>

      {isSubmitting ? (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f4ee]/85 px-6 backdrop-blur-sm"
          role="status"
          aria-live="polite"
          aria-label="Arrangementet sendes inn"
        >
          <div className="flex max-w-sm flex-col items-center rounded-2xl bg-[#f8f7f4] px-8 py-7 text-center shadow-xl">
            <span
              className="h-10 w-10 animate-spin rounded-full border-4 border-black/15 border-t-black"
              aria-hidden="true"
            />
            <p className="mt-5 text-lg font-semibold text-[#1f1d1a]">
              Arrangementet sendes inn
            </p>
            <p className="mt-2 text-sm leading-relaxed text-black/65">
              Dette kan ta et øyeblikk. Ikke lukk siden mens vi laster opp
              innholdet.
            </p>
          </div>
        </div>
      ) : null}
    </main>
  );
}
