// lib/auth.ts
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";
import { Role } from "@/types";

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  secret: process.env.NEXTAUTH_SECRET,
  pages: {
    signIn: "/auth/login",
    error:  "/auth/error",
  },
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const valid = await bcrypt.compare(credentials.password, user.passwordHash);
        if (!valid) return null;

        return {
          id:       user.id,
          name:     user.name,
          email:    user.email,
          role:     user.role as Role,
          points:   user.points,
          image:    user.avatarUrl ?? undefined,
        };
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id     = user.id;
        token.role   = (user as any).role;
        token.points = (user as any).points;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id     = token.id;
        (session.user as any).role   = token.role;
        (session.user as any).points = token.points;
      }
      return session;
    },
  },
};

// Helper: get userId from session (server-side)
export function getSessionUser(session: any) {
  return session?.user as {
    id: string;
    name: string;
    email: string;
    role: Role;
    points: number;
  } | undefined;
}

// Helper: check if user is admin or mod
export function canModerate(role: Role) {
  return role === "ADMIN" || role === "MODERATOR";
}
