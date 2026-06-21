// app/api/rewards/retry-queue/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err, requireRole } from "@/lib/api";
import { processPointsQueue } from "@/lib/points";

// GET — list pending/failed points updates (admin only)
export async function GET(req: NextRequest) {
  const { user, response } = await requireRole(["ADMIN"]);
  if (response) return response;

  const queue = await prisma.pointsQueue.findMany({
    orderBy: { createdAt: "desc" },
    include: { user: { select: { id: true, name: true, email: true } } },
  });

  return ok({ queue });
}

// POST — retry processing all PENDING items in the queue (admin only)
export async function POST(req: NextRequest) {
  const { user, response } = await requireRole(["ADMIN"]);
  if (response) return response;

  const results = await processPointsQueue();
  return ok({ message: "Retry queue processed", results });
}
