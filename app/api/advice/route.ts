import { NextResponse } from "next/server";
import { getAdvice } from "@/lib/sources/advice";

// Path is fixed by the Living Worlds iframe, which calls /api/advice directly
// from public/living-worlds/main.js. Kept even though Phase 7 is deferred, so
// the contract survives.
export const dynamic = "force-dynamic";

export async function GET() {
  try {
    return NextResponse.json(await getAdvice());
  } catch (error) {
    return NextResponse.json(
      { error: (error as Error).message },
      { status: 502 },
    );
  }
}
