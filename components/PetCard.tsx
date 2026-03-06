"use client";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { Pet } from "@/types";

const PET_EMOJI: Record<string, string> = { Dog:"🐶", Cat:"🐱", Rabbit:"🐰", Bird:"🐦", Hamster:"🐹" };
const PET_BGS = [
  "linear-gradient(145deg,#c9b99a,#b5a282)",
  "linear-gradient(145deg,#c8dfc8,#aec9ae)",
  "linear-gradient(145deg,#d4bea0,#c4aa8a)",
  "linear-gradient(145deg,#d7c8e8,#c2aedb)",
  "linear-gradient(145deg,#e8c8c8,#d4aaaa)",
];
function hashBg(id: string) {
  let h = 0; for (const c of id) h = (h * 31 + c.charCodeAt(0)) % PET_BGS.length;
  return PET_BGS[h];
}

const STATUS: Record<string, { label: string; bg: string; color: string; border: string }> = {
  AVAILABLE: { label: "Available", bg: "rgba(74,222,128,0.18)", color: "#15803d", border: "rgba(74,222,128,0.3)" },
  PENDING:   { label: "Pending",   bg: "rgba(251,191,36,0.18)", color: "#92400e", border: "rgba(251,191,36,0.3)" },
  ADOPTED:   { label: "Adopted",   bg: "rgba(0,0,0,0.06)",     color: "#6b6560", border: "rgba(0,0,0,0.1)"      },
};

export function PetCard({ pet }: { pet: Pet }) {
  const s = STATUS[pet.status] ?? STATUS.AVAILABLE;
  return (
    <Link href={`/pets/${pet.id}`} style={{ textDecoration: "none", display: "block" }}>
      <div style={{
        background: "white", borderRadius: 20, overflow: "hidden",
        border: "1px solid rgba(0,0,0,0.06)", cursor: "pointer",
        transition: "transform 0.3s, box-shadow 0.3s",
      }}
        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-6px)"; e.currentTarget.style.boxShadow = "0 20px 60px rgba(0,0,0,0.12)"; }}
        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>

        {/* Image */}
        <div style={{
          height: 210, position: "relative", background: hashBg(pet.id),
          display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5.5rem",
        }}>
          {pet.photoUrl ? (
            <Image src={pet.photoUrl} alt={pet.name} fill style={{ objectFit: "cover" }} sizes="300px" />
          ) : (
            <span>{PET_EMOJI[pet.species] ?? "🐾"}</span>
          )}
          <div style={{ position: "absolute", top: 12, left: 12, right: 12, display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <span style={{ fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "4px 10px", borderRadius: "100px", background: s.bg, color: s.color, border: `1px solid ${s.border}` }}>
              {s.label}
            </span>
            <button onClick={e => e.preventDefault()} style={{
              width: 32, height: 32, background: "rgba(255,255,255,0.9)", borderRadius: "50%",
              border: "none", display: "flex", alignItems: "center", justifyContent: "center",
              cursor: "pointer", boxShadow: "0 2px 8px rgba(0,0,0,0.1)", transition: "transform 0.2s",
            }}
              onMouseEnter={e => (e.currentTarget.style.transform = "scale(1.15)")}
              onMouseLeave={e => (e.currentTarget.style.transform = "scale(1)")}>
              <Heart style={{ width: 14, height: 14, color: "#f87171" }} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div style={{ padding: "18px 20px 20px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 4 }}>
            <span style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)" }}>
              {pet.name}
            </span>
            <span style={{ fontSize: "0.68rem", color: "var(--muted)", background: "var(--cream)", padding: "3px 10px", borderRadius: "100px", fontWeight: 600, fontFamily: "var(--font-body)" }}>
              {pet.gender}
            </span>
          </div>
          <p style={{ fontSize: "0.8rem", color: "var(--muted)", marginBottom: "0.75rem", fontFamily: "var(--font-body)" }}>
            {pet.breed} &bull; {pet.age < 1 ? "< 1 yr" : `${pet.age} yr${pet.age !== 1 ? "s" : ""}`}
          </p>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "0.75rem" }}>
            {pet.traits.slice(0, 3).map(t => (
              <span key={t} style={{ fontSize: "0.68rem", fontWeight: 600, padding: "4px 11px", borderRadius: "100px", background: "var(--cream)", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                {t}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", paddingTop: "0.75rem", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 10, fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
              {pet.goodWithKids && <span>👶 Kids</span>}
              {pet.goodWithPets && <span>🐾 Pets</span>}
              {pet.vaccinated   && <span>💉</span>}
            </div>
            <span style={{
              fontSize: "0.68rem", fontWeight: 700, padding: "6px 14px", borderRadius: "100px",
              background: "var(--ink)", color: "var(--paper)", fontFamily: "var(--font-body)",
            }}>
              Adopt →
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
