import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  const favorites = await prisma.favorite.findMany({
    where:   { userId: user.id },
    include: { pet: true },
    orderBy: { createdAt: "desc" },
  });

  return ok({ favorites });
}
