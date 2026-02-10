import { NextResponse } from "next/server";
import { getUpcomingEventsPage } from "@/app/lib/events";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const offset = Number(searchParams.get("offset") ?? "0");
  const limit = Number(searchParams.get("limit") ?? "9");
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
