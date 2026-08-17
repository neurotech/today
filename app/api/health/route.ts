import { NextResponse } from "next/server";

// Exists for the compose healthcheck. Deliberately proves only that the server
// is up and routing: it does NOT touch the database or any feed.
//
// Checking SQLite here would be counterproductive. A root-owned ./data bind
// mount would fail the healthcheck, and `restart: always` would then restart-loop
// the container instead of serving the page that explains how to fix it.
export const dynamic = "force-dynamic";

export function GET() {
  return NextResponse.json({ ok: true });
}
