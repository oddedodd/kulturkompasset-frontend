import { createHash } from "crypto";
import { NextRequest, NextResponse } from "next/server";
import { getBulletinsPage } from "@/app/lib/bulletins";
import { sanityWriteClient } from "@/app/lib/sanity.write-client";

const MAX_IMAGE_BYTES = 5 * 1024 * 1024;
const MIN_SUBMIT_MS = 4000;
const THROTTLE_WINDOW_MS = 10 * 60 * 1000;
const THROTTLE_MAX_REQUESTS = 4;
const DEDUPE_WINDOW_MS = 10 * 60 * 1000;
const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

const requestWindowByIp = new Map<string, number[]>();
const recentPayloads = new Map<string, number>();

function genericAcceptedResponse() {
  return NextResponse.json(
    { ok: true, message: "Takk! Innsendingen er mottatt for vurdering." },
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
  return /^([01][0-9]|2[0-3]):(00|15|30|45)$/.test(time);
}

function toIsoDateTime(
  date: string,
  time: string,
  tzOffsetMinutes: number,
): string | null {
  const dateMatch = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
  const timeMatch = /^(\d{2}):(\d{2})$/.exec(time);

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

function isDuplicateSubmission(signature: string, now: number): boolean {
  const existing = recentPayloads.get(signature);
  if (existing && now - existing <= DEDUPE_WINDOW_MS) {
    return true;
  }
  recentPayloads.set(signature, now);
  return false;
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const offsetParam = searchParams.get("offset") ?? "0";
  const limitParam = searchParams.get("limit") ?? "9";
  const offset = Number.parseInt(offsetParam, 10);
  const limit = Number.parseInt(limitParam, 10);

  if (Number.isNaN(offset) || Number.isNaN(limit)) {
    return NextResponse.json(
      { error: "Invalid pagination parameters: offset and limit must be integers." },
      { status: 400 },
    );
  }

  if (offset < 0 || limit < 1 || limit > 24) {
    return NextResponse.json(
      { error: "Invalid pagination parameters: offset must be >= 0 and limit must be 1-24." },
      { status: 400 },
    );
  }

  const search = searchParams.get("q") ?? "";
  const bulletins = await getBulletinsPage({ offset, limit, search });
  return NextResponse.json({ bulletins });
}

export async function POST(request: NextRequest) {
  if (!process.env.SANITY_API_WRITE_TOKEN) {
    console.error("[bulletin] Missing SANITY_API_WRITE_TOKEN");
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
    console.warn("[bulletin] Rejected non-form-data request", { ipFingerprint });
    return genericAcceptedResponse();
  }

  if (isIpRateLimited(ip, now)) {
    console.warn("[bulletin] Rate-limited submission", { ipFingerprint });
    return genericAcceptedResponse();
  }

  const formData = await request.formData();

  const decoyField = readFormString(formData, "contactFaxNumber");
  if (decoyField.trim().length > 0) {
    console.warn("[bulletin] Honeypot triggered", { ipFingerprint });
    return genericAcceptedResponse();
  }

  const startedAtRaw = readFormString(formData, "formStartedAt");
  const startedAt = Number.parseInt(startedAtRaw, 10);
  if (!Number.isFinite(startedAt) || now - startedAt < MIN_SUBMIT_MS) {
    console.warn("[bulletin] Rejected too-fast submission", { ipFingerprint });
    return genericAcceptedResponse();
  }

  const name = normalizeText(readFormString(formData, "name"));
  const date = normalizeText(readFormString(formData, "date"));
  const time = normalizeText(readFormString(formData, "time"));
  const organizer = normalizeText(readFormString(formData, "organizer"));
  const placeInput = normalizeText(readFormString(formData, "place"));
  const place = placeInput || "Sted ikke oppgitt";
  const contact = normalizeText(readFormString(formData, "contact"));
  const description = normalizeText(readFormString(formData, "description"));
  const price = normalizeText(readFormString(formData, "price"));
  const tzOffsetRaw = readFormString(formData, "tzOffsetMinutes");
  const tzOffsetMinutes = Number.parseInt(tzOffsetRaw, 10);

  if (
    name.length < 2 ||
    name.length > 120 ||
    organizer.length < 2 ||
    organizer.length > 120 ||
    place.length > 160 ||
    contact.length < 2 ||
    contact.length > 120 ||
    description.length < 10 ||
    description.length > 4000 ||
    price.length > 80
  ) {
    return NextResponse.json(
      { ok: false, error: "Kunne ikke sende inn. Kontroller feltene og prøv igjen." },
      { status: 400 },
    );
  }

  if (
    !isAllowedText(name) ||
    !isAllowedText(organizer) ||
    !isAllowedPlaceText(place) ||
    !isAllowedText(contact) ||
    !isAllowedText(description) ||
    !isLikelyPrice(price)
  ) {
    return NextResponse.json(
      { ok: false, error: "Kunne ikke sende inn. Kontroller feltene og prøv igjen." },
      { status: 400 },
    );
  }

  if (!isValidTimeInput(time)) {
    return NextResponse.json(
      { ok: false, error: "Tid må være på format HH:MM med 15-minutters intervall." },
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
  if (!dateTimeIso) {
    return NextResponse.json(
      { ok: false, error: "Kunne ikke tolke dato og tid." },
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
      { ok: false, error: "Ugyldig bildefil. Bruk JPG, PNG eller WEBP." },
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
        organizer,
        place,
        contact,
        description,
        price,
        imageName: image.name,
        ipFingerprint,
      }),
    )
    .digest("hex");

  if (isDuplicateSubmission(payloadSignature, now)) {
    console.warn("[bulletin] Duplicate submission blocked", { ipFingerprint });
    return genericAcceptedResponse();
  }

  try {
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const uploadedAsset = await sanityWriteClient.assets.upload("image", imageBuffer, {
      filename: image.name,
      contentType: image.type,
    });

    const created = await sanityWriteClient.create({
      _type: "bulletinSubmission",
      name,
      date: dateTimeIso,
      organizer,
      place,
      contact,
      description,
      price,
      image: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: uploadedAsset._id,
        },
        alt: `Bilde for ${name}`,
      },
    });

    return NextResponse.json(
      { ok: true, message: "Takk! Innsendingen er sendt inn.", id: created._id },
      { status: 201 },
    );
  } catch (error) {
    console.error("[bulletin] Failed to store submission", {
      ipFingerprint,
      error: error instanceof Error ? error.message : "Unknown error",
    });

    return NextResponse.json(
      { ok: false, error: "Noe gikk galt under innsending. Prøv igjen senere." },
      { status: 500 },
    );
  }
}
