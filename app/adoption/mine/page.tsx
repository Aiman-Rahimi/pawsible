// app/adoption/mine/page.tsx
"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { AdoptionRequestCard } from "@/components/AdoptionRequestCard";
import { AdoptionRequest } from "@/types";

const TABS = [
  { label: "All",      value: ""         },
  { label: "Pending",  value: "PENDING"  },
  { label: "Approved", value: "APPROVED" },
  { label: "Rejected", value: "REJECTED" },
];

export default function MyAdoptionsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("");

  useEffect(() => { if (status === "unauthenticated") router.push("/auth/login"); }, [status]);

  useEffect(() => {
    if (!session) return;
    setLoading(true);
    const p = new URLSearchParams();
    if (tab) p.set("status", tab);
    fetch(`/api/adoption?${p}`)
      .then(r => r.json())
      .then(j => { setRequests(j.data?.requests ?? []); setLoading(false); });
  }, [session, tab]);

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>My Journey</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)",
          fontWeight: 900, letterSpacing: "-0.04em" }}>My Adoption Requests</h1>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-body)" }}>
          Track the status of your applications.
        </p>
      </div>

      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem" }}>
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            style={{ padding: "7px 18px", borderRadius: "100px",
              border: `1.5px solid ${tab === t.value ? "var(--ink)" : "var(--border)"}`,
              background: tab === t.value ? "var(--ink)" : "white",
              color: tab === t.value ? "var(--paper)" : "var(--muted)",
              fontSize: "0.78rem", fontWeight: 600, cursor: "pointer",
              fontFamily: "var(--font-body)", transition: "all 0.15s" }}>
            {t.label}
          </button>
        ))}
      </div>

      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2,3].map(i => <div key={i} className="card-white" style={{ height: 90, animation: "pulse 1.5s ease-in-out infinite" }} />)}
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>🐾</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>No requests yet</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 6, fontFamily: "var(--font-body)" }}>
            Find a pet you love and submit your first adoption request!
          </p>
          <Link href="/pets" className="btn-ink" style={{ marginTop: "1.5rem", display: "inline-flex" }}>Browse Pets →</Link>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map(r => <AdoptionRequestCard key={r.id} request={r} showActions={false} />)}
        </div>
      )}
    </div>
  );
}
