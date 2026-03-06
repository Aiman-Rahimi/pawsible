"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, Edit, Trash2, Heart, Check, MapPin, Scale, Calendar } from "lucide-react";
import { Pet } from "@/types";

const PET_EMOJI: Record<string, string> = { Dog:"🐶", Cat:"🐱", Rabbit:"🐰", Bird:"🐦", Hamster:"🐹" };
const STATUS_CFG: Record<string, { label: string; bg: string; color: string }> = {
  AVAILABLE: { label: "Available", bg: "rgba(74,222,128,0.18)", color: "#15803d" },
  PENDING:   { label: "Pending",   bg: "rgba(251,191,36,0.18)", color: "#92400e" },
  ADOPTED:   { label: "Adopted",   bg: "rgba(0,0,0,0.06)",     color: "#6b6560" },
};

export default function PetDetailPage() {
  const { id }         = useParams<{ id: string }>();
  const { data: session } = useSession();
  const router         = useRouter();
  const user           = session?.user as any;
  const isAdmin        = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const [pet,         setPet]         = useState<Pet | null>(null);
  const [loading,     setLoading]     = useState(true);
  const [requested,   setRequested]   = useState(false);
  const [showForm,    setShowForm]    = useState(false);
  const [requesting,  setRequesting]  = useState(false);
  const [deleting,    setDeleting]    = useState(false);
  const [selectedImg, setSelectedImg] = useState(0);
  const [reqForm, setReqForm] = useState({ message: "", experience: "", homeType: "Apartment", hasYard: false });

  useEffect(() => {
    fetch(`/api/pets/${id}`).then(r => r.json()).then(j => { setPet(j.data?.pet ?? null); setLoading(false); });
  }, [id]);

  async function handleAdopt(e: React.FormEvent) {
    e.preventDefault();
    if (!session) { router.push("/auth/login"); return; }
    setRequesting(true);
    try {
      const res  = await fetch("/api/adoption", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ petId: id, ...reqForm }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setRequested(true); setShowForm(false);
    } catch (err: any) { alert(err.message); } finally { setRequesting(false); }
  }

  async function handleDelete() {
    if (!confirm(`Delete ${pet?.name}? This cannot be undone.`)) return;
    setDeleting(true);
    await fetch(`/api/pets/${id}`, { method: "DELETE" });
    router.push("/pets"); router.refresh();
  }

  const label = { display: "block" as const, fontSize: "0.72rem", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontFamily: "var(--font-body)", color: "var(--ink)" };

  if (loading) return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "3rem 2rem" }}>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem", marginTop: "2rem" }}>
        <div style={{ height: 380, background: "var(--cream)", borderRadius: 20 }} className="pulse-bg" />
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>
          {[200, 140, 80, 180].map(w => <div key={w} style={{ height: 16, background: "var(--cream)", borderRadius: 8, width: w }} className="pulse-bg" />)}
        </div>
      </div>
    </div>
  );

  if (!pet) return (
    <div style={{ textAlign: "center", padding: "6rem 2rem" }}>
      <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>😕</div>
      <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1.5rem" }}>Pet not found</h2>
      <Link href="/pets" className="btn-ink" style={{ marginTop: "1.5rem", display: "inline-flex" }}>← Back to Pets</Link>
    </div>
  );

  const sc        = STATUS_CFG[pet.status] ?? STATUS_CFG.AVAILABLE;
  const allPhotos = [pet.photoUrl, ...(pet.photos ?? []).filter(p => p !== pet.photoUrl)].filter(Boolean) as string[];
  const canAdopt  = pet.status === "AVAILABLE" && !!session && !isAdmin;

  return (
    <div style={{ maxWidth: 960, margin: "0 auto", padding: "2.5rem 2rem 5rem" }}>
      <Link href="/pets" style={{
        display: "inline-flex", alignItems: "center", gap: 6, fontSize: "0.82rem",
        color: "var(--muted)", textDecoration: "none", marginBottom: "2rem",
        fontFamily: "var(--font-body)", fontWeight: 600, transition: "color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.color = "var(--ink)")}
        onMouseLeave={e => (e.currentTarget.style.color = "var(--muted)")}>
        <ArrowLeft style={{ width: 15, height: 15 }} /> Back to pets
      </Link>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "3rem" }}>
        {/* Photos */}
        <div>
          <div style={{
            height: 380, borderRadius: 20, overflow: "hidden", position: "relative",
            background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "8rem",
          }}>
            {allPhotos.length > 0 ? (
              <Image src={allPhotos[selectedImg]} alt={pet.name} fill style={{ objectFit: "cover" }} sizes="480px" />
            ) : (
              <span>{PET_EMOJI[pet.species] ?? "🐾"}</span>
            )}
            <span style={{
              position: "absolute", top: 14, left: 14, fontSize: "0.6rem", fontWeight: 700,
              letterSpacing: "0.08em", textTransform: "uppercase",
              padding: "5px 12px", borderRadius: "100px", background: sc.bg, color: sc.color,
              fontFamily: "var(--font-body)",
            }}>
              {sc.label}
            </span>
          </div>
          {allPhotos.length > 1 && (
            <div style={{ display: "flex", gap: 8, marginTop: 10, overflowX: "auto" }}>
              {allPhotos.map((url, i) => (
                <button key={i} onClick={() => setSelectedImg(i)} style={{
                  flexShrink: 0, width: 64, height: 64, borderRadius: 12, overflow: "hidden",
                  position: "relative", border: `2px solid ${i === selectedImg ? "var(--accent)" : "transparent"}`,
                  cursor: "pointer", background: "none", padding: 0, transition: "border-color 0.15s",
                }}>
                  <Image src={url} alt="" width={64} height={64} style={{ objectFit: "cover", width: "100%", height: "100%" }} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 4 }}>
            <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.2rem", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)" }}>
              {pet.name}
            </h1>
            {isAdmin && (
              <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
                <Link href={`/pets/${id}/edit`} style={{
                  padding: 8, borderRadius: 10, background: "var(--cream)", textDecoration: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", transition: "background 0.15s",
                }}
                  onMouseEnter={e => (e.currentTarget.style.background = "#e5e7eb")}
                  onMouseLeave={e => (e.currentTarget.style.background = "var(--cream)")}>
                  <Edit style={{ width: 15, height: 15, color: "var(--muted)" }} />
                </Link>
                <button onClick={handleDelete} disabled={deleting} style={{
                  padding: 8, borderRadius: 10, background: "#fef2f2", border: "none",
                  display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer",
                }}>
                  <Trash2 style={{ width: 15, height: 15, color: "#dc2626" }} />
                </button>
              </div>
            )}
          </div>

          <p style={{ fontSize: "0.88rem", color: "var(--muted)", marginBottom: "1.5rem", fontFamily: "var(--font-body)" }}>
            {pet.breed} &bull; {pet.species}
          </p>

          {/* Stats */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10, marginBottom: "1.5rem" }}>
            {[
              { emoji: "📅", label: "Age",    value: pet.age < 1 ? "< 1 yr" : `${pet.age} yr${pet.age !== 1 ? "s" : ""}` },
              { emoji: "⚧",  label: "Gender", value: pet.gender },
              { emoji: "⚖️", label: "Weight", value: pet.weight ? `${pet.weight} kg` : "—" },
            ].map(s => (
              <div key={s.label} style={{ background: "var(--cream)", borderRadius: 14, padding: 14, textAlign: "center" }}>
                <div style={{ fontSize: "1.3rem", marginBottom: 4 }}>{s.emoji}</div>
                <p style={{ fontSize: "0.65rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{s.label}</p>
                <p style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--ink)", fontFamily: "var(--font-body)", marginTop: 2 }}>{s.value}</p>
              </div>
            ))}
          </div>

          {pet.description && (
            <p style={{ fontSize: "0.88rem", color: "var(--muted)", lineHeight: 1.75, marginBottom: "1.25rem", fontFamily: "var(--font-body)" }}>
              {pet.description}
            </p>
          )}

          {/* Traits */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 6, marginBottom: "1.25rem" }}>
            {pet.traits.map(t => (
              <span key={t} style={{ fontSize: "0.68rem", fontWeight: 600, padding: "4px 11px", borderRadius: "100px", background: "var(--cream)", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                {t}
              </span>
            ))}
          </div>

          {/* Health */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: "1.5rem" }}>
            {[
              { label: "Vaccinated",     val: pet.vaccinated   },
              { label: "Neutered",       val: pet.neutered     },
              { label: "House-trained",  val: pet.houseTrained },
              { label: "Good with kids", val: pet.goodWithKids },
              { label: "Good with pets", val: pet.goodWithPets },
            ].map(c => (
              <div key={c.label} style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{
                  width: 20, height: 20, borderRadius: "50%", flexShrink: 0,
                  background: c.val ? "rgba(74,222,128,0.2)" : "var(--cream)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  {c.val
                    ? <Check style={{ width: 11, height: 11, color: "#15803d" }} />
                    : <span style={{ fontSize: "0.6rem", color: "var(--muted)" }}>✕</span>}
                </div>
                <span style={{ fontSize: "0.8rem", fontFamily: "var(--font-body)", color: c.val ? "var(--ink)" : "var(--muted)" }}>
                  {c.label}
                </span>
              </div>
            ))}
          </div>

          {(pet as any).shelter && (
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", display: "flex", alignItems: "center", gap: 4, marginBottom: "1.25rem", fontFamily: "var(--font-body)" }}>
              <MapPin style={{ width: 12, height: 12 }} /> Listed by {(pet as any).shelter.name}
            </p>
          )}

          {/* CTA */}
          {!session ? (
            <Link href="/auth/login" className="btn-ink" style={{ width: "100%" }}>Sign in to Adopt</Link>
          ) : requested ? (
            <div style={{ background: "rgba(74,222,128,0.1)", border: "1px solid rgba(74,222,128,0.3)", borderRadius: 16, padding: "1.25rem", textAlign: "center" }}>
              <Check style={{ width: 24, height: 24, color: "#15803d", margin: "0 auto 6px" }} />
              <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, color: "#15803d" }}>Request submitted! 🎉</p>
              <p style={{ fontSize: "0.75rem", color: "#166534", marginTop: 4, fontFamily: "var(--font-body)" }}>We'll review your application soon.</p>
              <Link href="/adoption/mine" style={{ fontSize: "0.75rem", color: "#15803d", display: "inline-block", marginTop: 8, fontFamily: "var(--font-body)" }}>View my requests →</Link>
            </div>
          ) : canAdopt && !showForm ? (
            <button onClick={() => setShowForm(true)} className="btn-ink" style={{ width: "100%" }}>
              <Heart style={{ width: 16, height: 16 }} /> Adopt {pet.name}
            </button>
          ) : canAdopt && showForm ? (
            <form onSubmit={handleAdopt} style={{ background: "var(--cream)", borderRadius: 16, padding: "1.5rem", border: "1px solid var(--border)", display: "flex", flexDirection: "column", gap: "1rem" }}>
              <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", letterSpacing: "-0.02em" }}>Your Adoption Request</h3>
              <div>
                <label style={label}>Message</label>
                <textarea rows={3} className="field" style={{ resize: "none" }} placeholder="Tell us why you'd be a great match..."
                  value={reqForm.message} onChange={e => setReqForm(f => ({ ...f, message: e.target.value }))} />
              </div>
              <div>
                <label style={label}>Pet Experience</label>
                <input type="text" className="field" placeholder="e.g. Owned dogs for 5 years"
                  value={reqForm.experience} onChange={e => setReqForm(f => ({ ...f, experience: e.target.value }))} />
              </div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
                <div>
                  <label style={label}>Home Type</label>
                  <select className="field" value={reqForm.homeType} onChange={e => setReqForm(f => ({ ...f, homeType: e.target.value }))}>
                    {["Apartment","House","Farm","Other"].map(o => <option key={o}>{o}</option>)}
                  </select>
                </div>
                <div style={{ display: "flex", alignItems: "flex-end", paddingBottom: 4 }}>
                  <label style={{ display: "flex", alignItems: "center", gap: 8, cursor: "pointer", fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>
                    <input type="checkbox" checked={reqForm.hasYard} onChange={e => setReqForm(f => ({ ...f, hasYard: e.target.checked }))} style={{ accentColor: "var(--accent)", width: 15, height: 15 }} />
                    Has yard
                  </label>
                </div>
              </div>
              <div style={{ display: "flex", gap: 10 }}>
                <button type="submit" disabled={requesting} className="btn-ink" style={{ flex: 1, opacity: requesting ? 0.6 : 1 }}>
                  {requesting ? "Submitting…" : "Submit Request 🐾"}
                </button>
                <button type="button" onClick={() => setShowForm(false)} className="btn-outline" style={{ padding: "11px 20px" }}>Cancel</button>
              </div>
            </form>
          ) : null}
        </div>
      </div>
    </div>
  );
}
