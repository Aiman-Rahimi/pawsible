"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BadgeCheck, ClipboardCheck, Heart, HeartHandshake, PawPrint, Search, ShieldCheck, Sparkles, Trophy } from "lucide-react";

const heroPets = [
  {
    name: "Milo",
    detail: "Gentle, house-trained, ready this week",
    image: "https://images.unsplash.com/photo-1552053831-71594a27632d?auto=format&fit=crop&w=900&q=85",
    bg: "linear-gradient(145deg,#f2c39e,#8bbd94)",
  },
  {
    name: "Nala",
    detail: "Calm indoor companion, loves sunny corners",
    image: "https://images.unsplash.com/photo-1574158622682-e40e69881006?auto=format&fit=crop&w=900&q=85",
    bg: "linear-gradient(145deg,#d5e7f4,#e6c6d2)",
  },
  {
    name: "Ollie",
    detail: "Playful, vaccinated, great with families",
    image: "https://images.unsplash.com/photo-1587300003388-59208cc962cb?auto=format&fit=crop&w=900&q=85",
    bg: "linear-gradient(145deg,#f3d59b,#e59a84)",
  },
];

const trustStats = [
  ["2,400+", "successful adoptions"],
  ["180+", "pets ready now"],
  ["24h", "average first response"],
];

