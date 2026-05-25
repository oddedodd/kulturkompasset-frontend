import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { sanityWriteClient } from "@/app/lib/sanity.write-client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIN_SUBMIT_MS = 4000;
const THROTTLE_WINDOW_MS = 10 * 60 * 1000;
const THROTTLE_MAX_REQUESTS = 4;
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;
const ALLOWED_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/svg+xml",
]);

const requestWindowByIp = new Map<string, number[]>();
const recentPayloads = new Map<string, number>();

function genericAcceptedResponse() {
  return NextResponse.json(
    { ok: true, message: "Takk! Tipset er mottatt for vurdering." },
    { status: 202 },
  );
}

function getClientIp(request: NextRequest): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0]?.trim() || "unknown";
  }

  return "unknown";
}

function getIpFingerprint(ip: string): string {
  return createHash("sha256").update(ip).digest("hex").slice(0, 12);
}

function cleanOldEntries(now: number) {
  for (const [ip, timestamps] of requestWindowByIp.entries()) {
    const kept = timestamps.filter((ts) => now - ts <= THROTTLE_WINDOW_MS);
    if (kept.length === 0) {
      requestWindowByIp.delete(ip);
      continue;
    }
    requestWindowByIp.set(ip, kept);
  }

  for (const [signature, timestamp] of recentPayloads.entries()) {
    if (now - timestamp > DEDUPE_WINDOW_MS) {
      recentPayloads.delete(signature);
    }
  }
}

function isIpRateLimited(ip: string, now: number): boolean {
  const timestamps = requestWindowByIp.get(ip) ?? [];
  const validTimestamps = timestamps.filter((ts) => now - ts <= THROTTLE_WINDOW_MS);

  if (validTimestamps.length >= THROTTLE_MAX_REQUESTS) {
    requestWindowByIp.set(ip, validTimestamps);
    return true;
  }

  validTimestamps.push(now);
  requestWindowByIp.set(ip, validTimestamps);
  return false;
}

function normalizeText(input: string): string {
  return input.replace(/\s+/g, " ").trim();
}

function readFormString(formData: FormData, key: string): string {
  const value = formData.get(key);
  return typeof value === "string" ? value : "";
}

function isValidTimeInput(time: string): boolean {
  return time === "" || /^([01][0-9]|2[0-3]):([0-5][0-9])$/.test(time);
}

function toIsoDateTime(
  date: string,
  time: string,
  tzOffsetMinutes: number,
): string | undefined | null {
  if (!date && !time) return undefined;
  if (!date) return null;

  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time || "00:00");

  if (!dateMatch || !timeMatch) {
    return null;
  }

  const year = Number.parseInt(dateMatch[1], 10);
  const month = Number.parseInt(dateMatch[2], 10);
  const day = Number.parseInt(dateMatch[3], 10);
  const hour = Number.parseInt(timeMatch[1], 10);
  const minute = Number.parseInt(timeMatch[2], 10);

  const utcMillis =
    Date.UTC(year, month - 1, day, hour, minute, 0, 0) +
    tzOffsetMinutes * 60 * 1000;
  const parsed = new Date(utcMillis);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed.toISOString();
}

function isAllowedText(value: string): boolean {
  return /^[\p{L}\p{N}\p{M}\p{P}\p{Zs}\n\r\t]+$/u.test(value);
}

function isAllowedPlaceText(value: string): boolean {
  return /^[\p{L}\p{N}\p{M}\p{P}\p{S}\p{Zs}\n\r\t]+$/u.test(value);
}

function isLikelyPrice(value: string): boolean {
  return /^[0-9a-zA-ZæøåÆØÅ.,:;+\-/() ]*$/.test(value);
}

function isLikelyPhone(value: string): boolean {
  return /^[0-9+() .-]{5,30}$/.test(value);
}

function isLikelyEmail(value: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
}

function normalizeUrl(value: string): string | undefined | null {
  if (!value) return undefined;

  try {
    const url = new URL(value);
    if (url.protocol !== "http:" && url.protocol !== "https:") {
      return null;
    }
    return url.toString();
  } catch {
    return null;
  }
}

function isDuplicateSubmission(signature: string, now: number): boolean {
  const existing = recentPayloads.get(signature);
  if (existing && now - existing <= DEDUPE_WINDOW_MS) {
    return true;
  }
  recentPayloads.set(signature, now);
  return false;
}

