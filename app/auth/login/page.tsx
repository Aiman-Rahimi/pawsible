// app/auth/login/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Eye, EyeOff, HeartHandshake, PawPrint, ShieldCheck, Sparkles } from "lucide-react";

export default function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await signIn("credentials", { ...form, redirect: false });
    setLoading(false);
    if (res?.error) setError("Invalid email or password");
    else {
      router.push("/pets");
      router.refresh();
    }
  }

  async function demo(email: string, password: string) {
    setLoading(true);
    await signIn("credentials", { email, password, redirect: false });
    setLoading(false);
    router.push("/pets");
    router.refresh();
  }

  return (
    <div className="auth-stage">
      <section className="auth-art">
        <Image
          src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?auto=format&fit=crop&w=1400&q=85"
          alt="Two adopted dogs walking with their owner"
          fill
          priority
          style={{ objectFit: "cover" }}
          sizes="(max-width: 920px) 100vw, 60vw"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(22,20,18,0.62), rgba(22,20,18,0.18) 55%, rgba(22,20,18,0.52))" }} />
        <div style={{ position: "relative", color: "#fff", maxWidth: 620 }}>
          <span className="metric-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderColor: "rgba(255,255,255,0.24)" }}>
            <ShieldCheck style={{ width: 15, height: 15 }} /> Trusted shelter workflow
          </span>
          <h1 className="heading-lg" style={{ marginTop: "1rem", textShadow: "0 18px 42px rgba(0,0,0,0.36)" }}>
            Continue the journey toward a better homecoming.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.8, marginTop: "1rem", maxWidth: 520 }}>
            Save pets, track requests, earn reward tiers, and keep your adoption story moving.
          </p>
        </div>
      </section>

      <section className="auth-form-wrap">
        <div style={{ width: "100%", maxWidth: 430 }}>
          <Link href="/" style={{ display: "inline-flex", alignItems: "center", gap: 10, color: "var(--ink)", textDecoration: "none", marginBottom: "1.6rem" }}>
            <span style={{ width: 40, height: 40, borderRadius: 15, background: "var(--ink)", color: "var(--paper)", display: "grid", placeItems: "center" }}>
              <PawPrint style={{ width: 21, height: 21 }} />
            </span>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.35rem", fontWeight: 900 }}>Pawsible</span>
          </Link>

          <div className="glass-panel" style={{ borderRadius: 28, padding: "clamp(1.4rem, 4vw, 2rem)" }}>
            <div style={{ marginBottom: "1.6rem" }}>
              <div className="eyebrow">Welcome back</div>
              <h2 style={{ fontSize: "2.15rem", fontWeight: 900, lineHeight: 1.05, marginTop: "0.65rem" }}>Sign in to your adoption hub.</h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.65, marginTop: "0.65rem" }}>Pick up your saved pets, requests, and rewards right where you left them.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: "rgba(180,35,24,0.1)", border: "1px solid rgba(180,35,24,0.18)", color: "#b42318", borderRadius: 14, padding: "0.8rem 0.95rem", fontSize: "0.86rem", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}
              <div style={{ display: "grid", gap: "1rem" }}>
                <label>
                  <span className="badge-soft" style={{ marginBottom: 8 }}>Email</span>
                  <input type="email" required className="field" placeholder="you@example.com" value={form.email} onChange={(e) => setForm((current) => ({ ...current, email: e.target.value }))} />
                </label>
                <label>
                  <span className="badge-soft" style={{ marginBottom: 8 }}>Password</span>
                  <span style={{ position: "relative", display: "block" }}>
                    <input type={showPw ? "text" : "password"} required className="field" style={{ paddingRight: 46 }} placeholder="Enter your password" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} />
                    <button type="button" onClick={() => setShowPw((show) => !show)} aria-label={showPw ? "Hide password" : "Show password"} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", color: "var(--muted)", cursor: "pointer" }}>
                      {showPw ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                    </button>
                  </span>
                </label>
                <button type="submit" disabled={loading} className="btn-ink">
                  {loading ? "Signing in..." : "Sign in"} <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </form>

            <div style={{ marginTop: "1.35rem", paddingTop: "1.35rem", borderTop: "1px solid var(--border)" }}>
              <p style={{ color: "var(--muted)", fontSize: "0.76rem", textTransform: "uppercase", letterSpacing: "0.1em", fontWeight: 850, marginBottom: 10 }}>Demo accounts</p>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
                {[
                  { label: "Admin", email: "admin@pawsible.com", pw: "admin123", Icon: Sparkles },
                  { label: "Mod", email: "mod@pawsible.com", pw: "admin123", Icon: ShieldCheck },
                  { label: "User", email: "alice@example.com", pw: "user123", Icon: HeartHandshake },
                ].map(({ label, email, pw, Icon }) => (
                  <button key={label} onClick={() => demo(email, pw)} disabled={loading} className="btn-ghost" style={{ minHeight: 74, borderRadius: 18, flexDirection: "column", gap: 5, padding: "0.65rem 0.4rem" }}>
                    <Icon style={{ width: 17, height: 17 }} />
                    {label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.88rem", marginTop: "1.3rem" }}>
            New to Pawsible? <Link href="/auth/register" style={{ color: "var(--accent)", fontWeight: 900, textDecoration: "none" }}>Create an account</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
