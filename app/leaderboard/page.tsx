// app/leaderboard/page.tsx
"use client";
import { useState, useEffect } from "react";
import { Trophy } from "lucide-react";
import { LeaderboardEntry } from "@/types";

export default function LeaderboardPage() {
  const [leaders, setLeaders] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/leaderboard?limit=20")
      .then(r => r.json())
      .then(j => { setLeaders(j.data?.leaderboard ?? []); setLoading(false); });
  }, []);

  const top3 = leaders.slice(0, 3);
  const rest = leaders.slice(3);

  const avatarColors = [
    "linear-gradient(135deg,#f59e0b,#d97706)",
    "linear-gradient(135deg,#6366f1,#4f46e5)",
    "linear-gradient(135deg,#10b981,#059669)",
    "linear-gradient(135deg,#f472b6,#ec4899)",
    "linear-gradient(135deg,#fb923c,#f97316)",
  ];

  return (
    <div style={{ maxWidth: 640, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "3rem" }}>
        <div style={{ width: 60, height: 60, borderRadius: 18, background: "rgba(212,168,67,0.15)",
          display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 1rem" }}>
          <Trophy style={{ width: 28, height: 28, color: "var(--gold)" }} />
        </div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)",
          fontWeight: 900, letterSpacing: "-0.04em" }}>Leaderboard</h1>
        <p style={{ color: "var(--muted)", marginTop: 8, fontSize: "0.88rem", fontFamily: "var(--font-body)" }}>
          Top adopters ranked by points earned.
        </p>
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="card-white" style={{ height: 64, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : (
        <>
          {/* Podium */}
          {top3.length > 0 && (
            <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "center",
              gap: "1rem", marginBottom: "2.5rem" }}>
              {/* 2nd */}
              {top3[1] && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%",
                    background: avatarColors[1],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem" }}>
                    {top3[1].name[0]}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>{top3[1].name.split(" ")[0]}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{top3[1].points} pts</p>
                  </div>
                  <div style={{ background: "#d1d5db", width: "100%", height: 70, borderRadius: "10px 10px 0 0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "white" }}>2</div>
                </div>
              )}
              {/* 1st */}
              {top3[0] && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                  <span style={{ fontSize: "1.5rem" }}>👑</span>
                  <div style={{ width: 52, height: 52, borderRadius: "50%",
                    background: avatarColors[0],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.3rem",
                    boxShadow: "0 0 0 3px white, 0 0 0 5px var(--gold)" }}>
                    {top3[0].name[0]}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.88rem", fontFamily: "var(--font-body)" }}>{top3[0].name.split(" ")[0]}</p>
                    <p style={{ fontSize: "0.72rem", color: "var(--accent)", fontWeight: 700, fontFamily: "var(--font-body)" }}>{top3[0].points} pts</p>
                  </div>
                  <div style={{ background: "var(--gold)", width: "100%", height: 100, borderRadius: "10px 10px 0 0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: "2rem", fontWeight: 900, color: "white",
                    boxShadow: "0 8px 24px rgba(212,168,67,0.35)" }}>1</div>
                </div>
              )}
              {/* 3rd */}
              {top3[2] && (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 8, flex: 1 }}>
                  <div style={{ width: 44, height: 44, borderRadius: "50%",
                    background: avatarColors[2],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem" }}>
                    {top3[2].name[0]}
                  </div>
                  <div style={{ textAlign: "center" }}>
                    <p style={{ fontWeight: 700, fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>{top3[2].name.split(" ")[0]}</p>
                    <p style={{ fontSize: "0.7rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{top3[2].points} pts</p>
                  </div>
                  <div style={{ background: "#b45309", width: "100%", height: 50, borderRadius: "10px 10px 0 0",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 900, color: "white" }}>3</div>
                </div>
              )}
            </div>
          )}

          {/* Rest */}
          {rest.length > 0 && (
            <div className="card-white" style={{ overflow: "hidden", marginBottom: "2rem" }}>
              {rest.map((entry, i) => (
                <div key={entry.id}
                  style={{ display: "flex", alignItems: "center", gap: 14, padding: "14px 20px",
                    borderBottom: i < rest.length - 1 ? "1px solid var(--border)" : "none",
                    transition: "background 0.15s" }}
                  onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
                  onMouseLeave={e => (e.currentTarget.style.background = "transparent")}>
                  <span style={{ width: 28, textAlign: "center", fontFamily: "var(--font-display)",
                    fontSize: "1rem", fontWeight: 800, color: "var(--muted)" }}>{entry.rank}</span>
                  <div style={{ width: 36, height: 36, borderRadius: "50%", flexShrink: 0,
                    background: avatarColors[i % avatarColors.length],
                    display: "flex", alignItems: "center", justifyContent: "center",
                    color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.9rem" }}>
                    {entry.name[0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>{entry.name}</p>
                    {entry.adoptionsApproved > 0 && (
                      <p style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                        🏡 {entry.adoptionsApproved} adoption{entry.adoptionsApproved !== 1 ? "s" : ""}
                      </p>
                    )}
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "1.1rem", color: "var(--accent)" }}>
                      {entry.points}
                    </p>
                    <p style={{ fontSize: "0.62rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>points</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Points info */}
          <div className="card-cream" style={{ padding: "1.5rem" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem",
              marginBottom: "1rem", letterSpacing: "-0.02em" }}>How to earn points</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
              {[
                ["Complete profile",    "+50"],
                ["First request",       "+100"],
                ["Get approved",        "+200"],
                ["Daily visit",         "+5"],
                ["Save a favorite",     "+10"],
                ["Leave a review",      "+25"],
              ].map(([label, pts]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between",
                  padding: "8px 12px", background: "white", borderRadius: 10 }}>
                  <span style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>{label}</span>
                  <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", fontFamily: "var(--font-body)" }}>{pts}</span>
                </div>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
