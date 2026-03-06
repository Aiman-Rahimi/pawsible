// app/auth/login/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true); setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password");
    else { router.push("/pets"); router.refresh(); }
  }

  async function demo(email: string, password: string) {
    setLoading(true);
    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/pets"); router.refresh();
  }

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "3rem 1rem", background: "var(--cream)" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900,
              letterSpacing: "-0.04em", color: "var(--ink)" }}>🐾 Pawsible</p>
          </Link>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700,
            marginTop: "1rem", letterSpacing: "-0.03em" }}>Welcome back</p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-body)" }}>
            Sign in to continue your adoption journey
          </p>
        </div>

        <div className="card-white" style={{ padding: "2.5rem" }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                borderRadius: 12, padding: "10px 16px", fontSize: "0.82rem", marginBottom: "1.5rem",
                fontFamily: "var(--font-body)" }}>
                {error}
              </div>
            )}
            <div style={{ marginBottom: "1.25rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: 8,
                color: "var(--ink)", fontFamily: "var(--font-body)" }}>Email</label>
              <input type="email" required className="field" placeholder="you@example.com"
                value={form.email} onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
            </div>
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ display: "block", fontSize: "0.78rem", fontWeight: 700, marginBottom: 8,
                color: "var(--ink)", fontFamily: "var(--font-body)" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required className="field"
                  style={{ paddingRight: 44 }} placeholder="••••••••"
                  value={form.password} onChange={e => setForm(f => ({ ...f, password: e.target.value }))} />
                <button type="button" onClick={() => setShowPw(!showPw)}
                  style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)",
                    background: "none", border: "none", cursor: "pointer", color: "var(--muted)" }}>
                  {showPw ? <EyeOff style={{ width: 16, height: 16 }} /> : <Eye style={{ width: 16, height: 16 }} />}
                </button>
              </div>
            </div>
            <button type="submit" disabled={loading} className="btn-ink"
              style={{ width: "100%", justifyContent: "center", opacity: loading ? 0.6 : 1, padding: "13px 0" }}>
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          {/* Demo */}
          <div style={{ marginTop: "1.75rem", paddingTop: "1.75rem", borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: "0.7rem", color: "var(--muted)", textAlign: "center", marginBottom: 10,
              fontFamily: "var(--font-body)", letterSpacing: "0.06em", textTransform: "uppercase", fontWeight: 600 }}>
              Demo accounts
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8 }}>
              {[
                { label: "Admin", email: "admin@pawsible.com", pw: "admin123" },
                { label: "Mod",   email: "mod@pawsible.com",   pw: "admin123" },
                { label: "User",  email: "alice@example.com",  pw: "user123"  },
              ].map(d => (
                <button key={d.label} onClick={() => demo(d.email, d.pw)} disabled={loading}
                  style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600,
                    padding: "8px 0", borderRadius: 10, border: "1.5px solid var(--border)",
                    background: "var(--cream)", color: "var(--ink)", cursor: "pointer", transition: "all 0.15s" }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = "var(--accent)"; e.currentTarget.style.color = "var(--accent)"; }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--ink)"; }}>
                  {d.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--muted)",
          marginTop: "1.5rem", fontFamily: "var(--font-body)" }}>
          No account?{" "}
          <Link href="/auth/register"
            style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>
            Join Pawsible →
          </Link>
        </p>
      </div>
    </div>
  );
}
