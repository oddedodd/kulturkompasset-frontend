import { revalidatePath, revalidateTag } from "next/cache";
import { NextResponse } from "next/server";
import { CACHE_TAGS } from "@/app/lib/cache-tags";

const REVALIDATE_PATHS = [
  "/",
  "/kalender",
  "/backstage",
  "/venues",
  "/bulletin",
] as const;

const REVALIDATE_TAGS = Object.values(CACHE_TAGS);

function hasValidSecret(secret: string | null): boolean {
  return Boolean(
    secret &&
      process.env.REVALIDATE_SECRET &&
      secret.length > 0 &&
      secret === process.env.REVALIDATE_SECRET,
  );
}

function revalidateKnownPaths() {
  for (const path of REVALIDATE_PATHS) {
    revalidatePath(path);
  }
}

function revalidateKnownTags() {
  for (const tag of REVALIDATE_TAGS) {
    revalidateTag(tag, "max");
  }
}

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!hasValidSecret(secret)) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  revalidateKnownPaths();
  revalidateKnownTags();

  return NextResponse.json({
    revalidated: true,
    paths: REVALIDATE_PATHS,
    tags: REVALIDATE_TAGS,
    at: new Date().toISOString(),
  });
}

// Optional GET endpoint for quick manual verification in browser.
export async function GET(request: Request) {
  return POST(request);
}
