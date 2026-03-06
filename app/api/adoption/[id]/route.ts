// app/api/adoption/[id]/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth, requireRole } from "@/lib/api";
import { awardPoints } from "@/lib/points";

const reviewSchema = z.object({
  status:     z.enum(["APPROVED", "REJECTED", "CANCELLED"]),
  reviewNote: z.string().optional(),
});

type Params = { params: { id: string } };

// GET /api/adoption/[id]
export async function GET(req: NextRequest, { params }: Params) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  const request = await prisma.adoptionRequest.findUnique({
    where: { id: params.id },
    include: {
      user: { select: { id: true, name: true, email: true, avatarUrl: true, points: true } },
      pet:  { select: { id: true, name: true, breed: true, photoUrl: true, status: true, species: true } },
    },
  });

  if (!request) return err("Request not found", 404);

  const isAdmin = user.role === "ADMIN" || user.role === "MODERATOR";
  if (!isAdmin && request.userId !== user.id) return err("Forbidden", 403);

  return ok({ request });
}

// PATCH /api/adoption/[id] — admin review
export async function PATCH(req: NextRequest, { params }: Params) {
  const { user, response } = await requireRole(["ADMIN", "MODERATOR"]);
  if (response) return response;

  try {
    const body   = await req.json();
    const parsed = reviewSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0].message);

    const existing = await prisma.adoptionRequest.findUnique({
      where: { id: params.id },
    });
    if (!existing) return err("Request not found", 404);

    const updated = await prisma.adoptionRequest.update({
      where: { id: params.id },
      data:  { status: parsed.data.status, reviewNote: parsed.data.reviewNote },
      include: {
        user: { select: { id: true, name: true, email: true } },
        pet:  { select: { id: true, name: true } },
      },
    });

    // Update pet status based on decision
    if (parsed.data.status === "APPROVED") {
      await prisma.pet.update({
        where: { id: existing.petId },
        data:  { status: "ADOPTED" },
      });
      // Award points to adopter
      await awardPoints(existing.userId, "REQUEST_APPROVED", {
        petId: existing.petId,
        requestId: params.id,
      });
    } else if (parsed.data.status === "REJECTED" || parsed.data.status === "CANCELLED") {
      // Revert pet to available
      await prisma.pet.update({
        where: { id: existing.petId },
        data:  { status: "AVAILABLE" },
      });
    }

    return ok({ request: updated });
  } catch (e: any) {
    if (e.code === "P2025") return err("Request not found", 404);
    console.error(e);
    return err("Failed to update request", 500);
  }
}

// DELETE /api/adoption/[id] — user can cancel their own pending request
export async function DELETE(req: NextRequest, { params }: Params) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  const request = await prisma.adoptionRequest.findUnique({
    where: { id: params.id },
  });
  if (!request) return err("Request not found", 404);

  const isAdmin = user.role === "ADMIN" || user.role === "MODERATOR";
  if (!isAdmin && request.userId !== user.id) return err("Forbidden", 403);
  if (request.status !== "PENDING")           return err("Only pending requests can be cancelled");

  await prisma.$transaction([
    prisma.adoptionRequest.update({
      where: { id: params.id },
      data:  { status: "CANCELLED" },
    }),
    prisma.pet.update({
      where: { id: request.petId },
      data:  { status: "AVAILABLE" },
    }),
  ]);

  return ok({ message: "Request cancelled" });
}
