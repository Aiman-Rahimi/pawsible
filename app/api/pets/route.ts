// app/api/pets/route.ts
import { NextRequest } from "next/server";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ok, err, requireAuth, requireRole, paginate } from "@/lib/api";

const petSchema = z.object({
  name:         z.string().min(1).max(60),
  breed:        z.string().min(1).max(80),
  species:      z.string().default("Dog"),
  age:          z.number().min(0).max(30),
  weight:       z.number().optional(),
  gender:       z.string().default("Unknown"),
  color:        z.string().optional(),
  photoUrl:     z.string().url().optional(),
  photos:       z.array(z.string().url()).optional(),
  description:  z.string().optional(),
  traits:       z.array(z.string()).optional(),
  vaccinated:   z.boolean().default(false),
  neutered:     z.boolean().default(false),
  houseTrained: z.boolean().default(false),
  goodWithKids: z.boolean().default(false),
  goodWithPets: z.boolean().default(false),
});

// GET /api/pets — public, paginated, filterable
export async function GET(req: NextRequest) {
  const url  = new URL(req.url);
  const { page, limit, skip } = paginate(url);

  const species      = url.searchParams.get("species") ?? undefined;
  const status       = url.searchParams.get("status") ?? undefined;
  const search       = url.searchParams.get("search") ?? undefined;
  const goodWithKids = url.searchParams.get("goodWithKids");
  const goodWithPets = url.searchParams.get("goodWithPets");
  const ageMin       = url.searchParams.get("ageMin");
  const ageMax       = url.searchParams.get("ageMax");

  const where: any = {};
  if (species) where.species = species;
  if (status)  where.status  = status;
  if (goodWithKids === "true") where.goodWithKids = true;
  if (goodWithPets === "true") where.goodWithPets = true;
  if (ageMin || ageMax) {
    where.age = {};
    if (ageMin) where.age.gte = parseFloat(ageMin);
    if (ageMax) where.age.lte = parseFloat(ageMax);
  }
  if (search) {
    where.OR = [
      { name:  { contains: search, mode: "insensitive" } },
      { breed: { contains: search, mode: "insensitive" } },
      { description: { contains: search, mode: "insensitive" } },
    ];
  }

  const [total, pets] = await Promise.all([
    prisma.pet.count({ where }),
    prisma.pet.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
      include: { shelter: { select: { id: true, name: true } } },
    }),
  ]);

  return ok({ pets, total, page, limit, totalPages: Math.ceil(total / limit) });
}

// POST /api/pets — admin/mod only
export async function POST(req: NextRequest) {
  const { user, response } = await requireRole(["ADMIN", "MODERATOR"]);
  if (response) return response;

  try {
    const body   = await req.json();
    const parsed = petSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0].message);

    const pet = await prisma.pet.create({
      data: { ...parsed.data, shelterId: user.id },
      include: { shelter: { select: { id: true, name: true } } },
    });

    return ok({ pet }, 201);
  } catch (e) {
    console.error(e);
    return err("Failed to create pet", 500);
  }
}
