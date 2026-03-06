// app/pets/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Search, SlidersHorizontal, Plus, X } from "lucide-react";
import { PetCard } from "@/components/PetCard";
import { Pet } from "@/types";

const SPECIES = ["All","Dog","Cat","Rabbit","Bird","Hamster"];

export default function PetsPage() {
  const { data: session } = useSession();
  const user    = session?.user as any;
  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const [pets,        setPets]        = useState<Pet[]>([]);
  const [loading,     setLoading]     = useState(true);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "", species: "All", status: "AVAILABLE",
    goodWithKids: false, goodWithPets: false, ageMin: "", ageMax: "",
  });
  const limit = 12;

  const fetchPets = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters.search)              p.set("search",       filters.search);
    if (filters.species !== "All")   p.set("species",      filters.species);
    if (filters.status)              p.set("status",       filters.status);
    if (filters.goodWithKids)        p.set("goodWithKids", "true");
    if (filters.goodWithPets)        p.set("goodWithPets", "true");
    if (filters.ageMin)              p.set("ageMin",       filters.ageMin);
    if (filters.ageMax)              p.set("ageMax",       filters.ageMax);
    const res  = await fetch(`/api/pets?${p}`);
    const json = await res.json();
    setPets(json.data?.pets ?? []);
    setTotal(json.data?.total ?? 0);
    setLoading(false);
  }, [page, filters]);

  useEffect(() => { fetchPets(); }, [fetchPets]);

  const totalPages = Math.ceil(total / limit);

  return (
    <div style={{ maxWidth: "1200px", margin: "0 auto", padding: "3rem 2rem 5rem" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between",
        marginBottom: "2.5rem", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Browse Pets</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,3rem)",
            fontWeight: 900, letterSpacing: "-0.04em", lineHeight: 1.05 }}>
            Find your <em style={{ fontStyle: "italic", color: "var(--accent)" }}>perfect</em><br/>companion
          </h1>
          <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: "0.5rem",
            fontFamily: "var(--font-body)" }}>
            {loading ? "Loading…" : `${total} pet${total !== 1 ? "s" : ""} available`}
          </p>
        </div>
        {isAdmin && (
          <Link href="/pets/new" className="btn-accent" style={{ marginTop: "0.5rem" }}>
            <Plus style={{ width: 14, height: 14 }} /> Add Pet
          </Link>
        )}
      </div>

      {/* Search bar */}
      <div style={{ display: "flex", gap: 10, marginBottom: "1.25rem" }}>
        <div style={{ position: "relative", flex: 1 }}>
          <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
            width: 16, height: 16, color: "var(--muted)" }} />
          <input type="search" placeholder="Search by name, breed…" className="field"
            style={{ paddingLeft: 42 }} value={filters.search}
            onChange={e => { setFilters(f => ({ ...f, search: e.target.value })); setPage(1); }} />
        </div>
        <button onClick={() => setShowFilters(!showFilters)}
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "10px 18px",
            borderRadius: 12, border: `1.5px solid ${showFilters ? "var(--accent)" : "var(--border)"}`,
            background: showFilters ? "rgba(232,98,42,0.08)" : "white",
            color: showFilters ? "var(--accent)" : "var(--ink)", cursor: "pointer",
            fontSize: "0.82rem", fontWeight: 600, fontFamily: "var(--font-body)", transition: "all 0.15s" }}>
          <SlidersHorizontal style={{ width: 15, height: 15 }} /> Filters
        </button>
      </div>

      {/* Species pills */}
      <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: "1.5rem" }}>
        {SPECIES.map(s => (
          <button key={s} onClick={() => { setFilters(f => ({ ...f, species: s })); setPage(1); }}
            style={{ flexShrink: 0, padding: "6px 16px", borderRadius: "100px",
              border: `1.5px solid ${filters.species === s ? "var(--ink)" : "var(--border)"}`,
              background: filters.species === s ? "var(--ink)" : "white",
              color: filters.species === s ? "var(--paper)" : "var(--muted)",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer", fontFamily: "var(--font-body)",
              transition: "all 0.15s" }}>
            {s === "Dog" ? "🐶 Dogs" : s === "Cat" ? "🐱 Cats" : s === "All" ? "All Pets" : `🐾 ${s}s`}
          </button>
        ))}
      </div>

      {/* Expanded filters */}
      {showFilters && (
        <div className="card-white anim-fade-up" style={{ padding: "1.5rem", marginBottom: "1.5rem" }}>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: "1rem" }}>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: 6,
                color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Status</label>
              <select className="field" value={filters.status}
                onChange={e => { setFilters(f => ({ ...f, status: e.target.value })); setPage(1); }}>
                <option value="">All</option>
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
                <option value="ADOPTED">Adopted</option>
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: 6,
                color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Age Min</label>
              <input type="number" min={0} max={20} step={0.5} className="field" placeholder="0"
                value={filters.ageMin} onChange={e => { setFilters(f => ({ ...f, ageMin: e.target.value })); setPage(1); }} />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: 6,
                color: "var(--muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>Age Max</label>
              <input type="number" min={0} max={20} step={0.5} className="field" placeholder="15"
                value={filters.ageMax} onChange={e => { setFilters(f => ({ ...f, ageMax: e.target.value })); setPage(1); }} />
            </div>
            <div style={{ display: "flex", flexDirection: "column", justifyContent: "flex-end", gap: 8 }}>
              {[
                { key: "goodWithKids", label: "Good with kids" },
                { key: "goodWithPets", label: "Good with pets" },
              ].map(c => (
                <label key={c.key} style={{ display: "flex", alignItems: "center", gap: 8,
                  fontSize: "0.82rem", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                  <input type="checkbox" checked={(filters as any)[c.key]}
                    onChange={e => { setFilters(f => ({ ...f, [c.key]: e.target.checked })); setPage(1); }}
                    style={{ accentColor: "var(--accent)", width: 15, height: 15 }} />
                  {c.label}
                </label>
              ))}
            </div>
          </div>
          <button onClick={() => { setFilters({ search:"",species:"All",status:"AVAILABLE",goodWithKids:false,goodWithPets:false,ageMin:"",ageMax:"" }); setPage(1); }}
            style={{ display: "flex", alignItems: "center", gap: 6, marginTop: "1rem", background: "none",
              border: "none", cursor: "pointer", fontSize: "0.75rem", color: "var(--muted)",
              fontFamily: "var(--font-body)", fontWeight: 600 }}>
            <X style={{ width: 12, height: 12 }} /> Reset filters
          </button>
        </div>
      )}

      {/* Grid */}
      {loading ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-white" style={{ overflow: "hidden", animation: "pulse 1.5s ease-in-out infinite" }}>
              <div style={{ height: 210, background: "var(--cream)" }} />
              <div style={{ padding: "18px 20px" }}>
                <div style={{ height: 16, background: "var(--cream)", borderRadius: 8, width: "60%", marginBottom: 10 }} />
                <div style={{ height: 12, background: "var(--cream)", borderRadius: 8, width: "40%" }} />
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "6rem 0" }}>
          <div style={{ fontSize: "4rem", marginBottom: "1rem" }}>🔍</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700, marginBottom: "0.5rem" }}>
            No pets found
          </h3>
          <p style={{ color: "var(--muted)", fontSize: "0.88rem" }}>Try adjusting your filters</p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill,minmax(260px,1fr))", gap: 20 }}>
          {pets.map(pet => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: "3rem" }}>
          <button disabled={page <= 1} onClick={() => setPage(page - 1)} className="btn-outline"
            style={{ opacity: page <= 1 ? 0.4 : 1, padding: "9px 22px" }}>← Prev</button>
          <span style={{ fontSize: "0.82rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {page} / {totalPages}
          </span>
          <button disabled={page >= totalPages} onClick={() => setPage(page + 1)} className="btn-outline"
            style={{ opacity: page >= totalPages ? 0.4 : 1, padding: "9px 22px" }}>Next →</button>
        </div>
      )}
    </div>
  );
}
