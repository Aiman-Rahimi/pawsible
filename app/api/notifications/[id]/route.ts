import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth } from "@/lib/api";

type Params = { params: { id: string } };

// PATCH /api/notifications/[id] — mark as read
export async function PATCH(req: NextRequest, { params }: Params) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  if (params.id === "all") {
    await prisma.notification.updateMany({
      where: { userId: user.id, read: false },
      data:  { read: true },
    });
    return ok({ message: "All marked as read" });
  }

  const notif = await prisma.notification.findUnique({ where: { id: params.id } });
  if (!notif || notif.userId !== user.id) return err("Not found", 404);

  await prisma.notification.update({ where: { id: params.id }, data: { read: true } });
  return ok({ message: "Marked as read" });
}
