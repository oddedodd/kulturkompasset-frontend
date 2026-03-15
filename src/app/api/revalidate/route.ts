import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";

const REVALIDATE_PATHS = [
  "/",
  "/kalender",
  "/backstage",
  "/venues",
  "/bulletin",
] as const;

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

export async function POST(request: Request) {
  const { searchParams } = new URL(request.url);
  const secret = searchParams.get("secret");

  if (!hasValidSecret(secret)) {
    return NextResponse.json({ revalidated: false, message: "Invalid secret" }, { status: 401 });
  }

  revalidateKnownPaths();

  return NextResponse.json({
    revalidated: true,
    paths: REVALIDATE_PATHS,
    at: new Date().toISOString(),
  });
}

// Optional GET endpoint for quick manual verification in browser.
export async function GET(request: Request) {
  return POST(request);
}
