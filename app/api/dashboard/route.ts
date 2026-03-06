// app/api/dashboard/route.ts
import { NextRequest } from "next/server";
import prisma from "@/lib/prisma";
import { ok, err, requireRole } from "@/lib/api";

export async function GET(req: NextRequest) {
  const { response } = await requireRole(["ADMIN", "MODERATOR"]);
  if (response) return response;

  try {
    const [
      totalPets,
      availablePets,
      pendingPets,
      adoptedPets,
      totalRequests,
      pendingRequests,
      approvedRequests,
      totalUsers,
      recentRequests,
      rawMonthly,
      speciesBreakdown,
    ] = await Promise.all([
      prisma.pet.count(),
      prisma.pet.count({ where: { status: "AVAILABLE" } }),
      prisma.pet.count({ where: { status: "PENDING"   } }),
      prisma.pet.count({ where: { status: "ADOPTED"   } }),
      prisma.adoptionRequest.count(),
      prisma.adoptionRequest.count({ where: { status: "PENDING"  } }),
      prisma.adoptionRequest.count({ where: { status: "APPROVED" } }),
      prisma.user.count({ where: { role: "ADOPTER" } }),
      prisma.adoptionRequest.findMany({
        take: 5,
        orderBy: { requestDate: "desc" },
        include: {
          user: { select: { id: true, name: true, email: true, avatarUrl: true } },
          pet:  { select: { id: true, name: true, breed: true, photoUrl: true, status: true } },
        },
      }),
      // Monthly adoptions (last 6 months) via raw SQL
      prisma.$queryRaw<{ month: string; count: bigint }[]>`
        SELECT
          TO_CHAR(DATE_TRUNC('month', "request_date"), 'Mon YY') AS month,
          COUNT(*) AS count
        FROM adoption_requests
        WHERE status = 'APPROVED'
          AND "request_date" >= NOW() - INTERVAL '6 months'
        GROUP BY DATE_TRUNC('month', "request_date")
        ORDER BY DATE_TRUNC('month', "request_date")
      `,
      prisma.pet.groupBy({
        by: ["species"],
        _count: { species: true },
      }),
    ]);

    const adoptionsByMonth = rawMonthly.map((r) => ({
      month: r.month,
      count: Number(r.count),
    }));

    const speciesData = speciesBreakdown.map((s) => ({
      species: s.species,
      count:   s._count.species,
    }));

    const statusBreakdown = [
      { status: "Available", count: availablePets },
      { status: "Pending",   count: pendingPets   },
      { status: "Adopted",   count: adoptedPets   },
    ];

    return ok({
      totalPets,
      availablePets,
      pendingPets,
      adoptedPets,
      totalRequests,
      pendingRequests,
      approvedRequests,
      totalUsers,
      recentRequests,
      adoptionsByMonth,
      speciesBreakdown: speciesData,
      statusBreakdown,
    });
  } catch (e) {
    console.error(e);
    return err("Failed to load dashboard data", 500);
  }
}
