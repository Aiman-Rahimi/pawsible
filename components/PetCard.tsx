"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Baby, Heart, PawPrint, ShieldCheck, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import { Pet } from "@/types";
import { useToast } from "./ToastProvider";

const STATUS: Record<string, { label: string; bg: string; color: string; border: string }> = {
  AVAILABLE: { label: "Available", bg: "rgba(63,143,114,0.14)", color: "#24745a", border: "rgba(63,143,114,0.22)" },
  PENDING: { label: "Pending", bg: "rgba(201,149,47,0.16)", color: "#8a5f10", border: "rgba(201,149,47,0.26)" },
  ADOPTED: { label: "Adopted", bg: "rgba(22,20,18,0.07)", color: "var(--muted)", border: "rgba(22,20,18,0.12)" },
};

function ageLabel(age: number) {
  if (age < 1) return "Under 1 year";
  return `${age} year${age === 1 ? "" : "s"}`;
}

export function PetCard({ pet, isFavorited: initFav = false }: { pet: Pet; isFavorited?: boolean }) {
  const { data: session } = useSession();
  const { showToast } = useToast();
  const [favorited, setFavorited] = useState(initFav);
  const [loading, setLoading] = useState(false);
  const status = STATUS[pet.status] ?? STATUS.AVAILABLE;

  async function toggleFav(e: React.MouseEvent) {
    e.preventDefault();
    if (!session || loading) return;
    setLoading(true);
    const nextValue = !favorited;
    setFavorited(nextValue);
    const method = nextValue ? "POST" : "DELETE";
    const res = await fetch(`/api/favorites/${pet.id}`, { method });
    if (!res.ok) {
      setFavorited(!nextValue);
      showToast({ title: "Could not update saved pets", message: "Please try again in a moment.", tone: "error" });
    } else {
      showToast({
        title: nextValue ? "Saved to favorites" : "Removed from favorites",
        message: nextValue ? `${pet.name} is now in your saved list.` : `${pet.name} was removed from your saved list.`,
        tone: "success",
      });
    }
    setLoading(false);
  }

  return (
    <article className="card-white interactive-card" style={{ height: "100%", overflow: "hidden", position: "relative" }}>
      <Link href={`/pets/${pet.id}`} style={{ textDecoration: "none", display: "block", color: "inherit" }}>
        <div
          style={{
            height: 230,
            position: "relative",
            background: "linear-gradient(135deg, #f4dac8, #d7eadc)",
            display: "grid",
            placeItems: "center",
          }}
        >
          {pet.photoUrl ? (
            <Image src={pet.photoUrl} alt={pet.name} fill style={{ objectFit: "cover" }} sizes="(max-width: 768px) 100vw, 330px" />
          ) : (
            <PawPrint style={{ width: 72, height: 72, color: "rgba(22,20,18,0.28)" }} />
          )}
          <div style={{ position: "absolute", inset: "12px auto auto 12px", display: "flex", justifyContent: "space-between", gap: 10 }}>
            <span className="status-badge" style={{ background: status.bg, color: status.color, border: `1px solid ${status.border}` }}>
              {status.label}
            </span>
          </div>
        </div>

        <div style={{ padding: "1.1rem 1.15rem 1.2rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", gap: 12, alignItems: "flex-start" }}>
            <div>
              <h3 style={{ fontSize: "1.35rem", fontWeight: 900, color: "var(--ink)", lineHeight: 1.05 }}>{pet.name}</h3>
              <p style={{ color: "var(--muted)", fontSize: "0.86rem", marginTop: 5 }}>
                {pet.breed} - {ageLabel(pet.age)}
              </p>
            </div>
            <span className="badge-soft">{pet.gender}</span>
          </div>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: "0.95rem", minHeight: 30 }}>
            {pet.traits.slice(0, 3).map((trait) => (
              <span className="trait-tag" key={trait}>{trait}</span>
            ))}
          </div>

          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <div style={{ display: "flex", gap: 8, color: "var(--muted)" }}>
              {pet.goodWithKids && <Baby style={{ width: 16, height: 16 }} aria-label="Good with kids" />}
              {pet.goodWithPets && <PawPrint style={{ width: 16, height: 16 }} aria-label="Good with pets" />}
              {pet.vaccinated && <ShieldCheck style={{ width: 16, height: 16 }} aria-label="Vaccinated" />}
            </div>
            <span className="reward-badge" style={{ color: "var(--ink)", background: "var(--cream)", borderColor: "var(--border)" }}>
              <Sparkles style={{ width: 13, height: 13 }} /> Meet {pet.name}
            </span>
          </div>
        </div>
      </Link>
      {session && (
        <button
          onClick={toggleFav}
          disabled={loading}
          aria-label={favorited ? "Remove from saved pets" : "Save pet"}
          style={{
            position: "absolute",
            top: 12,
            right: 12,
            width: 38,
            height: 38,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.7)",
            background: "rgba(255,255,255,0.9)",
            display: "grid",
            placeItems: "center",
            cursor: "pointer",
            boxShadow: "0 10px 24px rgba(0,0,0,0.12)",
          }}
        >
          <Heart style={{ width: 17, height: 17, color: favorited ? "var(--rose)" : "var(--muted)" }} fill={favorited ? "currentColor" : "none"} />
        </button>
      )}
    </article>
  );
}
