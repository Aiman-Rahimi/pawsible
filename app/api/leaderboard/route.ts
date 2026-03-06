// app/api/leaderboard/route.ts
import { NextRequest } from "next/server";
import { ok, err } from "@/lib/api";
import { getLeaderboard } from "@/lib/points";

export async function GET(req: NextRequest) {
  try {
    const url   = new URL(req.url);
    const limit = Math.min(50, parseInt(url.searchParams.get("limit") ?? "10"));
    const data  = await getLeaderboard(limit);
    return ok({ leaderboard: data });
  } catch (e) {
    console.error(e);
    return err("Failed to load leaderboard", 500);
  }
}
