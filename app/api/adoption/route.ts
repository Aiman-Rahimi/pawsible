// app/api/adoption/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth, requireRole, paginate } from "@/lib/api";
import { awardPoints } from "@/lib/points";

const requestSchema = z.object({
  petId:      z.string(),
  message:    z.string().optional(),
  experience: z.string().optional(),
  homeType:   z.string().optional(),
  hasYard:    z.boolean().optional(),
});

// GET /api/adoption — admins get all, users get their own
export async function GET(req: NextRequest) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  const url = new URL(req.url);
  const { page, limit, skip } = paginate(url);
  const status = url.searchParams.get("status") ?? undefined;

  const isAdmin = user.role === "ADMIN" || user.role === "MODERATOR";
  const where: any = {};

  if (!isAdmin) where.userId = user.id;
  if (status)   where.status = status;

  const [total, requests] = await Promise.all([
    prisma.adoptionRequest.count({ where }),
    prisma.adoptionRequest.findMany({
      where,
      skip,
      take:    limit,
      orderBy: { requestDate: "desc" },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        pet:  { select: { id: true, name: true, breed: true, photoUrl: true, status: true } },
      },
    }),
  ]);

  return ok({ requests, total, page, limit, totalPages: Math.ceil(total / limit) });
}

// POST /api/adoption — authenticated users
export async function POST(req: NextRequest) {
  const { user, response } = await requireAuth(req);
  if (response) return response;

  try {
    const body   = await req.json();
    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0].message);

    // Check pet exists and is available
    const pet = await prisma.pet.findUnique({ where: { id: parsed.data.petId } });
    if (!pet)                        return err("Pet not found", 404);
    if (pet.status !== "AVAILABLE")  return err("This pet is no longer available", 409);

    // Check for existing request
    const existing = await prisma.adoptionRequest.findUnique({
      where: { userId_petId: { userId: user.id, petId: parsed.data.petId } },
    });
    if (existing) return err("You already have a request for this pet", 409);

    const adoptionRequest = await prisma.adoptionRequest.create({
      data: { ...parsed.data, userId: user.id },
      include: {
        user: { select: { id: true, name: true, email: true, avatarUrl: true } },
        pet:  { select: { id: true, name: true, breed: true, photoUrl: true, status: true } },
      },
    });

    // Update pet status to PENDING
    await prisma.pet.update({
      where: { id: parsed.data.petId },
      data:  { status: "PENDING" },
    });

    // Award points for first request
    await awardPoints(user.id, "FIRST_REQUEST");

    return ok({ request: adoptionRequest }, 201);
  } catch (e) {
    console.error(e);
    return err("Failed to submit request", 500);
  }
}
