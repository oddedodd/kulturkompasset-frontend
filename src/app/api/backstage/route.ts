import { NextResponse } from "next/server";
import { getBackstageArticlesPage } from "@/app/lib/articles";

/**
 * Handles GET requests for paginated Backstage articles.
 *
 * Accepts query parameters for pagination and search:
 *   - offset: The number of articles to skip (default: 0, must be >= 0)
 *   - limit:  The number of articles to return (default: 9, must be between 1 and 24)
 *   - q:      Optional search query string (default: "")
 *
 * Returns a JSON response containing an array of articles.
 * Returns 400 with an error message if parameters are invalid.
 *
 * @param {Request} request - The incoming HTTP request
 * @returns {Promise<NextResponse>} JSON response with articles or error
 */
export async function GET(request: Request) {
  // Parse search parameters from the request URL
  const { searchParams } = new URL(request.url);

  // Get pagination parameters, with defaults
  const offsetParam = searchParams.get("offset") ?? "0";
  const limitParam = searchParams.get("limit") ?? "9";
  const offset = Number.parseInt(offsetParam, 10);
  const limit = Number.parseInt(limitParam, 10);

  // Validate pagination parameters: must be integers
  if (Number.isNaN(offset) || Number.isNaN(limit)) {
    return NextResponse.json(
      { error: "Invalid pagination parameters: offset and limit must be integers." },
      { status: 400 },
    );
  }

  // Check pagination parameter value ranges
  if (offset < 0 || limit < 1 || limit > 24) {
    return NextResponse.json(
      { error: "Invalid pagination parameters: offset must be >= 0 and limit must be 1-24." },
      { status: 400 },
    );
  }

  // Get optional search query
  const search = searchParams.get("q") ?? "";

  // Fetch articles page from the data source
  const articles = await getBackstageArticlesPage({
    offset,
    limit,
    search,
  });

  // Respond with articles as JSON
  return NextResponse.json({ articles });
}
