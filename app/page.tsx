"use client";
import Link from "next/link";

export default function HomePage() {
  return (
    <div style={{ overflow: "hidden" }}>

      {/* HERO */}
      <section style={{ display: "grid", gridTemplateColumns: "1fr 1fr", minHeight: "calc(100vh - 64px)" }}>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: "5rem 4rem 5rem 5rem" }}>
          <div className="eyebrow anim-fade-up" style={{ marginBottom: "1.5rem" }}>Find Your Forever Friend</div>
          <h1 className="anim-fade-up anim-d1" style={{
            fontFamily: "var(--font-display)", fontSize: "clamp(3rem,5.5vw,5rem)",
            fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "var(--ink)", marginBottom: "1.5rem",
          }}>
            Every pet<br/>deserves a<br/><em style={{ fontStyle: "italic", color: "var(--accent)" }}>loving home.</em>
          </h1>
          <p className="anim-fade-up anim-d2" style={{ fontSize: "1rem", lineHeight: 1.75, color: "var(--muted)", maxWidth: 400, marginBottom: "2.5rem", fontFamily: "var(--font-body)" }}>
            Connect with animals ready for adoption. Browse profiles, submit your application, and give a pet the family they've been waiting for.
          </p>
          <div className="anim-fade-up anim-d3" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <Link href="/pets"          className="btn-ink">Browse Pets ↓</Link>
            <Link href="/auth/register" className="btn-outline">Join Free</Link>
          </div>
          <div className="anim-fade-up anim-d4" style={{ display: "flex", gap: "2.5rem", marginTop: "3.5rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)" }}>
            {[{ n: "2,400+", l: "Pets Adopted" }, { n: "180+", l: "Available Now" }, { n: "98%", l: "Happy Owners" }].map(s => (
              <div key={s.l}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1 }}>{s.n}</div>
                <div style={{ fontSize: "0.72rem", color: "var(--muted)", fontWeight: 500, letterSpacing: "0.04em", marginTop: 4, fontFamily: "var(--font-body)" }}>{s.l}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Collage */}
        <div style={{ background: "var(--cream)", position: "relative", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 12, display: "grid", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", gap: 12 }}>
            {[
              { emoji: "🐶", name: "Buddy",  breed: "Golden Retriever · 2 yrs", bg: "linear-gradient(145deg,#c9b99a,#b5a282)", span: true  },
              { emoji: "🐱", name: "Luna",   breed: "Siamese Mix · 3 yrs",      bg: "linear-gradient(145deg,#c8dfc8,#aec9ae)", span: false },
              { emoji: "🐶", name: "Peanut", breed: "Beagle · 1.5 yrs",         bg: "linear-gradient(145deg,#d4bea0,#c4aa8a)", span: false },
            ].map((p, i) => (
              <div key={p.name} className="anim-fade-up" style={{
                borderRadius: 16, overflow: "hidden", position: "relative",
                animationDelay: `${0.1 + i * 0.12}s`,
                ...(p.span ? { gridRow: "span 2" } : {}),
              }}>
                <div style={{ width: "100%", height: "100%", background: p.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: p.span ? "5rem" : "3.5rem" }}>
                  {p.emoji}
                </div>
                <span style={{ position: "absolute", top: 12, left: 12, background: "rgba(74,222,128,0.85)", color: "#14532d", fontSize: "0.58rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "100px", fontFamily: "var(--font-body)" }}>
                  Available
                </span>
                <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 14px", background: "linear-gradient(to top,rgba(0,0,0,0.65),transparent)" }}>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1rem", fontWeight: 700, color: "white" }}>{p.name}</p>
                  <p style={{ fontSize: "0.7rem", color: "rgba(255,255,255,0.8)", marginTop: 2, fontFamily: "var(--font-body)" }}>{p.breed}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* MARQUEE */}
      <div style={{ background: "var(--ink)", padding: "13px 0", overflow: "hidden", borderTop: "1px solid rgba(255,255,255,0.06)" }}>
        <div className="marquee-run" style={{ display: "flex", gap: "3rem", width: "max-content" }}>
          {["Dogs","Cats","Rabbits","Birds","Adopt Don't Shop","Forever Homes","Give Love Get Love",
            "Dogs","Cats","Rabbits","Birds","Adopt Don't Shop","Forever Homes","Give Love Get Love"].map((t, i) => (
            <span key={i} style={{ display: "flex", alignItems: "center", gap: 10, whiteSpace: "nowrap", fontFamily: "var(--font-body)", fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(255,255,255,0.5)" }}>
              <span style={{ width: 4, height: 4, background: "var(--accent)", borderRadius: "50%", display: "inline-block" }} />
              {t}
            </span>
          ))}
        </div>
      </div>

      {/* HOW IT WORKS */}
      <section style={{ padding: "7rem 5rem", background: "var(--cream)" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "4rem" }}>
            <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "1rem" }}>How It Works</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
              From browse to <em style={{ fontStyle: "italic", color: "var(--accent)" }}>best friend</em>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: "1.5rem" }}>
            {[
              { num: "01", emoji: "🔍", title: "Browse & Filter", desc: "Explore pets by species, age, temperament, and compatibility. Each profile has photos, traits, and health info.", badge: "No login needed" },
              { num: "02", emoji: "📋", title: "Submit Request",  desc: "Fill a short adoption form — your home type, experience, a message. Earn 100 points for your first request!", badge: "Earn 100 pts" },
              { num: "03", emoji: "🏡", title: "Welcome Home!",   desc: "Our team reviews and contacts you to arrange a meet. Approval earns you 200 points and a new family member.", badge: "Earn 200 pts" },
            ].map(s => (
              <div key={s.num} style={{ background: "white", borderRadius: 20, padding: "2rem", position: "relative", overflow: "hidden", border: "1px solid rgba(0,0,0,0.06)", transition: "transform 0.3s, box-shadow 0.3s" }}
                onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 48px rgba(0,0,0,0.1)"; }}
                onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                <span style={{ position: "absolute", top: 12, right: 16, fontFamily: "var(--font-display)", fontSize: "5rem", fontWeight: 900, color: "rgba(0,0,0,0.04)", lineHeight: 1 }}>{s.num}</span>
                <div style={{ fontSize: "2.5rem", marginBottom: "1rem" }}>{s.emoji}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", fontWeight: 700, letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>{s.title}</h3>
                <p style={{ fontSize: "0.85rem", color: "var(--muted)", lineHeight: 1.7, fontFamily: "var(--font-body)" }}>{s.desc}</p>
                <span style={{ display: "inline-block", marginTop: "1rem", fontSize: "0.65rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 12px", borderRadius: "100px", background: "rgba(232,98,42,0.1)", color: "var(--accent)", border: "1px solid rgba(232,98,42,0.2)", fontFamily: "var(--font-body)" }}>
                  {s.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: "7rem 5rem" }}>
        <div style={{ maxWidth: 1100, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6rem", alignItems: "center" }}>
          <div>
            <div className="eyebrow" style={{ marginBottom: "1rem" }}>Why Pawsible</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "1.5rem" }}>
              The smarter way to <em style={{ fontStyle: "italic", color: "var(--accent)" }}>adopt</em>
            </h2>
            <p style={{ fontSize: "0.95rem", color: "var(--muted)", lineHeight: 1.8, fontFamily: "var(--font-body)" }}>
              Pawsible is more than a listing site. It's a platform that makes the entire adoption journey transparent, rewarding, and joyful — for both you and your new pet.
            </p>
            <Link href="/pets" className="btn-ink" style={{ marginTop: "2.5rem", display: "inline-flex" }}>Start Browsing →</Link>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {[
              { emoji: "🛡️", title: "Verified Shelters",  desc: "All partners are vetted and certified." },
              { emoji: "🏆", title: "Earn Rewards",        desc: "Earn points for every action on the platform." },
              { emoji: "📸", title: "Rich Profiles",       desc: "Photos, traits, health info — everything you need." },
              { emoji: "📊", title: "Live Tracking",       desc: "Track your request status in real-time." },
              { emoji: "🤖", title: "Smart Matching",      desc: "Tell us your prefs, we match you with the right pet." },
              { emoji: "❤️", title: "Caring Community",   desc: "Join thousands of pet lovers worldwide." },
            ].map(f => (
              <div key={f.title} style={{ background: "var(--cream)", borderRadius: 16, padding: "1.25rem", border: "1px solid rgba(0,0,0,0.06)" }}>
                <div style={{ fontSize: "1.5rem", marginBottom: "0.6rem" }}>{f.emoji}</div>
                <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.9rem", letterSpacing: "-0.01em", marginBottom: "0.3rem" }}>{f.title}</p>
                <p style={{ fontSize: "0.75rem", color: "var(--muted)", lineHeight: 1.6, fontFamily: "var(--font-body)" }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ background: "var(--ink)", padding: "6rem 5rem", textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1.5rem" }}>🐶🐱</div>
        <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--paper)", marginBottom: "1rem" }}>
          Ready to meet your match?
        </h2>
        <p style={{ color: "rgba(255,255,255,0.45)", fontSize: "1rem", marginBottom: "2.5rem", fontFamily: "var(--font-body)" }}>
          Hundreds of pets are waiting for a loving home.
        </p>
        <Link href="/pets" className="btn-accent" style={{ fontSize: "1rem", padding: "14px 36px" }}>Find My Pet →</Link>
      </section>
    </div>
  );
}
