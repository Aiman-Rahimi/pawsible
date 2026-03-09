"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Pet } from "@/types";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const QUESTIONS = [
  {
    key: "home",
    q: "What type of home do you live in?",
    emoji: "🏠",
    options: [
      { label: "Apartment",       value: "apartment", emoji: "🏢" },
      { label: "House with yard", value: "house",     emoji: "🏡" },
      { label: "Farm / Rural",    value: "farm",      emoji: "🌾" },
    ],
  },
  {
    key: "activity",
    q: "How active is your lifestyle?",
    emoji: "🏃",
    options: [
      { label: "Couch potato",   value: "low",    emoji: "🛋️" },
      { label: "Moderate walks", value: "medium", emoji: "🚶" },
      { label: "Very active",    value: "high",   emoji: "⚡" },
    ],
  },
  {
    key: "kids",
    q: "Do you have young children at home?",
    emoji: "👶",
    options: [
      { label: "Yes, young kids",  value: "yes", emoji: "👨‍👩‍👧" },
      { label: "Older kids / none", value: "no", emoji: "🧑" },
    ],
  },
  {
    key: "pets",
    q: "Do you have other pets?",
    emoji: "🐾",
    options: [
      { label: "Yes, other pets", value: "yes", emoji: "🐕" },
      { label: "No other pets",   value: "no",  emoji: "1️⃣" },
    ],
  },
  {
    key: "experience",
    q: "What's your pet experience?",
    emoji: "📚",
    options: [
      { label: "First time owner", value: "beginner",      emoji: "🌱" },
      { label: "Some experience",  value: "intermediate",  emoji: "😊" },
      { label: "Very experienced", value: "experienced",   emoji: "🏆" },
    ],
  },
];

function scoreMatch(pet: Pet, answers: Record<string, string>): number {
  let score = 0;

  // Home type vs species/traits
  if (answers.home === "apartment") {
    if (pet.species === "Cat" || pet.species === "Rabbit" || pet.species === "Bird") score += 30;
    if (pet.traits.some(t => ["Calm","Quiet","Indoor","Gentle"].includes(t))) score += 20;
    if (pet.weight && pet.weight < 10) score += 15;
  } else if (answers.home === "house") {
    score += 20;
    if (pet.species === "Dog") score += 15;
  } else {
    score += 20;
    if (pet.species === "Dog") score += 20;
  }

  // Activity level
  if (answers.activity === "high") {
    if (pet.species === "Dog") score += 25;
    if (pet.traits.some(t => ["Energetic","Playful","Active"].includes(t))) score += 20;
  } else if (answers.activity === "low") {
    if (pet.species === "Cat" || pet.species === "Rabbit") score += 25;
    if (pet.traits.some(t => ["Calm","Lazy","Gentle","Quiet"].includes(t))) score += 20;
  } else {
    score += 15;
  }

  // Kids
  if (answers.kids === "yes" && pet.goodWithKids) score += 25;
  if (answers.kids === "no")                       score += 10;

  // Other pets
  if (answers.pets === "yes" && pet.goodWithPets) score += 25;
  if (answers.pets === "no")                      score += 10;

  // Experience
  if (answers.experience === "beginner") {
    if (pet.houseTrained) score += 20;
    if (pet.vaccinated)   score += 10;
    if (pet.traits.some(t => ["Gentle","Calm","Easy-going"].includes(t))) score += 15;
  } else if (answers.experience === "experienced") {
    score += 15;
  } else {
    score += 10;
  }

  // Bonus: available only
  if (pet.status === "AVAILABLE") score += 10;

  return score;
}

