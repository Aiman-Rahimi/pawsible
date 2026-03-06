// lib/points.ts
import prisma from "@/lib/prisma";
import { ActivityType } from "@/types";

const POINT_VALUES: Record<ActivityType, number> = {
  PROFILE_COMPLETE:  50,
  FIRST_REQUEST:     100,
  REQUEST_APPROVED:  200,
  DAILY_VISIT:       5,
  PET_FAVORITED:     10,
  REVIEW_LEFT:       25,
};

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  PROFILE_COMPLETE:  "Completed profile setup",
  FIRST_REQUEST:     "Submitted first adoption request",
  REQUEST_APPROVED:  "Adoption request was approved! 🎉",
  DAILY_VISIT:       "Daily visit bonus",
  PET_FAVORITED:     "Saved a pet to favorites",
  REVIEW_LEFT:       "Left a review",
};

export async function awardPoints(userId: string, type: ActivityType, metadata?: object) {
  const points = POINT_VALUES[type];
  const description = ACTIVITY_LABELS[type];

  // Avoid duplicates for one-time activities
  const oneTime: ActivityType[] = ["PROFILE_COMPLETE", "FIRST_REQUEST"];
  if (oneTime.includes(type)) {
    const existing = await prisma.activityLog.findFirst({
      where: { userId, type },
    });
    if (existing) return null;
  }

  const [log] = await prisma.$transaction([
    prisma.activityLog.create({
      data: { userId, type, points, description, metadata: metadata ?? {} },
    }),
    prisma.user.update({
      where: { id: userId },
      data: { points: { increment: points } },
    }),
  ]);

  return { log, points };
}

export async function getUserPoints(userId: string) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { points: true },
  });
  return user?.points ?? 0;
}

export async function getLeaderboard(limit = 10) {
  const users = await prisma.user.findMany({
    where: { role: "ADOPTER" },
    orderBy: { points: "desc" },
    take: limit,
    select: {
      id: true,
      name: true,
      avatarUrl: true,
      points: true,
      adoptionRequests: {
        where: { status: "APPROVED" },
        select: { id: true },
      },
    },
  });

  return users.map((u, i) => ({
    id: u.id,
    name: u.name,
    avatarUrl: u.avatarUrl,
    points: u.points,
    rank: i + 1,
    adoptionsApproved: u.adoptionRequests.length,
  }));
}

export { POINT_VALUES, ACTIVITY_LABELS };
