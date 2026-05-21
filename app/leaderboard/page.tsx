// app/leaderboard/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Award, Crown, Gift, Medal, Sparkles, Trophy } from "lucide-react";
import { LeaderboardEntry } from "@/types";

const pointsGuide = [
  ["Complete profile", "+50"],
  ["First request", "+100"],
  ["Approved adoption", "+200"],
  ["Daily visit", "+5"],
  ["Save a favorite", "+10"],
  ["Leave a review", "+25"],
];

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/leaderboard?limit=20")
      .then((response) => response.json().then((json) => ({ response, json })))
      .then(({ response, json }) => {
        if (!response.ok) throw new Error(json.error ?? "Failed to load leaderboard");
        setLeaders(json.data?.leaderboard ?? []);
      })
      .catch((err) => setError(err.message ?? "Failed to load leaderboard"))
      .finally(() => setLoading(false));
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  return (
    <div className="page-shell" style={{ maxWidth: 980 }}>
      <div style={{ textAlign: "center", marginBottom: "2.5rem" }}>
        <div style={{ width: 66, height: 66, borderRadius: 22, background: "rgba(201,149,47,0.14)", color: "var(--gold)", display: "grid", placeItems: "center", margin: "0 auto 1rem" }}>
          <Trophy style={{ width: 32, height: 32 }} />
        </div>
        <div className="eyebrow" style={{ justifyContent: "center" }}>Reward ranking</div>
        <h1 className="heading-lg" style={{ marginTop: "0.8rem" }}>Celebrate the adopters making the biggest impact.</h1>
        <p style={{ color: "var(--muted)", margin: "0.9rem auto 0", maxWidth: 620, lineHeight: 1.7 }}>
          Points now unlock reward tiers, giving active adopters visible recognition and clear milestones to keep participating.
        </p>
      </div>

      {error ? (
        <div className="card-white" style={{ padding: "2rem", color: "#b42318", textAlign: "center" }}>{error}</div>
      ) : loading ? (
        <div style={{ display: "grid", gap: 12 }}>
          {Array.from({ length: 8 }).map((_, index) => (
            <div key={index} className="card-white skeleton" style={{ height: 78 }} />
          ))}
        </div>
      ) : (
        <>
          {top3.length > 0 && (
            <div className="responsive-grid" style={{ gridTemplateColumns: "repeat(3, minmax(0, 1fr))", alignItems: "stretch", marginBottom: "1.5rem" }}>
              {top3.map((entry, index) => {
                const icons = [Crown, Medal, Award];
                const Icon = icons[index];
                return (
                  <article key={entry.id} className="card-white interactive-card" style={{ padding: "1.35rem", textAlign: "center", borderColor: index === 0 ? "rgba(201,149,47,0.38)" : "var(--border)" }}>
                    <div style={{ width: 58, height: 58, borderRadius: "50%", display: "grid", placeItems: "center", margin: "0 auto 0.85rem", color: "#fff", background: index === 0 ? "linear-gradient(135deg,#c9952f,#f1c96c)" : "linear-gradient(135deg,var(--accent),var(--rose))" }}>
                      <Icon style={{ width: 28, height: 28 }} />
                    </div>
                    <span className="badge-soft">Rank #{entry.rank}</span>
                    <h2 style={{ marginTop: "0.7rem", fontSize: "1.35rem", fontWeight: 900 }}>{entry.name}</h2>
                    <p style={{ color: "var(--accent)", fontWeight: 900, marginTop: 4 }}>{entry.points} points</p>
                    <div className="reward-badge" style={{ marginTop: "0.9rem", justifyContent: "center", color: entry.rewardTier.accent, borderColor: `${entry.rewardTier.accent}33`, background: `${entry.rewardTier.accent}14` }}>
                      <Gift style={{ width: 14, height: 14 }} /> {entry.rewardTier.name}
                    </div>
                    <p style={{ color: "var(--muted)", fontSize: "0.78rem", marginTop: "0.7rem" }}>{entry.rewardTier.perk}</p>
                  </article>
                );
              })}
            </div>
          )}

          <div className="two-col" style={{ gridTemplateColumns: "1.35fr 0.85fr", alignItems: "start" }}>
            <section className="card-white" style={{ overflow: "hidden" }}>
              {leaders.length === 0 ? (
                <div style={{ padding: "3rem 1.5rem", textAlign: "center" }}>
                  <Sparkles style={{ width: 42, height: 42, color: "var(--accent)", margin: "0 auto 1rem" }} />
                  <h2 style={{ fontSize: "1.4rem", fontWeight: 900 }}>No ranking yet</h2>
                  <p style={{ color: "var(--muted)", marginTop: 8 }}>Adopters will appear here once they earn points.</p>
                </div>
              ) : (
                leaders.map((entry, index) => (
                  <div
                    key={entry.id}
                    style={{
                      display: "grid",
                      gridTemplateColumns: "42px 1fr auto",
                      gap: 14,
                      alignItems: "center",
                      padding: "1rem 1.15rem",
                      borderBottom: index < leaders.length - 1 ? "1px solid var(--border)" : "none",
                    }}
                  >
                    <span style={{ width: 38, height: 38, borderRadius: 14, background: "var(--cream)", display: "grid", placeItems: "center", fontWeight: 900, color: "var(--muted)" }}>
                      {entry.rank}
                    </span>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 900, color: "var(--ink)" }}>{entry.name}</p>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 7, marginTop: 6 }}>
                        <span className="reward-badge" style={{ color: entry.rewardTier.accent, borderColor: `${entry.rewardTier.accent}33`, background: `${entry.rewardTier.accent}14` }}>
                          {entry.rewardTier.name}
                        </span>
                        {entry.adoptionsApproved > 0 && <span className="badge-soft">{entry.adoptionsApproved} approved</span>}
                      </div>
                      {entry.nextReward.tier && (
                        <div style={{ marginTop: 10 }}>
                          <div style={{ height: 7, borderRadius: 999, background: "var(--cream)", overflow: "hidden" }}>
                            <div style={{ width: `${entry.nextReward.progress}%`, height: "100%", borderRadius: 999, background: entry.rewardTier.accent }} />
                          </div>
                          <p style={{ color: "var(--muted)", fontSize: "0.72rem", marginTop: 5 }}>
                            {entry.nextReward.pointsNeeded} points to {entry.nextReward.tier.name}
                          </p>
                        </div>
                      )}
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <strong style={{ display: "block", fontFamily: "var(--font-display)", fontSize: "1.35rem", color: "var(--accent)" }}>{entry.points}</strong>
                      <span style={{ color: "var(--muted)", fontSize: "0.72rem" }}>points</span>
                    </div>
                  </div>
                ))
              )}
            </section>

            <aside className="card-cream" style={{ padding: "1.25rem", position: "sticky", top: 88 }}>
              <h2 style={{ fontSize: "1.25rem", fontWeight: 900, marginBottom: "0.35rem" }}>Reward guide</h2>
              <p style={{ color: "var(--muted)", fontSize: "0.86rem", lineHeight: 1.6, marginBottom: "1rem" }}>
                Earn points through helpful adoption actions and climb into higher reward tiers.
              </p>
              <div style={{ display: "grid", gap: 8 }}>
                {pointsGuide.map(([label, points]) => (
                  <div key={label} style={{ display: "flex", justifyContent: "space-between", gap: 12, padding: "0.75rem 0.85rem", borderRadius: 14, background: "rgba(255,255,255,0.72)", border: "1px solid var(--border)" }}>
                    <span style={{ color: "var(--muted)", fontSize: "0.84rem" }}>{label}</span>
                    <strong style={{ color: "var(--accent)", fontSize: "0.84rem" }}>{points}</strong>
                  </div>
                ))}
              </div>
            </aside>
          </div>
        </>
      )}
    </div>
  );
}
