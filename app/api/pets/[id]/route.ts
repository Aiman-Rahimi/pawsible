// app/api/pets/[id]/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ok, err, requireRole } from "@/lib/api";

const updateSchema = z.object({
  name:         z.string().min(1).max(60).optional(),
  breed:        z.string().min(1).max(80).optional(),
  species:      z.string().optional(),
  age:          z.number().min(0).max(30).optional(),
  weight:       z.number().optional(),
  gender:       z.string().optional(),
  color:        z.string().optional(),
  photoUrl:     z.string().url().optional().nullable(),
  photos:       z.array(z.string().url()).optional(),
  status:       z.enum(["AVAILABLE", "PENDING", "ADOPTED"]).optional(),
  description:  z.string().optional(),
  traits:       z.array(z.string()).optional(),
  vaccinated:   z.boolean().optional(),
  neutered:     z.boolean().optional(),
  houseTrained: z.boolean().optional(),
  goodWithKids: z.boolean().optional(),
  goodWithPets: z.boolean().optional(),
});

type Params = { params: { id: string } };

// GET /api/pets/[id]
export async function GET(_: NextRequest, { params }: Params) {
  const pet = await prisma.pet.findUnique({
    where: { id: params.id },
    include: {
      shelter: { select: { id: true, name: true } },
      adoptionRequests: {
        select: { id: true, status: true, userId: true, requestDate: true },
      },
    },
  });
  if (!pet) return err("Pet not found", 404);
  return ok({ pet });
}

// PATCH /api/pets/[id]
export async function PATCH(req: NextRequest, { params }: Params) {
  const { response } = await requireRole(["ADMIN", "MODERATOR"]);
  if (response) return response;

  try {
    const body   = await req.json();
    const parsed = updateSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0].message);

    const pet = await prisma.pet.update({
      where: { id: params.id },
      data:  parsed.data,
      include: { shelter: { select: { id: true, name: true } } },
    });
    return ok({ pet });
  } catch (e: any) {
    if (e.code === "P2025") return err("Pet not found", 404);
    return err("Failed to update pet", 500);
  }
}

// DELETE /api/pets/[id]
export async function DELETE(_: NextRequest, { params }: Params) {
  const { response } = await requireRole(["ADMIN"]);
  if (response) return response;

  try {
    await prisma.pet.delete({ where: { id: params.id } });
    return ok({ message: "Pet deleted" });
  } catch (e: any) {
    if (e.code === "P2025") return err("Pet not found", 404);
    return err("Failed to delete pet", 500);
  }
}
