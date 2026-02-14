import { NextResponse } from "next/server";
import { getUpcomingEventsPage } from "@/app/lib/events";

export async function GET(request: Request) {
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

  const venueName = searchParams.get("venue") ?? "";
  const date = searchParams.get("date") ?? "";
  const search = searchParams.get("q") ?? "";

  const events = await getUpcomingEventsPage({
    offset,
    limit,
    venueName,
    date,
    search,
  });
  return NextResponse.json({ events });
}
