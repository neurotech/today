import { NextResponse } from "next/server";
import { getAdvice } from "@/lib/sources/advice";

// Path is fixed by the Living Worlds iframe, which calls /api/advice directly
// from public/living-worlds/main.js. Kept even though Phase 7 is deferred, so
// the contract survives.
export const dynamic = "force-dynamic";

// undici collapses every transport failure into the message "fetch failed" and
// hangs the real reason off `cause`. Advice Slip's TLS handshake alone runs to
// ~9.5s against undici's 10s connect timeout, so this is usually
// UND_ERR_CONNECT_TIMEOUT; unwrapped, the 502 body carried nothing actionable.
const describe = (error: unknown): string => {
  if (!(error instanceof Error)) return String(error);

  const { cause } = error;
  if (!(cause instanceof Error)) return error.message;

  const { code } = cause as Error & { code?: string };

  return `${error.message}: ${code ?? cause.message}`;
};

export async function GET() {
  try {
    return NextResponse.json(await getAdvice());
  } catch (error) {
    return NextResponse.json({ error: describe(error) }, { status: 502 });
  }
}