export default function HomePage() {
  return (
    <div>
      <section className="premium-hero">
        <div className="wide-shell hero-grid" style={{ minHeight: "calc(100vh - 68px)", display: "grid", gridTemplateColumns: "0.9fr 1.1fr", alignItems: "center", gap: "clamp(2rem, 6vw, 5rem)", padding: "clamp(3rem, 6vw, 5.5rem) 0" }}>
          <div className="anim-fade-up">
            <div className="eyebrow" style={{ marginBottom: "1.2rem" }}>Premium adoption platform</div>
            <h1 className="heading-xl">Find the pet your home has been waiting for.</h1>
            <p className="lead" style={{ marginTop: "1.35rem", maxWidth: 610 }}>
              Pawsible turns adoption into a warm, guided experience: emotionally rich pet profiles, smarter matching, trusted request workflows, and rewards for people who keep showing up for animals.
            </p>
            <div className="mobile-stack" style={{ display: "flex", gap: 12, flexWrap: "wrap", marginTop: "2rem" }}>
              <Link href="/pets" className="btn-ink" style={{ width: "auto" }}>
                Explore adoptable pets <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
              <Link href="/match" className="btn-outline" style={{ width: "auto" }}>
                <Sparkles style={{ width: 16, height: 16 }} /> Start matching
              </Link>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: "2rem" }}>
              {[
                [ShieldCheck, "Verified shelter flows"],
                [Heart, "Saved pet journeys"],
                [Trophy, "Reward tiers"],
              ].map(([Icon, label]) => {
                const LucideIcon = Icon as typeof ShieldCheck;
                return (
                  <span key={label as string} className="metric-pill">
                    <LucideIcon style={{ width: 15, height: 15, color: "var(--accent)" }} /> {label as string}
                  </span>
                );
              })}
            </div>
          </div>

          <div className="anim-fade-up anim-d2" style={{ position: "relative", minHeight: 620 }}>
            <div style={{ position: "absolute", inset: "0 0 auto 13%", display: "grid", gridTemplateColumns: "1.08fr 0.92fr", gap: 16, alignItems: "stretch" }}>
              <article className="pet-portrait" style={{ "--portrait-bg": heroPets[0].bg, height: 560 } as React.CSSProperties}>
                <Image src={heroPets[0].image} alt={`${heroPets[0].name} available for adoption`} fill priority style={{ objectFit: "cover" }} sizes="(max-width: 920px) 90vw, 520px" />
                <div style={{ position: "absolute", inset: "auto 20px 20px", color: "#fff" }}>
                  <span className="status-badge" style={{ background: "rgba(255,255,255,0.82)", color: "#24745a", border: "1px solid rgba(255,255,255,0.6)" }}>Available now</span>
                  <h2 style={{ fontSize: "2.35rem", fontWeight: 900, marginTop: "0.75rem", textShadow: "0 12px 32px rgba(0,0,0,0.35)" }}>{heroPets[0].name}</h2>
                  <p style={{ maxWidth: 320, color: "rgba(255,255,255,0.86)", lineHeight: 1.55 }}>{heroPets[0].detail}</p>
                </div>
              </article>
              <div style={{ display: "grid", gap: 16, paddingTop: 44 }}>
                {heroPets.slice(1).map((pet) => (
                  <article key={pet.name} className="pet-portrait" style={{ "--portrait-bg": pet.bg, minHeight: 250 } as React.CSSProperties}>
                    <Image src={pet.image} alt={`${pet.name} available for adoption`} fill style={{ objectFit: "cover" }} sizes="(max-width: 920px) 45vw, 320px" />
                    <div style={{ position: "absolute", inset: "auto 16px 16px", color: "#fff" }}>
                      <h3 style={{ fontSize: "1.55rem", fontWeight: 900, textShadow: "0 12px 28px rgba(0,0,0,0.38)" }}>{pet.name}</h3>
                      <p style={{ color: "rgba(255,255,255,0.82)", fontSize: "0.85rem", lineHeight: 1.45 }}>{pet.detail}</p>
                    </div>
                  </article>
                ))}
              </div>
            </div>
            <div className="glass-panel" style={{ position: "absolute", left: 0, bottom: 28, borderRadius: 24, padding: "1rem", width: "min(370px, 88vw)" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <div style={{ width: 46, height: 46, borderRadius: 16, display: "grid", placeItems: "center", background: "var(--ink)", color: "var(--paper)" }}>
                  <PawPrint style={{ width: 24, height: 24 }} />
                </div>
                <div>
                  <strong style={{ display: "block", fontSize: "0.98rem" }}>Live adoption journey</strong>
                  <span style={{ color: "var(--muted)", fontSize: "0.82rem" }}>Browse, save, request, review, welcome home.</span>
                </div>
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8, marginTop: "1rem" }}>
                {trustStats.map(([value, label]) => (
                  <div key={label} style={{ borderRadius: 16, background: "rgba(255,255,255,0.68)", padding: "0.75rem" }}>
                    <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.25rem", lineHeight: 1 }}>{value}</strong>
                    <span style={{ color: "var(--muted)", fontSize: "0.67rem", lineHeight: 1.25 }}>{label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="feature-band section">
        <div className="container">
          <div style={{ display: "grid", gridTemplateColumns: "0.8fr 1.2fr", gap: "clamp(2rem,5vw,4rem)", alignItems: "start" }} className="hero-grid">
            <div>
              <div className="eyebrow">Designed for decisions</div>
              <h2 className="heading-lg" style={{ marginTop: "0.9rem" }}>Every screen helps someone feel more certain.</h2>
              <p className="lead" style={{ marginTop: "1rem" }}>
                The platform balances emotion with practical trust signals, so adopters can fall in love and still make a responsible choice.
              </p>
            </div>
            <div className="responsive-grid">
              {[
                { Icon: Search, title: "High-signal discovery", desc: "Search, filters, availability, traits, health markers, and compatibility cues are visible where people need them." },
                { Icon: ClipboardCheck, title: "Guided requests", desc: "Adoption forms ask the right questions without feeling bureaucratic or cold." },
                { Icon: HeartHandshake, title: "Admin confidence", desc: "Shelters get cleaner dashboards, clearer review actions, and visible request context." },
                { Icon: BadgeCheck, title: "Reward motivation", desc: "Point ranking now includes meaningful tiers and next-milestone progress." },
              ].map(({ Icon, title, desc }) => (
                <article key={title} className="glass-panel interactive-card" style={{ borderRadius: 24, padding: "1.35rem" }}>
                  <Icon style={{ width: 26, height: 26, color: "var(--accent)", marginBottom: "1rem" }} />
                  <h3 style={{ fontSize: "1.16rem", fontWeight: 900 }}>{title}</h3>
                  <p style={{ color: "var(--muted)", lineHeight: 1.65, fontSize: "0.9rem", marginTop: "0.55rem" }}>{desc}</p>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="section" style={{ background: "var(--ink)", color: "var(--paper)" }}>
        <div className="container hero-grid" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "clamp(2rem,5vw,5rem)", alignItems: "center" }}>
          <div>
            <div className="eyebrow">From maybe to yes</div>
            <h2 className="heading-lg" style={{ marginTop: "0.9rem" }}>A more beautiful adoption flow can create more confident adopters.</h2>
          </div>
          <div style={{ display: "grid", gap: 12 }}>
            {[
              ["Browse", "Discover pets through emotional, image-led cards with clear practical signals."],
              ["Match", "Answer a short lifestyle quiz to surface compatible companions."],
              ["Request", "Submit a focused adoption request and track status as it moves."],
              ["Reward", "Earn points and climb visible tiers for positive platform actions."],
            ].map(([step, text], index) => (
              <div key={step} style={{ display: "grid", gridTemplateColumns: "48px 1fr", gap: 14, alignItems: "center", padding: "1rem", borderRadius: 22, background: "rgba(255,255,255,0.07)", border: "1px solid rgba(255,255,255,0.1)" }}>
                <span style={{ width: 48, height: 48, borderRadius: 16, display: "grid", placeItems: "center", background: index === 0 ? "var(--accent)" : "rgba(255,255,255,0.1)", fontWeight: 900 }}>{index + 1}</span>
                <span>
                  <strong style={{ display: "block" }}>{step}</strong>
                  <span style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.88rem", lineHeight: 1.55 }}>{text}</span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="section" style={{ textAlign: "center" }}>
        <div className="container" style={{ maxWidth: 760 }}>
          <Sparkles style={{ width: 44, height: 44, color: "var(--accent)", margin: "0 auto 1rem" }} />
          <h2 className="heading-lg">Ready to meet someone unforgettable?</h2>
          <p className="lead" style={{ margin: "1rem auto 2rem" }}>Start with the browse page, or let the matching flow guide you to pets that fit your home and rhythm.</p>
          <div className="mobile-stack" style={{ display: "flex", justifyContent: "center", gap: 12 }}>
            <Link href="/pets" className="btn-ink" style={{ width: "auto" }}>Browse pets</Link>
            <Link href="/match" className="btn-outline" style={{ width: "auto" }}>Find a match</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
