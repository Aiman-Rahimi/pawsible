// lib/api.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { Role } from "@/types";

export function ok<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function err(message: string, status = 400) {
  return NextResponse.json({ error: message }, { status });
}

export async function requireAuth(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { user: null, response: err("Unauthorized", 401) };
  }
  return { user: session.user as any, response: null };
}

export async function requireRole(roles: Role[]) {
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return { user: null, response: err("Unauthorized", 401) };
  }
  const user = session.user as any;
  if (!roles.includes(user.role)) {
    return { user: null, response: err("Forbidden", 403) };
  }
  return { user, response: null };
}

export function paginate(url: URL) {
  const page  = Math.max(1, parseInt(url.searchParams.get("page")  ?? "1"));
  const limit = Math.min(50, parseInt(url.searchParams.get("limit") ?? "12"));
  return { page, limit, skip: (page - 1) * limit };
}
