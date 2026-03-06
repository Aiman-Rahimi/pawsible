// app/api/auth/register/route.ts
import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import prisma from "@/lib/prisma";
import { ok, err } from "@/lib/api";
import { awardPoints } from "@/lib/points";

const registerSchema = z.object({
  name:     z.string().min(2).max(60),
  email:    z.string().email(),
  password: z.string().min(8).max(100),
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = registerSchema.safeParse(body);
    if (!parsed.success) return err(parsed.error.errors[0].message);

    const { name, email, password } = parsed.data;

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) return err("Email already registered", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const user = await prisma.user.create({
      data: { name, email, passwordHash },
      select: { id: true, name: true, email: true, role: true, points: true },
    });

    // Award signup points
    await awardPoints(user.id, "PROFILE_COMPLETE");

    return ok({ user, message: "Account created successfully!" }, 201);
  } catch (e) {
    console.error(e);
    return err("Internal server error", 500);
  }
}
