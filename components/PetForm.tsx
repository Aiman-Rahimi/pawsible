// components/PetForm.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Upload, X } from "lucide-react";
import Image from "next/image";
import { Pet } from "@/types";

interface PetFormProps { pet?: Partial<Pet>; mode: "create" | "edit"; }

const TRAITS = ["Playful","Friendly","Calm","Energetic","Loyal","Independent","Affectionate","Gentle","Intelligent","Curious","Active","Quiet","Cuddly","Protective"];
const SPECIES = ["Dog","Cat","Rabbit","Bird","Hamster","Other"];

export function PetForm({ pet, mode }: PetFormProps) {
  const router = useRouter();
  const [loading,      setLoading]      = useState(false);
  const [error,        setError]        = useState("");
  const [imagePreview, setImagePreview] = useState(pet?.photoUrl ?? "");
  const [uploading,    setUploading]    = useState(false);
  const [form, setForm] = useState({
    name: pet?.name ?? "", breed: pet?.breed ?? "", species: pet?.species ?? "Dog",
    age: pet?.age?.toString() ?? "", weight: pet?.weight?.toString() ?? "",
    gender: pet?.gender ?? "Male", color: pet?.color ?? "",
    photoUrl: pet?.photoUrl ?? "", description: pet?.description ?? "",
    traits: pet?.traits ?? [] as string[],
    vaccinated: pet?.vaccinated ?? false, neutered: pet?.neutered ?? false,
    houseTrained: pet?.houseTrained ?? false, goodWithKids: pet?.goodWithKids ?? false,
    goodWithPets: pet?.goodWithPets ?? false, status: pet?.status ?? "AVAILABLE",
  });

  function toggleTrait(t: string) {
    setForm(f => ({ ...f, traits: f.traits.includes(t) ? f.traits.filter(x => x !== t) : [...f.traits, t] }));
  }

  async function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]; if (!file) return;
    setUploading(true);
    try {
      const fd = new FormData(); fd.append("file", file);
      const res = await fetch("/api/upload", { method: "POST", body: fd });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setForm(f => ({ ...f, photoUrl: json.data.url }));
      setImagePreview(json.data.url);
    } catch { setError("Image upload failed."); } finally { setUploading(false); }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault(); setLoading(true); setError("");
    try {
      const payload = { ...form, age: parseFloat(form.age), weight: form.weight ? parseFloat(form.weight) : undefined };
      const url    = mode === "create" ? "/api/pets" : `/api/pets/${pet?.id}`;
      const method = mode === "create" ? "POST" : "PATCH";
      const res  = await fetch(url, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(payload) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      router.push(`/pets/${json.data.pet.id}`); router.refresh();
    } catch (e: any) { setError(e.message ?? "Something went wrong"); } finally { setLoading(false); }
  }

  const labelStyle = { display: "block", fontSize: "0.72rem", fontWeight: 700, marginBottom: 8,
    color: "var(--ink)", fontFamily: "var(--font-body)", textTransform: "uppercase" as const, letterSpacing: "0.06em" };

  const checkItem = (label: string, key: keyof typeof form) => (
    <label style={{ display: "flex", alignItems: "center", gap: 10, cursor: "pointer",
      padding: "10px 14px", borderRadius: 12, border: "1.5px solid var(--border)",
      background: form[key] ? "rgba(232,98,42,0.06)" : "white",
      borderColor: form[key] ? "var(--accent)" : "var(--border)", transition: "all 0.15s" }}>
      <input type="checkbox" checked={form[key] as boolean}
        onChange={e => setForm(f => ({ ...f, [key]: e.target.checked }))}
        style={{ accentColor: "var(--accent)", width: 15, height: 15 }} />
      <span style={{ fontSize: "0.82rem", fontWeight: 600, fontFamily: "var(--font-body)",
        color: form[key] ? "var(--accent)" : "var(--ink)" }}>{label}</span>
    </label>
  );

  return (
    <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "2rem" }}>
      {error && (
        <div style={{ background: "#fef2f2", border: "1px solid #fecaca", color: "#dc2626",
          borderRadius: 12, padding: "12px 16px", fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>
          {error}
        </div>
      )}

      {/* Photo */}
      <div>
        <p style={{ ...labelStyle, marginBottom: 14 }}>Pet Photo</p>
        <div style={{ display: "flex", alignItems: "flex-start", gap: 16 }}>
          <div style={{ width: 120, height: 120, borderRadius: 16, overflow: "hidden", position: "relative",
            background: "var(--cream)", border: "2px dashed var(--border)",
            display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            {imagePreview ? (
              <>
                <Image src={imagePreview} alt="preview" fill style={{ objectFit: "cover" }} />
                <button type="button" onClick={() => { setImagePreview(""); setForm(f => ({ ...f, photoUrl: "" })); }}
                  style={{ position: "absolute", top: 6, right: 6, background: "white", border: "none",
                    borderRadius: "50%", width: 22, height: 22, cursor: "pointer", display: "flex",
                    alignItems: "center", justifyContent: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.15)" }}>
                  <X style={{ width: 12, height: 12 }} />
                </button>
              </>
            ) : (
              <div style={{ textAlign: "center", color: "var(--muted)" }}>
                <Upload style={{ width: 20, height: 20, margin: "0 auto 4px" }} />
                <span style={{ fontSize: "0.65rem" }}>Upload</span>
              </div>
            )}
          </div>
          <div style={{ flex: 1 }}>
            <input type="file" accept="image/*" id="pet-photo" style={{ display: "none" }} onChange={handleImageUpload} />
            <label htmlFor="pet-photo" className="btn-outline" style={{ display: "inline-flex", cursor: "pointer", padding: "8px 18px", fontSize: "0.82rem" }}>
              {uploading ? "Uploading…" : "Choose Image"}
            </label>
            <p style={{ fontSize: "0.72rem", color: "var(--muted)", margin: "8px 0 6px", fontFamily: "var(--font-body)" }}>Or paste URL:</p>
            <input type="url" placeholder="https://..." className="field" style={{ fontSize: "0.82rem" }}
              value={form.photoUrl}
              onChange={e => { setForm(f => ({ ...f, photoUrl: e.target.value })); setImagePreview(e.target.value); }} />
          </div>
        </div>
      </div>

      {/* Basic Info */}
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem",
          letterSpacing: "-0.02em", marginBottom: "1rem" }}>Basic Information</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 14 }}>
          {[
            { label: "Pet Name *", key: "name",  type: "text",   placeholder: "e.g. Buddy" },
            { label: "Breed *",    key: "breed", type: "text",   placeholder: "e.g. Golden Retriever" },
            { label: "Age (yrs) *",key: "age",   type: "number", placeholder: "2" },
            { label: "Weight (kg)",key: "weight",type: "number", placeholder: "12.5" },
            { label: "Color",      key: "color", type: "text",   placeholder: "e.g. Golden" },
          ].map(f => (
            <div key={f.key}>
              <label style={labelStyle}>{f.label}</label>
              <input type={f.type} className="field" placeholder={f.placeholder}
                required={f.label.includes("*")}
                value={(form as any)[f.key]}
                onChange={e => setForm(prev => ({ ...prev, [f.key]: e.target.value }))} />
            </div>
          ))}
          <div>
            <label style={labelStyle}>Species</label>
            <select className="field" value={form.species} onChange={e => setForm(f => ({ ...f, species: e.target.value }))}>
              {SPECIES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label style={labelStyle}>Gender</label>
            <select className="field" value={form.gender} onChange={e => setForm(f => ({ ...f, gender: e.target.value }))}>
              {["Male","Female","Unknown"].map(g => <option key={g}>{g}</option>)}
            </select>
          </div>
          {mode === "edit" && (
            <div>
              <label style={labelStyle}>Status</label>
              <select className="field" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value as any }))}>
                {["AVAILABLE","PENDING","ADOPTED"].map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Description */}
      <div>
        <label style={labelStyle}>Description</label>
        <textarea rows={4} className="field" style={{ resize: "none" }}
          placeholder="Tell potential adopters about this pet's personality and history…"
          value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
      </div>

      {/* Traits */}
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem",
          letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Personality Traits</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
          {TRAITS.map(t => (
            <button key={t} type="button" onClick={() => toggleTrait(t)}
              style={{ fontFamily: "var(--font-body)", fontSize: "0.75rem", fontWeight: 600,
                padding: "6px 14px", borderRadius: "100px", cursor: "pointer", transition: "all 0.15s",
                background: form.traits.includes(t) ? "var(--accent)" : "var(--cream)",
                color: form.traits.includes(t) ? "white" : "var(--muted)",
                border: `1.5px solid ${form.traits.includes(t) ? "var(--accent)" : "transparent"}` }}>
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Health */}
      <div>
        <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem",
          letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>Health & Compatibility</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10 }}>
          {checkItem("Vaccinated",      "vaccinated"  )}
          {checkItem("Neutered/Spayed", "neutered"    )}
          {checkItem("House-trained",   "houseTrained")}
          {checkItem("Good with kids",  "goodWithKids")}
          {checkItem("Good with pets",  "goodWithPets")}
        </div>
      </div>

      {/* Submit */}
      <div style={{ display: "flex", gap: 12, paddingTop: 8 }}>
        <button type="submit" disabled={loading} className="btn-ink"
          style={{ opacity: loading ? 0.6 : 1 }}>
          {loading ? "Saving…" : mode === "create" ? "Add Pet 🐾" : "Save Changes"}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-outline">
          Cancel
        </button>
      </div>
    </form>
  );
}
