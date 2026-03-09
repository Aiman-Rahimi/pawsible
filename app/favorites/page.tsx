"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Heart } from "lucide-react";
import { PetCard } from "@/components/PetCard";
import { Favorite } from "@/types";

export default function FavoritesPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [favorites, setFavorites] = useState<Favorite[]>([]);
  const [loading,   setLoading]   = useState(true);

  useEffect(() => {
    if (status === "unauthenticated") { router.push("/auth/login"); return; }
    if (status === "authenticated") fetchFavorites();
  }, [status]);

  async function fetchFavorites() {
    const res  = await fetch("/api/favorites");
    const json = await res.json();
    setFavorites(json.data?.favorites ?? []);
    setLoading(false);
  }

  if (loading) return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem", marginTop: "2rem" }}>
        {[1,2,3,4].map(i => (
          <div key={i} style={{ height: 340, background: "var(--cream)", borderRadius: 20 }} className="pulse-bg" />
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ maxWidth: 1100, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      {/* Header */}
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Your Collection</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)" }}>
          Saved Pets ❤️
        </h1>
        <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginTop: "0.5rem", fontFamily: "var(--font-body)" }}>
          {favorites.length} pet{favorites.length !== 1 ? "s" : ""} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 2rem" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🐾</div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.75rem" }}>No saved pets yet</h2>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem", marginBottom: "2rem", fontFamily: "var(--font-body)" }}>
            Browse pets and tap the heart icon to save them here.
          </p>
          <Link href="/pets" className="btn-ink">Browse Pets →</Link>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: "1.5rem" }}>
          {favorites.map(f => f.pet && <PetCard key={f.id} pet={f.pet} />)}
        </div>
      )}
    </div>
  );
}
