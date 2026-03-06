// app/dashboard/DashboardClient.tsx
"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { DashboardStats } from "@/types";
import { ChartDashboard } from "@/components/ChartDashboard";
import { AdoptionRequestCard } from "@/components/AdoptionRequestCard";
import { RefreshCcw, Plus } from "lucide-react";

export function DashboardClient({ user }: { user: any }) {
  const [stats,   setStats]   = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [lastRefresh, setLastRefresh] = useState(new Date());

  async function fetchStats() {
    setLoading(true);
    const res  = await fetch("/api/dashboard");
    const json = await res.json();
    setStats(json.data);
    setLastRefresh(new Date());
    setLoading(false);
  }

  useEffect(() => { fetchStats(); }, []);

  const statCards = stats ? [
    { label: "Available Pets",   value: stats.availablePets,   emoji: "✅", bg: "rgba(34,197,94,0.08)",   color: "#15803d" },
    { label: "Pending Requests", value: stats.pendingRequests, emoji: "⏳", bg: "rgba(251,191,36,0.1)",   color: "#92400e" },
    { label: "Pets Adopted",     value: stats.adoptedPets,     emoji: "🏡", bg: "rgba(232,98,42,0.08)",   color: "var(--accent)" },
    { label: "Total Adopters",   value: stats.totalUsers,      emoji: "👥", bg: "rgba(99,102,241,0.08)",  color: "#4f46e5" },
  ] : [];

  return (
    <div style={{ maxWidth: 1200, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Admin</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)",
            fontWeight: 900, letterSpacing: "-0.04em" }}>Dashboard</h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-body)" }}>
            Welcome back, <span style={{ color: "var(--accent)", fontWeight: 700 }}>{user.name}</span>
            {" "}&bull; <span style={{ textTransform: "uppercase", fontSize: "0.68rem", letterSpacing: "0.06em" }}>{user.role}</span>
          </p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <button onClick={fetchStats} disabled={loading} className="btn-outline"
            style={{ display: "flex", alignItems: "center", gap: 8, fontSize: "0.82rem", padding: "9px 20px" }}>
            <RefreshCcw style={{ width: 14, height: 14, animation: loading ? "spin 1s linear infinite" : "none" }} />
            Refresh
          </button>
          <Link href="/pets/new" className="btn-accent" style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <Plus style={{ width: 14, height: 14 }} /> Add Pet
          </Link>
        </div>
      </div>

      {/* Stat cards */}
      {loading && !stats ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: "2rem" }}>
          {[1,2,3,4].map(i => <div key={i} className="card-white" style={{ height: 110, animation: "pulse 1.5s ease-in-out infinite" }} />)}
        </div>
      ) : stats && (
        <>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: "2rem" }}>
            {statCards.map(s => (
              <div key={s.label} style={{ borderRadius: 20, padding: "1.5rem",
                background: s.bg, border: "1px solid rgba(0,0,0,0.05)" }}>
                <div style={{ fontSize: "2rem", marginBottom: "0.75rem" }}>{s.emoji}</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900,
                  letterSpacing: "-0.04em", color: "var(--ink)", lineHeight: 1 }}>{s.value}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 4,
                  fontFamily: "var(--font-body)", fontWeight: 600 }}>{s.label}</div>
              </div>
            ))}
          </div>

          <ChartDashboard stats={stats} />

          {/* Recent requests */}
          <div style={{ marginTop: "2.5rem" }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.25rem" }}>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 700, letterSpacing: "-0.03em" }}>
                Recent Requests
              </h2>
              <Link href="/adoption"
                style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--accent)",
                  textDecoration: "none", fontFamily: "var(--font-body)" }}>
                View all →
              </Link>
            </div>
            {stats.recentRequests.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", color: "var(--muted)",
                fontFamily: "var(--font-body)", fontSize: "0.85rem" }}>
                No recent requests
              </div>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                {stats.recentRequests.map((r: any) => (
                  <AdoptionRequestCard key={r.id} request={r} showActions={true} onUpdate={() => fetchStats()} />
                ))}
              </div>
            )}
          </div>
          <p style={{ fontSize: "0.68rem", color: "var(--muted)", textAlign: "center", marginTop: "2rem",
            fontFamily: "var(--font-body)" }}>
            Last refreshed: {lastRefresh.toLocaleTimeString()}
          </p>
        </>
      )}
    </div>
  );
}
