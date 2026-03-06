// app/auth/register/page.tsx
"use client";
import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Eye, EyeOff, CheckCircle } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [form,    setForm]    = useState({ name: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState("");
  const [showPw,  setShowPw]  = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const res  = await fetch("/api/auth/register", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(form) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setSuccess(true);
      await signIn("credentials", { email: form.email, password: form.password, redirect: false });
      setTimeout(() => router.push("/pets"), 1400);
    } catch (e: any) { setError(e.message ?? "Registration failed"); } finally { setLoading(false); }
  }

  if (success) return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <CheckCircle style={{ width: 56, height: 56, color: "#22c55e", margin: "0 auto 1rem" }} />
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
          Welcome to Pawsible! 🐾
        </h2>
        <p style={{ color: "var(--muted)", marginTop: 8, fontFamily: "var(--font-body)" }}>Account created. You earned 50 bonus points!</p>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", display: "flex", alignItems: "center",
      justifyContent: "center", padding: "3rem 1rem", background: "var(--cream)" }}>
      <div style={{ width: "100%", maxWidth: 420 }}>
        <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
          <Link href="/" style={{ textDecoration: "none" }}>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)" }}>🐾 Pawsible</p>
          </Link>
          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginTop: "1rem", letterSpacing: "-0.03em" }}>Create your account</p>
          <p style={{ fontSize: "0.85rem", color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-body)" }}>Start your adoption journey — it's free!</p>
        </div>

        <div className="card-white" style={{ padding: "2.5rem" }}>
          <form onSubmit={handleSubmit}>
            {error && (
              <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
                borderRadius: 12, padding: "10px 16px", fontSize: "0.82rem", marginBottom: "1.5rem", fontFamily: "var(--font-body)" }}>
                {error}
              </div>
            )}
            {[
              { label: "Full Name", key: "name",     type: "text",     placeholder: "Sarah Mitchell", min: 2 },
              { label: "Email",     key: "email",    type: "email",    placeholder: "you@example.com" },
            ].map(f => (
              <div key={f.key} style={{ marginBottom: "1.25rem" }}>
                <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: 8,
                  textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body)" }}>{f.label}</label>
                <input type={f.type} required className="field" placeholder={f.placeholder}
                  minLength={f.min} value={(form as any)[f.key]}
                  onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
              </div>
            ))}
            <div style={{ marginBottom: "1.75rem" }}>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: 8,
                textTransform: "uppercase", letterSpacing: "0.06em", fontFamily: "var(--font-body)" }}>Password</label>
              <div style={{ position: "relative" }}>
                <input type={showPw ? "text" : "password"} required minLength={8} className="field"
                  style={{ paddingRight: 44 }} placeholder="At least 8 characters"
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
              {loading ? "Creating account…" : "Create Account 🐾"}
            </button>
          </form>
          <p style={{ fontSize: "0.72rem", color: "var(--muted)", textAlign: "center", marginTop: "1rem",
            fontFamily: "var(--font-body)" }}>
            🎁 You'll earn 50 welcome points automatically!
          </p>
        </div>

        <p style={{ textAlign: "center", fontSize: "0.82rem", color: "var(--muted)", marginTop: "1.5rem", fontFamily: "var(--font-body)" }}>
          Already have an account?{" "}
          <Link href="/auth/login" style={{ color: "var(--accent)", fontWeight: 700, textDecoration: "none" }}>Sign in →</Link>
        </p>
      </div>
    </div>
  );
}
