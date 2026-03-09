import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth } from "@/lib/api";

// GET /api/notifications — get user's notifications
export async function GET(req: NextRequest) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  const notifications = await prisma.notification.findMany({
    where:   { userId: user.id },
    orderBy: { createdAt: "desc" },
    take:    30,
  });

  const unreadCount = await prisma.notification.count({
    where: { userId: user.id, read: false },
  });

  return ok({ notifications, unreadCount });
}
