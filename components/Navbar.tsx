"use client";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { PawPrint, Menu, X, ChevronDown, Heart, Plus, LogOut, UserCircle } from "lucide-react";

export function Navbar() {
  const { data: session } = useSession();
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen,   setDropOpen]   = useState(false);
  const user    = session?.user as any;
  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const navLinks = [
    { href: "/pets",        label: "Browse Pets" },
    { href: "/leaderboard", label: "Leaderboard" },
    ...(isAdmin ? [{ href: "/dashboard", label: "Dashboard" }, { href: "/adoption", label: "Requests" }] : []),
  ];

  const linkStyle = (href: string): React.CSSProperties => ({
    display: "inline-flex", alignItems: "center",
    fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 700,
    letterSpacing: "0.08em", textTransform: "uppercase",
    padding: "6px 14px", borderRadius: "100px",
    color: pathname.startsWith(href) ? "var(--paper)" : "var(--muted)",
    background: pathname.startsWith(href) ? "var(--ink)" : "transparent",
    textDecoration: "none", transition: "all 0.15s",
  });

  return (
    <nav style={{
      position: "sticky", top: 0, zIndex: 100,
      background: "rgba(245,240,232,0.92)",
      backdropFilter: "blur(20px)",
      borderBottom: "1px solid var(--border)",
    }}>
      <div style={{
        maxWidth: 1200, margin: "0 auto", padding: "0 2rem",
        height: 64, display: "flex", alignItems: "center", justifyContent: "space-between"
      }}>
        {/* Logo */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: 10, textDecoration: "none" }}>
          <PawPrint style={{ width: 22, height: 22, color: "var(--accent)" }} fill="currentColor" />
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.15rem", letterSpacing: "-0.03em", color: "var(--ink)" }}>
            Pawsible
          </span>
        </Link>

        {/* Desktop nav */}
        <div style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} style={linkStyle(l.href)}
              onMouseEnter={e => { if (!pathname.startsWith(l.href)) { e.currentTarget.style.background = "rgba(0,0,0,0.06)"; e.currentTarget.style.color = "var(--ink)"; }}}
              onMouseLeave={e => { if (!pathname.startsWith(l.href)) { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--muted)"; }}}>
              {l.label}
            </Link>
          ))}
          {isAdmin && (
            <Link href="/pets/new" style={{
              display: "inline-flex", alignItems: "center", gap: 6,
              fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 700,
              padding: "6px 14px", borderRadius: "100px",
              background: "var(--accent)", color: "white", textDecoration: "none",
              marginLeft: 4, transition: "all 0.2s",
            }}>
              <Plus style={{ width: 12, height: 12 }} /> Add Pet
            </Link>
          )}
        </div>

        {/* Auth */}
        <div style={{ display: "flex", alignItems: "center", gap: 8 }} className="hidden md:flex">
          {session ? (
            <div style={{ position: "relative" }}>
              <button onClick={() => setDropOpen(!dropOpen)} style={{
                display: "flex", alignItems: "center", gap: 10,
                padding: "6px 12px 6px 8px", borderRadius: "100px",
                border: "1.5px solid var(--border)", background: "white",
                cursor: "pointer", fontFamily: "var(--font-body)", transition: "border-color 0.2s",
              }}
                onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ink)")}
                onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
                <div style={{
                  width: 28, height: 28, borderRadius: "50%",
                  background: "linear-gradient(135deg, var(--accent), #cf4f1e)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.85rem",
                }}>
                  {user?.name?.[0]?.toUpperCase()}
                </div>
                <div style={{ textAlign: "left" }}>
                  <p style={{ fontSize: "0.78rem", fontWeight: 700, color: "var(--ink)", lineHeight: 1.2, fontFamily: "var(--font-body)" }}>{user?.name}</p>
                  <p style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>⭐ {user?.points ?? 0} pts</p>
                </div>
                <ChevronDown style={{ width: 12, height: 12, color: "var(--muted)" }} />
              </button>

              {dropOpen && (
                <div style={{
                  position: "absolute", right: 0, top: "calc(100% + 8px)", width: 200,
                  background: "white", borderRadius: 16, boxShadow: "0 8px 40px rgba(0,0,0,0.12)",
                  border: "1px solid var(--border)", padding: "6px 0", zIndex: 200,
                }}>
                  {[
                    { href: "/profile",       label: "My Profile",  Icon: UserCircle },
                    { href: "/adoption/mine", label: "My Requests", Icon: Heart      },
                  ].map(item => (
                    <Link key={item.href} href={item.href} onClick={() => setDropOpen(false)} style={{
                      display: "flex", alignItems: "center", gap: 10, padding: "10px 16px",
                      fontSize: "0.82rem", color: "var(--ink)", textDecoration: "none",
                      fontFamily: "var(--font-body)", transition: "background 0.15s",
                    }}
                      onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
                      onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                      <item.Icon style={{ width: 14, height: 14, color: "var(--muted)" }} />
                      {item.label}
                    </Link>
                  ))}
                  <div style={{ borderTop: "1px solid var(--border)", margin: "4px 0" }} />
                  <button onClick={() => { setDropOpen(false); signOut({ callbackUrl: "/" }); }} style={{
                    display: "flex", alignItems: "center", gap: 10, padding: "10px 16px", width: "100%",
                    fontSize: "0.82rem", color: "#dc2626", background: "none", border: "none",
                    cursor: "pointer", fontFamily: "var(--font-body)", textAlign: "left",
                  }}
                    onMouseEnter={e => (e.currentTarget.style.background = "#fef2f2")}
                    onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                    <LogOut style={{ width: 14, height: 14 }} /> Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <Link href="/auth/login"    className="btn-ghost">Sign In</Link>
              <Link href="/auth/register" className="btn-accent">Join Free →</Link>
            </>
          )}
        </div>

        {/* Mobile burger */}
        <button onClick={() => setMobileOpen(!mobileOpen)} className="md:hidden" style={{
          padding: 8, borderRadius: 10, border: "1.5px solid var(--border)",
          background: "white", cursor: "pointer",
        }}>
          {mobileOpen ? <X style={{ width: 18, height: 18 }} /> : <Menu style={{ width: 18, height: 18 }} />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{
          background: "var(--paper)", borderTop: "1px solid var(--border)",
          padding: "12px 2rem 20px",
        }} className="md:hidden">
          {navLinks.map(l => (
            <Link key={l.href} href={l.href} onClick={() => setMobileOpen(false)} style={{
              display: "block", padding: "12px 0", fontSize: "0.88rem", fontWeight: 600,
              color: pathname.startsWith(l.href) ? "var(--accent)" : "var(--ink)",
              textDecoration: "none", borderBottom: "1px solid var(--border)",
              fontFamily: "var(--font-body)",
            }}>
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: 8, marginTop: 16 }}>
            {session ? (
              <button onClick={() => signOut({ callbackUrl: "/" })} className="btn-outline" style={{ flex: 1 }}>
                Sign Out
              </button>
            ) : (
              <>
                <Link href="/auth/login"    className="btn-ghost"  style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Sign In</Link>
                <Link href="/auth/register" className="btn-accent" style={{ flex: 1 }} onClick={() => setMobileOpen(false)}>Join Free</Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
