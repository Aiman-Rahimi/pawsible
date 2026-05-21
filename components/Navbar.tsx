"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { Award, ChevronDown, Heart, LayoutDashboard, LogOut, Menu, PawPrint, Plus, Sparkles, UserCircle, X } from "lucide-react";
import { NotificationBell } from "./NotificationBell";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);
  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const navLinks = [
    { href: "/pets", label: "Browse" },
    { href: "/match", label: "Match" },
    { href: "/leaderboard", label: "Rewards" },
    ...(isAdmin ? [{ href: "/dashboard", label: "Dashboard" }, { href: "/adoption", label: "Requests" }] : []),
  ];

  return (
    <nav
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        borderBottom: "1px solid var(--border)",
        background: "rgba(251, 247, 240, 0.86)",
        backdropFilter: "blur(22px)",
      }}
    >
      <div
        className="container"
        style={{
          height: 68,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "1rem",
        }}
      >
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <span
            style={{
              width: 38,
              height: 38,
              borderRadius: 14,
              background: "var(--ink)",
              color: "var(--paper)",
              display: "grid",
              placeItems: "center",
              boxShadow: "var(--shadow-sm)",
            }}
          >
            <PawPrint style={{ width: 20, height: 20 }} fill="currentColor" />
          </span>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 900, fontSize: "1.28rem", color: "var(--ink)" }}>
            Pawsible
          </span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className={`nav-link ${pathname.startsWith(link.href) ? "active" : ""}`}>
              {link.label}
            </Link>
          ))}
          {session && (
            <Link href="/favorites" className={`nav-link ${pathname.startsWith("/favorites") ? "active" : ""}`}>
              Saved
            </Link>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 10 }} className="hidden md:flex">
          {session ? (
            <>
              <NotificationBell />
              {isAdmin && (
                <Link href="/pets/new" className="btn-accent" style={{ minHeight: 38, padding: "0.55rem 0.9rem" }}>
                  <Plus style={{ width: 14, height: 14 }} /> Add Pet
                </Link>
              )}
              <div style={{ position: "relative" }}>
                <button
                  onClick={() => setDropOpen((open) => !open)}
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 10,
                    border: "1px solid var(--border)",
                    background: "rgba(255,255,255,0.86)",
                    borderRadius: 999,
                    padding: "0.35rem 0.75rem 0.35rem 0.35rem",
                    cursor: "pointer",
                    boxShadow: "var(--shadow-sm)",
                  }}
                  aria-expanded={dropOpen}
                >
                  <span
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: "50%",
                      background: "linear-gradient(135deg, var(--accent), var(--rose))",
                      color: "#fff",
                      display: "grid",
                      placeItems: "center",
                      fontWeight: 900,
                    }}
                  >
                    {user?.name?.[0]?.toUpperCase() ?? "U"}
                  </span>
                  <span style={{ textAlign: "left", lineHeight: 1.15 }}>
                    <span style={{ display: "block", fontSize: "0.8rem", fontWeight: 850, color: "var(--ink)" }}>{user?.name}</span>
                    <span style={{ display: "flex", alignItems: "center", gap: 4, fontSize: "0.68rem", color: "var(--muted)" }}>
                      <Award style={{ width: 11, height: 11 }} /> {user?.points ?? 0} pts
                    </span>
                  </span>
                  <ChevronDown style={{ width: 14, height: 14, color: "var(--muted)" }} />
                </button>

                {dropOpen && (
                  <div
                    className="panel"
                    style={{
                      position: "absolute",
                      right: 0,
                      top: "calc(100% + 10px)",
                      width: 230,
                      padding: 8,
                      zIndex: 200,
                    }}
                  >
                    {[
                      { href: "/profile", label: "My Profile", Icon: UserCircle },
                      { href: "/adoption/mine", label: "My Requests", Icon: Heart },
                      { href: "/leaderboard", label: "Reward Ranking", Icon: Sparkles },
                      ...(isAdmin ? [{ href: "/dashboard", label: "Admin Dashboard", Icon: LayoutDashboard }] : []),
                    ].map((item) => (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setDropOpen(false)}
                        style={{
                          display: "flex",
                          alignItems: "center",
                          gap: 10,
                          padding: "0.72rem 0.8rem",
                          color: "var(--ink)",
                          textDecoration: "none",
                          borderRadius: 12,
                          fontSize: "0.86rem",
                          fontWeight: 700,
                        }}
                      >
                        <item.Icon style={{ width: 16, height: 16, color: "var(--muted)" }} />
                        {item.label}
                      </Link>
                    ))}
                    <button
                      onClick={() => {
                        setDropOpen(false);
                        signOut({ callbackUrl: "/" });
                      }}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: 10,
                        width: "100%",
                        padding: "0.72rem 0.8rem",
                        border: 0,
                        borderTop: "1px solid var(--border)",
                        marginTop: 6,
                        background: "transparent",
                        color: "#c92a2a",
                        cursor: "pointer",
                        fontSize: "0.86rem",
                        fontWeight: 800,
                      }}
                    >
                      <LogOut style={{ width: 16, height: 16 }} /> Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <Link href="/auth/login" className="btn-ghost" style={{ minHeight: 38 }}>
                Sign In
              </Link>
              <Link href="/auth/register" className="btn-accent" style={{ minHeight: 38 }}>
                Join Free
              </Link>
            </>
          )}
        </div>

        <button
          onClick={() => setMobileOpen((open) => !open)}
          className="md:hidden"
          style={{
            width: 42,
            height: 42,
            borderRadius: 14,
            border: "1px solid var(--border)",
            background: "#fff",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
          }}
          aria-label="Open navigation menu"
        >
          {mobileOpen ? <X style={{ width: 20, height: 20 }} /> : <Menu style={{ width: 20, height: 20 }} />}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden" style={{ borderTop: "1px solid var(--border)", background: "rgba(251,247,240,0.98)" }}>
          <div className="container" style={{ padding: "0.75rem 0 1.2rem", display: "grid", gap: 8 }}>
            {[...navLinks, ...(session ? [{ href: "/favorites", label: "Saved" }, { href: "/adoption/mine", label: "My Requests" }] : [])].map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={`nav-link ${pathname.startsWith(link.href) ? "active" : ""}`}
                style={{ justifyContent: "center", padding: "0.8rem 1rem" }}
              >
                {link.label}
              </Link>
            ))}
            {session ? (
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-outline">
                Sign Out
              </button>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
                <Link href="/auth/login" className="btn-ghost" onClick={() => setMobileOpen(false)}>
                  Sign In
                </Link>
                <Link href="/auth/register" className="btn-accent" onClick={() => setMobileOpen(false)}>
                  Join Free
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