export default function MatchPage() {
  const [step,    setStep]    = useState<Step>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAnswer(key: string, value: string) {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep((step + 1) as Step);
    } else {
      // Last question — fetch and score
      setLoading(true);
      try {
        const res  = await fetch("/api/pets?limit=50&status=AVAILABLE");
        const json = await res.json();
        const pets: Pet[] = json.data?.pets ?? [];
        const scored = pets
          .map(p => ({ pet: p, score: scoreMatch(p, newAnswers) }))
          .sort((a, b) => b.score - a.score)
          .slice(0, 6)
          .map(x => x.pet);
        setResults(scored);
        setStep(5);
      } catch { setStep(5); } finally { setLoading(false); }
    }
  }

  function restart() { setStep(0); setAnswers({}); setResults([]); }

  const PET_EMOJI: Record<string, string> = { Dog:"🐶", Cat:"🐱", Rabbit:"🐰", Bird:"🐦" };
  const STATUS_BG: Record<string, { bg: string; color: string }> = {
    AVAILABLE: { bg: "rgba(74,222,128,0.18)", color: "#15803d" },
    PENDING:   { bg: "rgba(251,191,36,0.18)", color: "#92400e" },
    ADOPTED:   { bg: "rgba(0,0,0,0.06)",     color: "#6b6560" },
  };

  return (
    <div style={{ minHeight: "calc(100vh - 64px)", background: "var(--cream)" }}>
      <div style={{ maxWidth: 720, margin: "0 auto", padding: "4rem 2rem 6rem" }}>

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "3rem" }}>
          <div style={{ fontSize: "3rem", marginBottom: "1rem" }}>🤖</div>
          <div className="eyebrow" style={{ justifyContent: "center", marginBottom: "0.75rem" }}>Smart Matching</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "2.5rem", fontWeight: 900, letterSpacing: "-0.04em", color: "var(--ink)" }}>
            Find Your <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Perfect Match</em>
          </h1>
          <p style={{ color: "var(--muted)", fontSize: "0.9rem", marginTop: "0.75rem", fontFamily: "var(--font-body)" }}>
            Answer {QUESTIONS.length} quick questions — we'll match you with your ideal pet.
          </p>
        </div>

        {/* Quiz */}
        {step < QUESTIONS.length && (
          <div style={{ background: "white", borderRadius: 24, padding: "2.5rem", boxShadow: "0 4px 30px rgba(0,0,0,0.07)" }}>
            {/* Progress */}
            <div style={{ display: "flex", gap: 6, marginBottom: "2rem" }}>
              {QUESTIONS.map((_, i) => (
                <div key={i} style={{
                  flex: 1, height: 4, borderRadius: 4,
                  background: i <= step ? "var(--accent)" : "var(--cream)",
                  transition: "background 0.3s",
                }} />
              ))}
            </div>

            <p style={{ fontSize: "0.72rem", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "0.5rem" }}>
              Question {step + 1} of {QUESTIONS.length}
            </p>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em", marginBottom: "2rem", color: "var(--ink)" }}>
              {QUESTIONS[step].emoji} {QUESTIONS[step].q}
            </h2>

            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {QUESTIONS[step].options.map(opt => (
                <button key={opt.value} onClick={() => handleAnswer(QUESTIONS[step].key, opt.value)} style={{
                  display: "flex", alignItems: "center", gap: 16, padding: "16px 20px",
                  borderRadius: 16, border: "1.5px solid var(--border)", background: "white",
                  cursor: "pointer", textAlign: "left", transition: "all 0.15s", width: "100%",
                }}
                  onMouseEnter={e => { e.currentTarget.style.border = "1.5px solid var(--accent)"; e.currentTarget.style.background = "rgba(232,98,42,0.04)"; }}
                  onMouseLeave={e => { e.currentTarget.style.border = "1.5px solid var(--border)"; e.currentTarget.style.background = "white"; }}>
                  <span style={{ fontSize: "1.6rem" }}>{opt.emoji}</span>
                  <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: "0.95rem", color: "var(--ink)" }}>{opt.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Loading */}
        {loading && (
          <div style={{ textAlign: "center", padding: "4rem 2rem" }}>
            <div style={{ fontSize: "3rem", marginBottom: "1rem" }} className="spin">🔍</div>
            <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 700 }}>Finding your matches…</p>
          </div>
        )}

        {/* Results */}
        {step === 5 && !loading && (
          <div>
            <div style={{ textAlign: "center", marginBottom: "2rem" }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "0.75rem" }}>✨</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.8rem", fontWeight: 900, letterSpacing: "-0.04em" }}>
                Your Top Matches!
              </h2>
              <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: "0.5rem", fontFamily: "var(--font-body)" }}>
                Based on your answers, here are the best pets for you:
              </p>
            </div>

            {results.length === 0 ? (
              <div style={{ textAlign: "center", padding: "3rem", background: "white", borderRadius: 20 }}>
                <p style={{ color: "var(--muted)", fontFamily: "var(--font-body)" }}>No available pets right now. Check back soon!</p>
                <Link href="/pets" className="btn-ink" style={{ marginTop: "1.5rem", display: "inline-flex" }}>Browse All Pets</Link>
              </div>
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "1.25rem" }}>
                {results.map((pet, i) => {
                  const sc = STATUS_BG[pet.status] ?? STATUS_BG.AVAILABLE;
                  return (
                    <Link key={pet.id} href={`/pets/${pet.id}`} style={{ textDecoration: "none" }}>
                      <div style={{
                        background: "white", borderRadius: 20, overflow: "hidden",
                        border: i === 0 ? "2px solid var(--accent)" : "1px solid rgba(0,0,0,0.06)",
                        transition: "transform 0.3s, box-shadow 0.3s", position: "relative",
                      }}
                        onMouseEnter={e => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 16px 40px rgba(0,0,0,0.1)"; }}
                        onMouseLeave={e => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "none"; }}>
                        {i === 0 && (
                          <div style={{ position: "absolute", top: 12, right: 12, zIndex: 10, background: "var(--accent)", color: "white", fontSize: "0.6rem", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase", padding: "4px 10px", borderRadius: "100px", fontFamily: "var(--font-body)" }}>
                            Best Match ⭐
                          </div>
                        )}
                        <div style={{ height: 180, position: "relative", background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "5rem" }}>
                          {pet.photoUrl
                            ? <Image src={pet.photoUrl} alt={pet.name} fill style={{ objectFit: "cover" }} sizes="300px" />
                            : <span>{PET_EMOJI[pet.species] ?? "🐾"}</span>}
                        </div>
                        <div style={{ padding: "16px 18px 18px" }}>
                          <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", fontWeight: 700, letterSpacing: "-0.02em", color: "var(--ink)" }}>{pet.name}</p>
                          <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)", marginBottom: "0.75rem" }}>{pet.breed} · {pet.species}</p>
                          <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                            {pet.traits.slice(0, 3).map(t => (
                              <span key={t} style={{ fontSize: "0.65rem", fontWeight: 600, padding: "3px 9px", borderRadius: "100px", background: "var(--cream)", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{t}</span>
                            ))}
                          </div>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}

            <div style={{ display: "flex", gap: 12, marginTop: "2rem", justifyContent: "center" }}>
              <button onClick={restart} className="btn-outline">Try Again</button>
              <Link href="/pets" className="btn-ink">Browse All Pets →</Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
