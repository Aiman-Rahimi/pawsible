import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, requireAuth } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  const requests = await prisma.adoptionRequest.findMany({
    where:   { userId: user.id },
    include: { pet: { select: { id: true, name: true, breed: true, photoUrl: true, status: true } } },
    orderBy: { requestDate: "desc" },
  });

  return ok({ requests });
}
