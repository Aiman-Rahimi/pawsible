import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth } from "@/lib/api";

type Params = { params: { petId: string } };

// POST — add favorite
export async function POST(req: NextRequest, { params }: Params) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  try {
    await prisma.favorite.create({ data: { userId: user.id, petId: params.petId } });
    return ok({ favorited: true });
  } catch (e: any) {
    if (e.code === "P2002") return ok({ favorited: true }); // already exists
    return err("Failed to favorite", 500);
  }
}

// DELETE — remove favorite
export async function DELETE(req: NextRequest, { params }: Params) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  await prisma.favorite.deleteMany({ where: { userId: user.id, petId: params.petId } });
  return ok({ favorited: false });
}
