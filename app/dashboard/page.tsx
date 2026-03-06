// app/dashboard/page.tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { DashboardClient } from "./DashboardClient";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  const user    = session?.user as any;
  if (!session || (user?.role !== "ADMIN" && user?.role !== "MODERATOR")) {
    redirect("/auth/login");
  }
  return <DashboardClient user={user} />;
}
