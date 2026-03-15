import { NextResponse } from "next/server";
import { getUpcomingEventsPage } from "@/app/lib/events";

/**
 * Handles GET requests for paginated upcoming events.
 *
 * Supports the following query parameters:
 *   - offset: The number of events to skip (default: 0, must be >= 0)
 *   - limit: The number of events to return (default: 9, must be between 1 and 24)
 *   - venue: Optional filter for venue name (default: "")
 *   - date: Optional filter for event date (default: "")
 *   - q: Optional search string to filter events (default: "")
 *
 * Returns a paginated array of upcoming events matching the given parameters.
 * Responds with HTTP 400 if the pagination parameters are invalid.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} - JSON response with events or error message
 */
export async function GET(request: Request) {
  // Parse query string parameters from the request URL
  const { searchParams } = new URL(request.url);

  // Get pagination parameters, with sensible defaults
  const offsetParam = searchParams.get("offset") ?? "0";
  const limitParam = searchParams.get("limit") ?? "9";
  const offset = Number.parseInt(offsetParam, 10);
  const limit = Number.parseInt(limitParam, 10);

  // Validate that offset and limit are integers
  if (Number.isNaN(offset) || Number.isNaN(limit)) {
    return NextResponse.json(
      { error: "Invalid pagination parameters: offset and limit must be integers." },
      { status: 400 },
    );
  }

  // Validate that offset and limit are in allowed ranges
  if (offset < 0 || limit < 1 || limit > 24) {
    return NextResponse.json(
      { error: "Invalid pagination parameters: offset must be >= 0 and limit must be 1-24." },
      { status: 400 },
    );
  }

  // Optional filtering and search parameters
  const venueName = searchParams.get("venue") ?? "";
  const date = searchParams.get("date") ?? "";
  const search = searchParams.get("q") ?? "";

  // Retrieve the page of upcoming events according to parameters
  const events = await getUpcomingEventsPage({
    offset,
    limit,
    venueName,
    date,
    search,
  });

  // Respond with events as JSON
  return NextResponse.json({ events });
}
