// app/auth/register/page.tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, CheckCircle, Eye, EyeOff, Gift, Heart, PawPrint, Sparkles } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPw, setShowPw] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(true);
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      setTimeout(() => router.push("/pets"), 1400);
    } catch (e: any) {
      setError(e.message ?? "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="premium-hero" style={{ minHeight: "calc(100vh - 68px)", display: "grid", placeItems: "center", padding: "2rem" }}>
        <div className="glass-panel" style={{ borderRadius: 30, padding: "2.5rem", textAlign: "center", maxWidth: 520 }}>
          <CheckCircle style={{ width: 62, height: 62, color: "var(--sage)", margin: "0 auto 1rem" }} />
          <h1 style={{ fontSize: "2.2rem", fontWeight: 900 }}>Welcome to Pawsible.</h1>
          <p style={{ color: "var(--muted)", lineHeight: 1.7, marginTop: "0.75rem" }}>Your account is ready and your first reward points are waiting.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="auth-stage">
      <section className="auth-art">
        <Image
          src="https://images.unsplash.com/photo-1518717758536-85ae29035b6d?auto=format&fit=crop&w=1400&q=85"
          alt="Happy adopted dog looking at camera"
          fill
          priority
          style={{ objectFit: "cover" }}
          sizes="(max-width: 920px) 100vw, 60vw"
        />
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(22,20,18,0.58), rgba(22,20,18,0.16) 55%, rgba(22,20,18,0.52))" }} />
        <div style={{ position: "relative", color: "#fff", maxWidth: 620 }}>
          <span className="metric-pill" style={{ background: "rgba(255,255,255,0.18)", color: "#fff", borderColor: "rgba(255,255,255,0.24)" }}>
            <Gift style={{ width: 15, height: 15 }} /> 50 welcome points
          </span>
          <h1 className="heading-lg" style={{ marginTop: "1rem", textShadow: "0 18px 42px rgba(0,0,0,0.36)" }}>
            Start with a profile. End with a homecoming.
          </h1>
          <p style={{ color: "rgba(255,255,255,0.78)", lineHeight: 1.8, marginTop: "1rem", maxWidth: 520 }}>
            Create an account to save pets, submit requests, and build your reward ranking as you support adoption.
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
              <div className="eyebrow">Join the platform</div>
              <h2 style={{ fontSize: "2.15rem", fontWeight: 900, lineHeight: 1.05, marginTop: "0.65rem" }}>Create your adopter profile.</h2>
              <p style={{ color: "var(--muted)", lineHeight: 1.65, marginTop: "0.65rem" }}>A warmer, clearer adoption journey starts here.</p>
            </div>

            <form onSubmit={handleSubmit}>
              {error && (
                <div style={{ background: "rgba(180,35,24,0.1)", border: "1px solid rgba(180,35,24,0.18)", color: "#b42318", borderRadius: 14, padding: "0.8rem 0.95rem", fontSize: "0.86rem", marginBottom: "1rem" }}>
                  {error}
                </div>
              )}
              <div style={{ display: "grid", gap: "1rem" }}>
                {[
                  { label: "Full name", key: "name", type: "text", placeholder: "Sarah Mitchell", min: 2 },
                  { label: "Email", key: "email", type: "email", placeholder: "you@example.com" },
                ].map((field) => (
                  <label key={field.key}>
                    <span className="badge-soft" style={{ marginBottom: 8 }}>{field.label}</span>
                    <input
                      type={field.type}
                      required
                      minLength={field.min}
                      className="field"
                      placeholder={field.placeholder}
                      value={(form as any)[field.key]}
                      onChange={(e) => setForm((current) => ({ ...current, [field.key]: e.target.value }))}
                    />
                  </label>
                ))}
                <label>
                  <span className="badge-soft" style={{ marginBottom: 8 }}>Password</span>
                  <span style={{ position: "relative", display: "block" }}>
                    <input type={showPw ? "text" : "password"} required minLength={8} className="field" style={{ paddingRight: 46 }} placeholder="At least 8 characters" value={form.password} onChange={(e) => setForm((current) => ({ ...current, password: e.target.value }))} />
                    <button type="button" onClick={() => setShowPw((show) => !show)} aria-label={showPw ? "Hide password" : "Show password"} style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", border: 0, background: "transparent", color: "var(--muted)", cursor: "pointer" }}>
                      {showPw ? <EyeOff style={{ width: 18, height: 18 }} /> : <Eye style={{ width: 18, height: 18 }} />}
                    </button>
                  </span>
                </label>
                <button type="submit" disabled={loading} className="btn-ink">
                  {loading ? "Creating account..." : "Create account"} <ArrowRight style={{ width: 16, height: 16 }} />
                </button>
              </div>
            </form>

            <div style={{ marginTop: "1rem", display: "grid", gap: 8 }}>
              {[
                { Icon: Gift, text: "Earn 50 welcome points" },
                { Icon: Heart, text: "Save pets and build a shortlist" },
                { Icon: Sparkles, text: "Unlock reward tier progress" },
              ].map(({ Icon, text }) => (
                <div key={text} style={{ display: "flex", alignItems: "center", gap: 10, color: "var(--muted)", fontSize: "0.84rem" }}>
                  <Icon style={{ width: 15, height: 15, color: "var(--accent)" }} /> {text}
                </div>
              ))}
            </div>
          </div>

          <p style={{ textAlign: "center", color: "var(--muted)", fontSize: "0.88rem", marginTop: "1.3rem" }}>
            Already have an account? <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 900, textDecoration: "none" }}>Sign in</Link>
          </p>
        </div>
      </section>
    </div>
  );
}
