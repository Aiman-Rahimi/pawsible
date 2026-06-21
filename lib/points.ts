// lib/points.ts
import prisma from "@/lib/prisma";
import { ActivityType } from "@/types";

const POINT_VALUES: Record<ActivityType, number> = {
  PROFILE_COMPLETE: 50,
  FIRST_REQUEST: 100,
  REQUEST_APPROVED: 200,
  DAILY_VISIT: 5,
  PET_FAVORITED: 10,
  REVIEW_LEFT: 25,
};

const ACTIVITY_LABELS: Record<ActivityType, string> = {
  PROFILE_COMPLETE: "Completed profile setup",
  FIRST_REQUEST: "Submitted first adoption request",
  REQUEST_APPROVED: "Adoption request was approved",
  DAILY_VISIT: "Daily visit bonus",
  PET_FAVORITED: "Saved a pet to favorites",
  REVIEW_LEFT: "Left a review",
};

// Activities that can only ever be awarded ONCE per user.
const ONE_TIME_ACTIVITIES: ActivityType[] = ["PROFILE_COMPLETE", "FIRST_REQUEST"];

// Activities that can only be awarded ONCE per calendar day per user.
const DAILY_ACTIVITIES: ActivityType[] = ["DAILY_VISIT"];

export const REWARD_TIERS = [
  { key: "new-friend", name: "New Friend", minPoints: 0, perk: "Welcome badge", accent: "#6b7280" },
  { key: "kind-heart", name: "Kind Heart", minPoints: 150, perk: "Priority saved-pet reminders", accent: "#0ea5e9" },
  { key: "home-hero", name: "Home Hero", minPoints: 400, perk: "Featured adopter profile", accent: "#f97316" },
  { key: "shelter-champion", name: "Shelter Champion", minPoints: 750, perk: "Early access to new arrivals", accent: "#10b981" },
  { key: "pawsible-legend", name: "Pawsible Legend", minPoints: 1200, perk: "VIP adoption concierge", accent: "#8b5cf6" },
] as const;

export type RewardTier = (typeof REWARD_TIERS)[number];

export function getRewardTier(points: number) {
  return [...REWARD_TIERS].reverse().find((tier) => points >= tier.minPoints) ?? REWARD_TIERS[0];
}

export function getNextReward(points: number) {
  const next = REWARD_TIERS.find((tier) => tier.minPoints > points);
  if (!next) {
    return { tier: null, pointsNeeded: 0, progress: 100 };
  }

  const current = getRewardTier(points);
  const range = Math.max(1, next.minPoints - current.minPoints);
  const progress = Math.min(99, Math.round(((points - current.minPoints) / range) * 100));

  return { tier: next, pointsNeeded: next.minPoints - points, progress };
}

/**
 * Use Case: Manage Reward Ranking Points
 * Steps 1-2 (Detect trigger + resolve point value) happen in the caller —
 * e.g. app/api/adoption/[id]/route.ts calls awardPoints(userId, "REQUEST_APPROVED").
 *
 * Alt Sequence - Invalid Activity:
 * Rejects duplicate / not-allowed activity triggers before any points move.
 */
async function isDuplicateActivity(userId: string, type: ActivityType): Promise<boolean> {
  if (ONE_TIME_ACTIVITIES.includes(type)) {
    const existing = await prisma.activityLog.findFirst({ where: { userId, type } });
    return !!existing;
  }

  if (DAILY_ACTIVITIES.includes(type)) {
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0);
    const existing = await prisma.activityLog.findFirst({
      where: { userId, type, createdAt: { gte: startOfDay } },
    });
    return !!existing;
  }

  return false;
}

async function logSecurityWarning(userId: string, type: ActivityType, reason: string, metadata?: object) {
  await prisma.securityLog.create({
    data: { userId, activityType: type, reason, metadata: metadata ?? {} },
  });
}

/**
 * Alt Sequence - Database Exception:
 * If the DB write fails (connection dropped, Neon cold-start, etc.), queue the
 * update instead of losing it, and notify admins so it can be retried later.
 */
async function queueForRetry(userId: string, type: ActivityType, points: number, metadata?: object) {
  await prisma.pointsQueue.create({
    data: { userId, activityType: type, points, metadata: metadata ?? {} },
  });

  const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
  await Promise.all(
    admins.map((admin) =>
      prisma.notification.create({
        data: {
          userId: admin.id,
          title: "Reward points update failed",
          message: `A points update (${type}) for a user could not reach the database and has been queued for retry.`,
          type: "WARNING",
          link: "/dashboard",
        },
      })
    )
  );
}

