"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Home, Leaf, PawPrint, RotateCcw, Search, ShieldCheck, Sparkles, Trophy, Users, Zap } from "lucide-react";
import { Pet } from "@/types";
import { PetCard } from "@/components/PetCard";

type Step = 0 | 1 | 2 | 3 | 4 | 5;

const QUESTIONS = [
  {
    key: "home",
    q: "What kind of home will they settle into?",
    helper: "This helps us balance energy, size, and environment.",
    Icon: Home,
    options: [
      { label: "Apartment", value: "apartment", desc: "Compact, cozy, shared building" },
      { label: "House with yard", value: "house", desc: "Room to wander and play" },
      { label: "Farm or rural home", value: "farm", desc: "More space, more outdoor rhythm" },
    ],
  },
  {
    key: "activity",
    q: "What is your everyday pace?",
    helper: "We will match calmer homes with gentler pets and active homes with playful companions.",
    Icon: Zap,
    options: [
      { label: "Quiet and cozy", value: "low", desc: "Short walks, soft evenings" },
      { label: "Balanced", value: "medium", desc: "Regular walks and weekend outings" },
      { label: "Very active", value: "high", desc: "Runs, hikes, high-energy play" },
    ],
  },
  {
    key: "kids",
    q: "Are there young children at home?",
    helper: "Family compatibility matters for everyone in the house.",
    Icon: Users,
    options: [
      { label: "Yes, young kids", value: "yes", desc: "Prioritize patient, kid-friendly pets" },
      { label: "Older kids or none", value: "no", desc: "A wider range of personalities can fit" },
    ],
  },
  {
    key: "pets",
    q: "Will they share the home with other pets?",
    helper: "We will favor pets with compatible social signals.",
    Icon: PawPrint,
    options: [
      { label: "Yes, other pets", value: "yes", desc: "Look for good-with-pets profiles" },
      { label: "No other pets", value: "no", desc: "They can be the center of attention" },
    ],
  },
  {
    key: "experience",
    q: "How much pet experience do you have?",
    helper: "First-time adopters may benefit from calmer, trained, vaccinated pets.",
    Icon: ShieldCheck,
    options: [
      { label: "First-time adopter", value: "beginner", desc: "Prioritize easygoing and trained pets" },
      { label: "Some experience", value: "intermediate", desc: "Comfortable with normal routines" },
      { label: "Very experienced", value: "experienced", desc: "Open to more complex needs" },
    ],
  },
];

function scoreMatch(pet: Pet, answers: Record<string, string>): number {
  let score = 0;

  if (answers.home === "apartment") {
    if (pet.species === "Cat" || pet.species === "Rabbit" || pet.species === "Bird") score += 30;
    if (pet.traits.some((t) => ["Calm", "Quiet", "Indoor", "Gentle"].includes(t))) score += 20;
    if (pet.weight && pet.weight < 10) score += 15;
  } else if (answers.home === "house") {
    score += 20;
    if (pet.species === "Dog") score += 15;
  } else {
    score += 20;
    if (pet.species === "Dog") score += 20;
  }

  if (answers.activity === "high") {
    if (pet.species === "Dog") score += 25;
    if (pet.traits.some((t) => ["Energetic", "Playful", "Active"].includes(t))) score += 20;
  } else if (answers.activity === "low") {
    if (pet.species === "Cat" || pet.species === "Rabbit") score += 25;
    if (pet.traits.some((t) => ["Calm", "Lazy", "Gentle", "Quiet"].includes(t))) score += 20;
  } else {
    score += 15;
  }

  if (answers.kids === "yes" && pet.goodWithKids) score += 25;
  if (answers.kids === "no") score += 10;
  if (answers.pets === "yes" && pet.goodWithPets) score += 25;
  if (answers.pets === "no") score += 10;

  if (answers.experience === "beginner") {
    if (pet.houseTrained) score += 20;
    if (pet.vaccinated) score += 10;
    if (pet.traits.some((t) => ["Gentle", "Calm", "Easy-going"].includes(t))) score += 15;
  } else if (answers.experience === "experienced") {
    score += 15;
  } else {
    score += 10;
  }

  if (pet.status === "AVAILABLE") score += 10;

  return score;
}

