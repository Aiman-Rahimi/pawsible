// app/profile/page.tsx
"use client";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import Link from "next/link";
import { Heart, Trophy, PawPrint, LayoutDashboard } from "lucide-react";

export default function ProfilePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user = session?.user as any;

  useEffect(() => { if (status === "unauthenticated") router.push("/auth/login"); }, [status]);
  if (!session) return null;

  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Account</div>
      <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)",
        fontWeight: 900, letterSpacing: "-0.04em", marginBottom: "2rem" }}>My Profile</h1>

      {/* Avatar card */}
      <div className="card-white" style={{ padding: "1.75rem", marginBottom: "1.25rem" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div style={{ width: 60, height: 60, borderRadius: 18, flexShrink: 0,
            background: "linear-gradient(135deg,var(--accent),#cf4f1e)",
            display: "flex", alignItems: "center", justifyContent: "center",
            color: "white", fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.5rem" }}>
            {user?.name?.[0]?.toUpperCase()}
          </div>
          <div style={{ flex: 1 }}>
            <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.2rem",
              letterSpacing: "-0.02em" }}>{user?.name}</h2>
            <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginTop: 2 }}>{user?.email}</p>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginTop: 8 }}>
              <span className="badge-role">{user?.role}</span>
              <span style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--gold)",
                fontFamily: "var(--font-body)" }}>⭐ {user?.points ?? 0} points</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick links */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: "1.25rem" }}>
        {[
          { href: "/adoption/mine", icon: Heart,          label: "My Requests",  color: "#ef4444" },
          { href: "/leaderboard",   icon: Trophy,         label: "Leaderboard",  color: "var(--gold)" },
          { href: "/pets",          icon: PawPrint,       label: "Browse Pets",  color: "var(--accent)" },
          ...(isAdmin ? [{ href: "/dashboard", icon: LayoutDashboard, label: "Dashboard", color: "#6366f1" }] : []),
        ].map(l => (
          <Link key={l.href} href={l.href}
            style={{ display: "flex", alignItems: "center", gap: 12, padding: "14px 18px", textDecoration: "none",
              transition: "all 0.2s" }}
            className="card-white">
            <l.icon style={{ width: 18, height: 18, color: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-body)" }}>
              {l.label}
            </span>
          </Link>
        ))}
      </div>

      {/* Points card */}
      <div className="card-cream" style={{ padding: "1.5rem" }}>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem",
          letterSpacing: "-0.02em", marginBottom: "1rem" }}>Points Balance</p>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between",
          background: "white", borderRadius: 14, padding: "16px 20px" }}>
          <span style={{ fontSize: "0.88rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>Total earned</span>
          <span style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900,
            color: "var(--accent)", letterSpacing: "-0.03em" }}>{user?.points ?? 0}</span>
        </div>
        <p style={{ fontSize: "0.72rem", color: "var(--muted)", marginTop: 10, fontFamily: "var(--font-body)" }}>
          Keep adopting and engaging to earn more points and climb the leaderboard! 🏆
        </p>
      </div>
    </div>
  );
}