/**
 * Main use case implementation — System (Automated) actor calls this whenever
 * a qualifying activity happens (adoption approved, profile completed, etc).
 *
 * Main Sequence:
 *  1-2. Caller passes the activity type -> point value resolved from POINT_VALUES
 *  3.   New total calculated (current balance + activity points)
 *  4.   Adopter record updated in the database
 *  5-6. Rank/tier threshold checked & updated if crossed
 *  7.   Transaction logged via ActivityLog for auditing
 */
export async function awardPoints(userId: string, type: ActivityType, metadata?: object) {
  // Alt - Invalid Activity: duplicate or not-allowed trigger -> cancel + log warning
  const duplicate = await isDuplicateActivity(userId, type);
  if (duplicate) {
    await logSecurityWarning(userId, type, "Duplicate or invalid activity trigger", metadata);
    return { status: "cancelled" as const, reason: "duplicate_activity" };
  }

  const points = POINT_VALUES[type];
  const description = ACTIVITY_LABELS[type];

  try {
    // Step 2: retrieve current balance
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { points: true, rewardTier: true },
    });

    if (!user) {
      await logSecurityWarning(userId, type, "Activity trigger for unknown user", metadata);
      return { status: "cancelled" as const, reason: "unknown_user" };
    }

    // Step 3: calculate new total
    const newTotal = user.points + points;

    // Step 5: check if the new total crosses a rank/tier threshold
    const previousTier = getRewardTier(user.points);
    const newTier = getRewardTier(newTotal);
    const rankChanged = newTier.key !== previousTier.key;
    // Alt - Max Rank Reached: if already at the top tier, getRewardTier() simply
    // keeps returning that same tier, so points still update but rank stays put.

    // Step 4 + 6 + 7: update points, update rank, log the transaction (atomic)
    const [log] = await prisma.$transaction([
      prisma.activityLog.create({
        data: { userId, type, points, description, metadata: metadata ?? {} },
      }),
      prisma.user.update({
        where: { id: userId },
        data: { points: newTotal, rewardTier: newTier.key },
      }),
    ]);

    if (rankChanged) {
      await prisma.notification.create({
        data: {
          userId,
          title: "Rank up! 🎉",
          message: `Congrats! You've reached the "${newTier.name}" rank with ${newTotal} points.`,
          type: "SUCCESS",
          link: "/leaderboard",
        },
      });
    }

    return { status: "success" as const, log, points, newTotal, rewardTier: newTier.key, rankChanged };
  } catch (error) {
    // Alt - Database Exception: queue for retry instead of failing silently
    console.error("[awardPoints] DB error, queueing for retry:", error);
    await queueForRetry(userId, type, points, metadata).catch((queueError) =>
      console.error("[awardPoints] failed to queue retry:", queueError)
    );
    return { status: "queued" as const, reason: "database_unreachable" };
  }
}

/**
 * Retry worker for the Alt Sequence - Database Exception path.
 * Call this from an admin-only endpoint (see app/api/rewards/retry-queue/route.ts)
 * to process any points updates that failed earlier due to a DB outage.
 */
export async function processPointsQueue() {
  const pending = await prisma.pointsQueue.findMany({ where: { status: "PENDING" } });
  const results: { id: string; status: "processed" | "failed" }[] = [];

  for (const item of pending) {
    try {
      const user = await prisma.user.findUnique({ where: { id: item.userId }, select: { points: true } });
      if (!user) {
        await prisma.pointsQueue.update({
          where: { id: item.id },
          data: { status: "FAILED", attempts: { increment: 1 } },
        });
        results.push({ id: item.id, status: "failed" });
        continue;
      }

      const newTotal = user.points + item.points;
      const newTier = getRewardTier(newTotal);
      const activityType = item.activityType as ActivityType;

      await prisma.$transaction([
        prisma.activityLog.create({
          data: {
            userId: item.userId,
            type: activityType,
            points: item.points,
            description: ACTIVITY_LABELS[activityType] ?? "Queued activity (retried)",
            metadata: (item.metadata as object) ?? {},
          },
        }),
        prisma.user.update({
          where: { id: item.userId },
          data: { points: newTotal, rewardTier: newTier.key },
        }),
        prisma.pointsQueue.update({
          where: { id: item.id },
          data: { status: "PROCESSED", processedAt: new Date() },
        }),
      ]);

      results.push({ id: item.id, status: "processed" });
    } catch {
      await prisma.pointsQueue.update({
        where: { id: item.id },
        data: { attempts: { increment: 1 } },
      });
      results.push({ id: item.id, status: "failed" });
    }
  }

  return results;
}

export async function getUserPoints(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { points: true } });
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
    rewardTier: getRewardTier(u.points),
    nextReward: getNextReward(u.points),
  }));
}

export { POINT_VALUES, ACTIVITY_LABELS };
