import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth } from "@/lib/api";

const reviewSchema = z.object({
  rating:  z.number().min(1).max(5),
  comment: z.string().optional(),
});

type Params = { params: { petId: string } };

// GET — get reviews for a pet
export async function GET(req: NextRequest, { params }: Params) {
  const reviews = await prisma.review.findMany({
    where:   { petId: params.petId },
    include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    orderBy: { createdAt: "desc" },
  });
  return ok({ reviews });
}

// POST — submit a review
export async function POST(req: NextRequest, { params }: Params) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  const body   = await req.json();
  const parsed = reviewSchema.safeParse(body);
  if (!parsed.success) return err(parsed.error.errors[0].message);

  // Check user has an approved request for this pet
  const approved = await prisma.adoptionRequest.findFirst({
    where: { userId: user.id, petId: params.petId, status: "APPROVED" },
  });
  if (!approved) return err("You can only review pets you have adopted", 403);

  try {
    const review = await prisma.review.create({
      data: { userId: user.id, petId: params.petId, ...parsed.data },
      include: { user: { select: { id: true, name: true, avatarUrl: true } } },
    });
    return ok({ review });
  } catch (e: any) {
    if (e.code === "P2002") return err("You have already reviewed this pet");
    return err("Failed to submit review", 500);
  }
}
