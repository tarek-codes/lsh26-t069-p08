import { NextResponse } from "next/server";
import { databaseStatus, pingDatabase } from "@/lib/persistence";

export const dynamic = "force-dynamic";

// Open /api/v1/health on the deployed site to check the database connection.
// Reports only whether settings exist and whether a read works; never secret values.
export async function GET() {
  const cfg = databaseStatus();
  let ping: Awaited<ReturnType<typeof pingDatabase>> | { ok: false; error: string };
  try {
    ping = await pingDatabase();
  } catch (err) {
    ping = { ok: false, error: err instanceof Error ? err.message : String(err) };
  }
  return NextResponse.json({
    urlSet: cfg.urlSet,
    urlUsable: cfg.urlUsable,
    urlHint: cfg.urlHint,
    keySet: cfg.keySet,
    settingsError: cfg.configError,
    database: ping,
  });
}
