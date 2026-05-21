// app/pets/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Plus, Search, SlidersHorizontal, X } from "lucide-react";
import { PetCard } from "@/components/PetCard";
import { Pet } from "@/types";

const SPECIES = ["All", "Dog", "Cat", "Rabbit", "Bird", "Hamster"];

export default function PetsPage() {
  const { data: session } = useSession();
  const user = session?.user as any;
  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const [pets, setPets] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    search: "",
    species: "All",
    status: "AVAILABLE",
    goodWithKids: false,
    goodWithPets: false,
    ageMin: "",
    ageMax: "",
  });
  const limit = 12;

  const fetchPets = useCallback(async () => {
    setLoading(true);
    setError("");
    const params = new URLSearchParams({ page: String(page), limit: String(limit) });
    if (filters.search) params.set("search", filters.search);
    if (filters.species !== "All") params.set("species", filters.species);
    if (filters.status) params.set("status", filters.status);
    if (filters.goodWithKids) params.set("goodWithKids", "true");
    if (filters.goodWithPets) params.set("goodWithPets", "true");
    if (filters.ageMin) params.set("ageMin", filters.ageMin);
    if (filters.ageMax) params.set("ageMax", filters.ageMax);

    try {
      const res = await fetch(`/api/pets?${params}`);
      const json = await res.json();
      if (!res.ok) throw new Error(json.error ?? "Failed to load pets");
      setPets(json.data?.pets ?? []);
      setTotal(json.data?.total ?? 0);
    } catch (err: any) {
      setError(err.message ?? "Something went wrong");
      setPets([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => {
    fetchPets();
  }, [fetchPets]);

  const totalPages = Math.ceil(total / limit);

  function resetFilters() {
    setFilters({
      search: "",
      species: "All",
      status: "AVAILABLE",
      goodWithKids: false,
      goodWithPets: false,
      ageMin: "",
      ageMax: "",
    });
    setPage(1);
  }

  return (
    <div className="page-shell">
      <div className="mobile-stack" style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Browse pets</div>
          <h1 className="heading-lg">Find a companion who fits your life.</h1>
          <p style={{ color: "var(--muted)", marginTop: "0.7rem" }}>
            {loading ? "Loading available profiles..." : `${total} profile${total === 1 ? "" : "s"} found`}
          </p>
        </div>
        {isAdmin && (
          <Link href="/pets/new" className="btn-accent" style={{ width: "auto" }}>
            <Plus style={{ width: 16, height: 16 }} /> Add Pet
          </Link>
        )}
      </div>

      <div className="panel" style={{ padding: "1rem", marginBottom: "1rem" }}>
        <div className="mobile-stack" style={{ display: "flex", gap: 10 }}>
          <div style={{ position: "relative", flex: 1 }}>
            <Search style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", width: 17, height: 17, color: "var(--muted)" }} />
            <input
              type="search"
              placeholder="Search by name or breed"
              className="field"
              style={{ paddingLeft: 42 }}
              value={filters.search}
              onChange={(e) => {
                setFilters((current) => ({ ...current, search: e.target.value }));
                setPage(1);
              }}
            />
          </div>
          <button onClick={() => setShowFilters((open) => !open)} className={showFilters ? "btn-accent" : "btn-outline"} style={{ width: "auto" }}>
            <SlidersHorizontal style={{ width: 16, height: 16 }} /> Filters
          </button>
        </div>

        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingTop: "0.9rem" }}>
          {SPECIES.map((species) => (
            <button
              key={species}
              onClick={() => {
                setFilters((current) => ({ ...current, species }));
                setPage(1);
              }}
              className={filters.species === species ? "btn-ink" : "btn-ghost"}
              style={{ width: "auto", minHeight: 36, padding: "0.45rem 0.9rem", flexShrink: 0 }}
            >
              {species === "All" ? "All pets" : species}
            </button>
          ))}
        </div>

        {showFilters && (
          <div className="filter-grid anim-fade-up" style={{ marginTop: "1rem", paddingTop: "1rem", borderTop: "1px solid var(--border)" }}>
            <div>
              <label className="badge-soft" style={{ marginBottom: 8 }}>Status</label>
              <select className="field" value={filters.status} onChange={(e) => { setFilters((current) => ({ ...current, status: e.target.value })); setPage(1); }}>
                <option value="">All</option>
                <option value="AVAILABLE">Available</option>
                <option value="PENDING">Pending</option>
                <option value="ADOPTED">Adopted</option>
              </select>
            </div>
            <div>
              <label className="badge-soft" style={{ marginBottom: 8 }}>Min age</label>
              <input type="number" min={0} max={20} step={0.5} className="field" placeholder="0" value={filters.ageMin} onChange={(e) => { setFilters((current) => ({ ...current, ageMin: e.target.value })); setPage(1); }} />
            </div>
            <div>
              <label className="badge-soft" style={{ marginBottom: 8 }}>Max age</label>
              <input type="number" min={0} max={20} step={0.5} className="field" placeholder="15" value={filters.ageMax} onChange={(e) => { setFilters((current) => ({ ...current, ageMax: e.target.value })); setPage(1); }} />
            </div>
            <div style={{ display: "grid", gap: 10, alignContent: "end" }}>
              {[
                { key: "goodWithKids", label: "Good with kids" },
                { key: "goodWithPets", label: "Good with pets" },
              ].map((filter) => (
                <label key={filter.key} style={{ display: "flex", alignItems: "center", gap: 9, color: "var(--ink)", fontSize: "0.9rem", fontWeight: 700 }}>
                  <input
                    type="checkbox"
                    checked={(filters as any)[filter.key]}
                    onChange={(e) => {
                      setFilters((current) => ({ ...current, [filter.key]: e.target.checked }));
                      setPage(1);
                    }}
                    style={{ accentColor: "var(--accent)", width: 16, height: 16 }}
                  />
                  {filter.label}
                </label>
              ))}
              <button onClick={resetFilters} className="btn-ghost" style={{ minHeight: 36 }}>
                <X style={{ width: 14, height: 14 }} /> Reset
              </button>
            </div>
          </div>
        )}
      </div>

      {error ? (
        <div className="card-white" style={{ padding: "2rem", textAlign: "center", color: "#b42318" }}>{error}</div>
      ) : loading ? (
        <div className="responsive-grid">
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="card-white" style={{ overflow: "hidden" }}>
              <div className="skeleton" style={{ height: 230 }} />
              <div style={{ padding: "1.1rem" }}>
                <div className="skeleton" style={{ width: "60%", height: 18, borderRadius: 999, marginBottom: 10 }} />
                <div className="skeleton" style={{ width: "42%", height: 12, borderRadius: 999 }} />
              </div>
            </div>
          ))}
        </div>
      ) : pets.length === 0 ? (
        <div className="card-white" style={{ padding: "4rem 1.5rem", textAlign: "center" }}>
          <Search style={{ width: 46, height: 46, color: "var(--accent)", margin: "0 auto 1rem" }} />
          <h2 style={{ fontSize: "1.5rem", fontWeight: 900 }}>No pets match these filters</h2>
          <p style={{ color: "var(--muted)", marginTop: 8 }}>Try a broader search or reset the filters.</p>
          <button onClick={resetFilters} className="btn-ink" style={{ marginTop: "1.4rem", width: "auto" }}>Reset filters</button>
        </div>
      ) : (
        <div className="responsive-grid">
          {pets.map((pet) => <PetCard key={pet.id} pet={pet} />)}
        </div>
      )}

      {totalPages > 1 && (
        <div className="mobile-stack" style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 12, marginTop: "2.5rem" }}>
          <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="btn-outline" style={{ width: "auto" }}>Previous</button>
          <span className="badge-soft">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((current) => current + 1)} className="btn-outline" style={{ width: "auto" }}>Next</button>
        </div>
      )}
    </div>
  );
}