export default function MatchPage() {
  const [step, setStep] = useState<Step>(0);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [results, setResults] = useState<Pet[]>([]);
  const [loading, setLoading] = useState(false);

  async function handleAnswer(key: string, value: string) {
    const newAnswers = { ...answers, [key]: value };
    setAnswers(newAnswers);

    if (step < QUESTIONS.length - 1) {
      setStep((step + 1) as Step);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/pets?limit=50&status=AVAILABLE");
      const json = await res.json();
      const pets: Pet[] = json.data?.pets ?? [];
      const scored = pets
        .map((pet) => ({ pet, score: scoreMatch(pet, newAnswers) }))
        .sort((a, b) => b.score - a.score)
        .slice(0, 6)
        .map((item) => item.pet);
      setResults(scored);
      setStep(5);
    } catch {
      setStep(5);
    } finally {
      setLoading(false);
    }
  }

  function restart() {
    setStep(0);
    setAnswers({});
    setResults([]);
  }

  const current = QUESTIONS[step] ?? QUESTIONS[0];
  const CurrentIcon = current.Icon;
  const progress = Math.round(((Math.min(step, QUESTIONS.length - 1) + 1) / QUESTIONS.length) * 100);

  return (
    <div className="premium-hero" style={{ minHeight: "calc(100vh - 68px)" }}>
      <div className="page-shell" style={{ maxWidth: 1080 }}>
        <div style={{ textAlign: "center", marginBottom: "2.4rem" }}>
          <div style={{ width: 64, height: 64, borderRadius: 24, background: "var(--ink)", color: "var(--paper)", display: "grid", placeItems: "center", margin: "0 auto 1rem", boxShadow: "var(--shadow-md)" }}>
            <Sparkles style={{ width: 30, height: 30 }} />
          </div>
          <div className="eyebrow" style={{ justifyContent: "center" }}>Smart matching</div>
          <h1 className="heading-lg" style={{ marginTop: "0.8rem" }}>Let us narrow the search to pets that fit your real life.</h1>
          <p className="lead" style={{ maxWidth: 680, margin: "0.9rem auto 0" }}>
            Five thoughtful questions, then a ranked shortlist based on home, pace, family needs, and experience.
          </p>
        </div>

        {step < QUESTIONS.length && !loading && (
          <div className="glass-panel" style={{ borderRadius: 34, padding: "clamp(1.2rem,4vw,2rem)" }}>
            <div style={{ display: "grid", gridTemplateColumns: "260px 1fr", gap: "clamp(1.25rem,4vw,2rem)", alignItems: "stretch" }} className="hero-grid">
              <aside style={{ borderRadius: 28, background: "var(--ink)", color: "var(--paper)", padding: "1.4rem", display: "flex", flexDirection: "column", justifyContent: "space-between", minHeight: 390 }}>
                <div>
                  <span className="metric-pill" style={{ background: "rgba(255,255,255,0.1)", color: "#fff", borderColor: "rgba(255,255,255,0.14)" }}>
                    <Trophy style={{ width: 14, height: 14 }} /> Better matches
                  </span>
                  <h2 style={{ fontSize: "1.6rem", fontWeight: 900, lineHeight: 1.08, marginTop: "1.1rem" }}>The right pet is a lifestyle fit, not just a cute face.</h2>
                </div>
                <div>
                  <div style={{ height: 9, borderRadius: 999, background: "rgba(255,255,255,0.13)", overflow: "hidden", marginBottom: "0.8rem" }}>
                    <div style={{ width: `${progress}%`, height: "100%", borderRadius: 999, background: "var(--accent)" }} />
                  </div>
                  <p style={{ color: "rgba(255,255,255,0.62)", fontSize: "0.84rem" }}>Question {step + 1} of {QUESTIONS.length}</p>
                </div>
              </aside>

              <section>
                <button
                  onClick={() => setStep((Math.max(0, step - 1) as Step))}
                  disabled={step === 0}
                  className="btn-ghost"
                  style={{ width: "auto", minHeight: 36, opacity: step === 0 ? 0.4 : 1, marginBottom: "1rem" }}
                >
                  <ArrowLeft style={{ width: 14, height: 14 }} /> Back
                </button>
                <div style={{ width: 58, height: 58, borderRadius: 22, background: "rgba(232,93,42,0.1)", color: "var(--accent)", display: "grid", placeItems: "center", marginBottom: "1rem" }}>
                  <CurrentIcon style={{ width: 28, height: 28 }} />
                </div>
                <h2 style={{ fontSize: "clamp(1.65rem,4vw,2.35rem)", fontWeight: 900, lineHeight: 1.05 }}>{current.q}</h2>
                <p style={{ color: "var(--muted)", lineHeight: 1.65, marginTop: "0.65rem" }}>{current.helper}</p>

                <div style={{ display: "grid", gap: 12, marginTop: "1.5rem" }}>
                  {current.options.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => handleAnswer(current.key, option.value)}
                      className="interactive-card"
                      style={{
                        display: "grid",
                        gridTemplateColumns: "1fr 34px",
                        alignItems: "center",
                        gap: 12,
                        padding: "1rem",
                        borderRadius: 20,
                        border: "1px solid var(--border)",
                        background: "rgba(255,255,255,0.76)",
                        textAlign: "left",
                        cursor: "pointer",
                      }}
                    >
                      <span>
                        <strong style={{ display: "block", color: "var(--ink)", fontSize: "1rem" }}>{option.label}</strong>
                        <span style={{ display: "block", color: "var(--muted)", fontSize: "0.86rem", marginTop: 3 }}>{option.desc}</span>
                      </span>
                      <span style={{ width: 34, height: 34, borderRadius: "50%", display: "grid", placeItems: "center", background: "var(--cream)", color: "var(--accent)" }}>
                        <ArrowRight style={{ width: 16, height: 16 }} />
                      </span>
                    </button>
                  ))}
                </div>
              </section>
            </div>
          </div>
        )}

        {loading && (
          <div className="glass-panel" style={{ borderRadius: 34, padding: "4rem 1.5rem", textAlign: "center" }}>
            <Search className="spin" style={{ width: 46, height: 46, color: "var(--accent)", margin: "0 auto 1rem" }} />
            <h2 style={{ fontSize: "1.8rem", fontWeight: 900 }}>Finding high-compatibility pets...</h2>
            <p style={{ color: "var(--muted)", marginTop: 8 }}>Checking traits, home fit, and availability.</p>
          </div>
        )}

        {step === 5 && !loading && (
          <div>
            <div className="glass-panel" style={{ borderRadius: 34, padding: "2rem", textAlign: "center", marginBottom: "1.2rem" }}>
              <Leaf style={{ width: 42, height: 42, color: "var(--sage)", margin: "0 auto 1rem" }} />
              <h2 className="heading-lg">Your best-fit shortlist is ready.</h2>
              <p className="lead" style={{ maxWidth: 620, margin: "0.85rem auto 0" }}>
                These pets ranked highest for your lifestyle answers. Open a profile to review details and submit a request.
              </p>
            </div>

            {results.length === 0 ? (
              <div className="card-white" style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                <PawPrint style={{ width: 44, height: 44, color: "var(--accent)", margin: "0 auto 1rem" }} />
                <h2 style={{ fontSize: "1.5rem", fontWeight: 900 }}>No available matches right now</h2>
                <p style={{ color: "var(--muted)", marginTop: 8 }}>Browse all pets or try again with broader preferences.</p>
              </div>
            ) : (
              <div className="responsive-grid">
                {results.map((pet) => <PetCard key={pet.id} pet={pet} />)}
              </div>
            )}

            <div className="mobile-stack" style={{ display: "flex", justifyContent: "center", gap: 12, marginTop: "1.6rem" }}>
              <button onClick={restart} className="btn-outline" style={{ width: "auto" }}>
                <RotateCcw style={{ width: 16, height: 16 }} /> Try again
              </button>
              <Link href="/pets" className="btn-ink" style={{ width: "auto" }}>
                Browse all pets <ArrowRight style={{ width: 16, height: 16 }} />
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
