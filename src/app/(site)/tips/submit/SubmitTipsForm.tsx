"use client";

import { useRouter } from "next/navigation";
import { FormEvent, useState } from "react";

type TipsFormData = {
  name: string;
  date: string;
  time: string;
  price: string;
  place: string;
  ticketUrl: string;
  description: string;
  image: File | null;
  submitterName: string;
  submitterPhone: string;
  submitterEmail: string;
};

const initialFormData: TipsFormData = {
  name: "",
  date: "",
  time: "",
  price: "",
  place: "",
  ticketUrl: "",
  description: "",
  image: null,
  submitterName: "",
  submitterPhone: "",
  submitterEmail: "",
};

export default function SubmitTipsForm() {
  const router = useRouter();
  const [formData, setFormData] = useState<TipsFormData>(initialFormData);
  const [contactFaxNumber, setContactFaxNumber] = useState("");
  const [formStartedAt] = useState<number>(() => Date.now());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitError(null);

    if (!formData.image) {
      setSubmitError("Du må velge en bildefil.");
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = new FormData();
      payload.append("name", formData.name);
      payload.append("date", formData.date);
      payload.append("time", formData.time);
      payload.append("price", formData.price);
      payload.append("place", formData.place);
      payload.append("ticketUrl", formData.ticketUrl);
      payload.append("description", formData.description);
      payload.append("image", formData.image);
      payload.append("submitterName", formData.submitterName);
      payload.append("submitterPhone", formData.submitterPhone);
      payload.append("submitterEmail", formData.submitterEmail);
      payload.append("contactFaxNumber", contactFaxNumber);
      payload.append("formStartedAt", String(formStartedAt));
      payload.append("tzOffsetMinutes", String(new Date().getTimezoneOffset()));

      const response = await fetch("/api/tips", {
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

      router.push("/tips/submit/registered");
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
          Send inn tips
        </h1>
        <p className="mt-4 text-black/70">
          Har du et kulturarrangement, en historie eller et tips du mener
          Kulturkompasset bør se nærmere på? Send det til oss her.
        </p>
        <p className="mt-2 text-black/70">
          Innsendte tips gjennomgås før eventuell videre behandling. Noen tips
          kan bli løftet fram som redaksjonelle saker eller arrangementer.
        </p>

        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div className="absolute -left-[9999px] top-auto h-px w-px overflow-hidden">
            <label htmlFor="tipsContactFaxNumber">Ikke fyll ut dette feltet</label>
            <input
              id="tipsContactFaxNumber"
              name="contactFaxNumber"
              type="text"
              tabIndex={-1}
              autoComplete="off"
              value={contactFaxNumber}
              onChange={(event) => setContactFaxNumber(event.target.value)}
            />
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Navn på tips</span>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(event) =>
                setFormData((current) => ({ ...current, name: event.target.value }))
              }
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Dato</span>
              <input
                type="date"
                value={formData.date}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, date: event.target.value }))
                }
                className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Tidspunkt</span>
              <input
                type="text"
                inputMode="numeric"
                value={formData.time}
                onChange={(event) =>
                  setFormData((current) => ({ ...current, time: event.target.value }))
                }
                placeholder="HH:MM, f.eks. 19:30"
                pattern="^$|^([01][0-9]|2[0-3]):([0-5][0-9])$"
                title="Bruk format HH:MM."
                className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Sted</span>
            <input
              type="text"
              value={formData.place}
              onChange={(event) =>
                setFormData((current) => ({ ...current, place: event.target.value }))
              }
              placeholder="f.eks. Kulturhuset, Namsos"
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Pris</span>
            <input
              type="text"
              value={formData.price}
              onChange={(event) =>
                setFormData((current) => ({ ...current, price: event.target.value }))
              }
              placeholder="f.eks. Gratis eller 250 kr"
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">
              Eventuell link til billettsalg
            </span>
            <input
              type="url"
              value={formData.ticketUrl}
              onChange={(event) =>
                setFormData((current) => ({ ...current, ticketUrl: event.target.value }))
              }
              placeholder="https://..."
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Beskrivelse</span>
            <textarea
              required
              value={formData.description}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  description: event.target.value,
                }))
              }
              rows={5}
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">Bilde</span>
            <input
              required
              type="file"
              accept="image/jpeg,image/png,image/svg+xml"
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  image: event.target.files?.[0] ?? null,
                }))
              }
              className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
            />
          </label>

          <div className="grid gap-5 sm:grid-cols-2">
            <label className="block">
              <span className="mb-2 block text-sm font-medium">Navn på innsender</span>
              <input
                required
                type="text"
                value={formData.submitterName}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    submitterName: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
              />
            </label>

            <label className="block">
              <span className="mb-2 block text-sm font-medium">Telefonnummer</span>
              <input
                required
                type="tel"
                value={formData.submitterPhone}
                onChange={(event) =>
                  setFormData((current) => ({
                    ...current,
                    submitterPhone: event.target.value,
                  }))
                }
                className="w-full rounded-lg border border-black/20 px-3 py-2 outline-none ring-0 transition focus:border-black"
              />
            </label>
          </div>

          <label className="block">
            <span className="mb-2 block text-sm font-medium">E-post</span>
            <input
              required
              type="email"
              value={formData.submitterEmail}
              onChange={(event) =>
                setFormData((current) => ({
                  ...current,
                  submitterEmail: event.target.value,
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
            Send inn tips
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
          aria-label="Tipset sendes inn"
        >
          <div className="flex max-w-sm flex-col items-center rounded-2xl bg-[#f8f7f4] px-8 py-7 text-center shadow-xl">
            <span
              className="h-10 w-10 animate-spin rounded-full border-4 border-black/15 border-t-black"
              aria-hidden="true"
            />
            <p className="mt-5 text-lg font-semibold text-[#1f1d1a]">
              Tipset sendes inn
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