export async function POST(request: NextRequest) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("[tips] Missing SANITY_API_WRITE_TOKEN");
    return NextResponse.json(
      { ok: false, error: "Innsending er midlertidig utilgjengelig." },
      { status: 500 },
    );
  }

  const now = Date.now();
  cleanOldEntries(now);

  const ip = getClientIp(request);
  const ipFingerprint = getIpFingerprint(ip);

  const contentType = request.headers.get("content-type") || "";
  if (!contentType.toLowerCase().includes("multipart/form-data")) {
    console.warn("[tips] Rejected non-form-data request", { ipFingerprint });
    return genericAcceptedResponse();
  }

  if (isIpRateLimited(ip, now)) {
    console.warn("[tips] Rate-limited submission", { ipFingerprint });
    return genericAcceptedResponse();
  }

  const formData = await request.formData();

  const decoyField = readFormString(formData, "contactFaxNumber");
  if (decoyField.trim().length > 0) {
    console.warn("[tips] Honeypot triggered", { ipFingerprint });
    return genericAcceptedResponse();
  }

  const startedAtRaw = readFormString(formData, "formStartedAt");
  const startedAt = Number.parseInt(startedAtRaw, 10);
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_SUBMIT_MS) {
    console.warn("[tips] Rejected too-fast submission", { ipFingerprint });
    return genericAcceptedResponse();
  }

  const name = normalizeText(readFormString(formData, "name"));
  const date = normalizeText(readFormString(formData, "date"));
  const time = normalizeText(readFormString(formData, "time"));
  const price = normalizeText(readFormString(formData, "price"));
  const place = normalizeText(readFormString(formData, "place"));
  const ticketUrlInput = normalizeText(readFormString(formData, "ticketUrl"));
  const description = normalizeText(readFormString(formData, "description"));
  const submitterName = normalizeText(readFormString(formData, "submitterName"));
  const submitterPhone = normalizeText(readFormString(formData, "submitterPhone"));
  const submitterEmail = normalizeText(readFormString(formData, "submitterEmail"));
  const tzOffsetRaw = readFormString(formData, "tzOffsetMinutes");
  const tzOffsetMinutes = Number.parseInt(tzOffsetRaw, 10);

  if (
    name.length < 2 ||
    name.length > 120 ||
    place.length > 160 ||
    price.length > 80 ||
    ticketUrlInput.length > 300 ||
    description.length < 10 ||
    description.length > 4000 ||
    submitterName.length < 2 ||
    submitterName.length > 120 ||
    submitterPhone.length < 5 ||
    submitterPhone.length > 30 ||
    submitterEmail.length < 5 ||
    submitterEmail.length > 160
  ) {
    return NextResponse.json(
      { ok: false, error: "Kunne ikke sende inn. Kontroller feltene og prøv igjen." },
      { status: 400 },
    );
  }

  if (
    !isAllowedText(name) ||
    (place && !isAllowedPlaceText(place)) ||
    !isLikelyPrice(price) ||
    !isAllowedText(description) ||
    !isAllowedText(submitterName) ||
    !isLikelyPhone(submitterPhone) ||
    !isLikelyEmail(submitterEmail)
  ) {
    return NextResponse.json(
      { ok: false, error: "Kunne ikke sende inn. Kontroller feltene og prøv igjen." },
      { status: 400 },
    );
  }

  if (!isValidTimeInput(time)) {
    return NextResponse.json(
      { ok: false, error: "Tid må være på format HH:MM." },
      { status: 400 },
    );
  }

  if (!Number.isFinite(tzOffsetMinutes) || tzOffsetMinutes < -840 || tzOffsetMinutes > 840) {
    return NextResponse.json(
      { ok: false, error: "Ugyldig tidssone." },
      { status: 400 },
    );
  }

  const dateTimeIso = toIsoDateTime(date, time, tzOffsetMinutes);
  if (dateTimeIso === null) {
    return NextResponse.json(
      { ok: false, error: "Tidspunkt kan bare fylles ut sammen med dato." },
      { status: 400 },
    );
  }

  const ticketUrl = normalizeUrl(ticketUrlInput);
  if (ticketUrl === null) {
    return NextResponse.json(
      { ok: false, error: "Lenke til billettsalg må være en gyldig URL." },
      { status: 400 },
    );
  }

  const image = formData.get("image");
  if (!(image instanceof File)) {
    return NextResponse.json(
      { ok: false, error: "Bilde mangler." },
      { status: 400 },
    );
  }

  if (!ALLOWED_IMAGE_TYPES.has(image.type)) {
    return NextResponse.json(
      { ok: false, error: "Ugyldig bildefil. Bruk JPG, PNG eller SVG." },
      { status: 400 },
    );
  }

  if (image.size <= 0 || image.size > MAX_IMAGE_BYTES) {
    return NextResponse.json(
      { ok: false, error: "Bilde må være mellom 1 byte og 5 MB." },
      { status: 400 },
    );
  }

  const payloadSignature = createHash("sha256")
    .update(
      JSON.stringify({
        name,
        date,
        time,
        price,
        place,
        ticketUrl,
        description,
        imageName: image.name,
        submitterName,
        submitterEmail,
        ipFingerprint,
      }),
    )
    .digest("hex");

  if (isDuplicateSubmission(payloadSignature, now)) {
    console.warn("[tips] Duplicate submission blocked", { ipFingerprint });
    return genericAcceptedResponse();
  }

  try {
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const uploadedAsset = await sanityWriteClient.assets.upload("image", imageBuffer, {
      filename: image.name,
      contentType: image.type,
    });

    const created = await sanityWriteClient.create({
      _type: "tips",
      name,
      ...(dateTimeIso ? { date: dateTimeIso } : {}),
      ...(price ? { price } : {}),
      ...(place ? { place } : {}),
      ...(ticketUrl ? { ticketUrl } : {}),
      description,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: uploadedAsset._id,
        },
        alt: `Bilde for ${name}`,
      },
      submitterName,
      submitterPhone,
      submitterEmail,
      submittedAt: new Date().toISOString(),
    });

    return NextResponse.json(
      { ok: true, message: "Takk! Tipset er sendt inn.", id: created._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("[tips] Failed to store submission", {
      ipFingerprint,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { ok: false, error: "Noe gikk galt under innsending. Prøv igjen senere." },
      { status: 500 },
    );
  }
}
