// app/adoption/page.tsx
"use client";
import { useState, useEffect, useCallback } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AdoptionRequestCard } from "@/components/AdoptionRequestCard";
import { AdoptionRequest, RequestStatus } from "@/types";

const TABS = [
  { label: "All",       value: ""          },
  { label: "Pending",   value: "PENDING"   },
  { label: "Approved",  value: "APPROVED"  },
  { label: "Rejected",  value: "REJECTED"  },
  { label: "Cancelled", value: "CANCELLED" },
];

export default function AdoptionPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const user    = session?.user as any;
  const isAdmin = user?.role === "ADMIN" || user?.role === "MODERATOR";

  const [requests, setRequests] = useState<AdoptionRequest[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [tab,      setTab]      = useState("PENDING");
  const [total,    setTotal]    = useState(0);

  useEffect(() => {
    if (status === "unauthenticated") router.push("/auth/login");
    if (!isAdmin && status === "authenticated") router.push("/adoption/mine");
  }, [status, isAdmin]);

  const fetchRequests = useCallback(async () => {
    setLoading(true);
    const p = new URLSearchParams({ limit: "50" });
    if (tab) p.set("status", tab);
    const res  = await fetch(`/api/adoption?${p}`);
    const json = await res.json();
    setRequests(json.data?.requests ?? []);
    setTotal(json.data?.total ?? 0);
    setLoading(false);
  }, [tab]);

  useEffect(() => { fetchRequests(); }, [fetchRequests]);

  return (
    <div style={{ maxWidth: 800, margin: "0 auto", padding: "3rem 2rem 5rem" }}>
      <div style={{ marginBottom: "2.5rem" }}>
        <div className="eyebrow" style={{ marginBottom: "0.75rem" }}>Admin</div>
        <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(2rem,4vw,2.8rem)",
          fontWeight: 900, letterSpacing: "-0.04em" }}>
          Adoption Requests
        </h1>
        <p style={{ fontSize: "0.82rem", color: "var(--muted)", marginTop: 4, fontFamily: "var(--font-body)" }}>
          {total} total request{total !== 1 ? "s" : ""}
        </p>
      </div>

      {/* Tabs */}
      <div style={{ display: "flex", gap: 8, marginBottom: "1.5rem", overflowX: "auto", paddingBottom: 4 }}>
        {TABS.map(t => (
          <button key={t.value} onClick={() => setTab(t.value)}
            style={{ flexShrink: 0, padding: "7px 18px", borderRadius: "100px",
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
          {[1,2,3,4].map(i => (
            <div key={i} className="card-white" style={{ height: 96, animation: "pulse 1.5s ease-in-out infinite" }} />
          ))}
        </div>
      ) : requests.length === 0 ? (
        <div style={{ textAlign: "center", padding: "5rem 0" }}>
          <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📭</div>
          <h3 style={{ fontFamily: "var(--font-display)", fontSize: "1.5rem", fontWeight: 700 }}>No requests found</h3>
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", marginTop: 6, fontFamily: "var(--font-body)" }}>
            {tab === "PENDING" ? "All caught up! No pending requests." : "No requests with this status."}
          </p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {requests.map(r => (
            <AdoptionRequestCard key={r.id} request={r} showActions={isAdmin}
              onUpdate={(id, s) => setRequests(prev => prev.map(x => x.id === id ? { ...x, status: s } : x))} />
          ))}
        </div>
      )}
    </div>
  );
}
