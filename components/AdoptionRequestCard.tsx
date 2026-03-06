// components/AdoptionRequestCard.tsx
"use client";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Check, X, Clock, CheckCircle, XCircle, AlertCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { AdoptionRequest, RequestStatus } from "@/types";

interface Props {
  request: AdoptionRequest;
  showActions?: boolean;
  onUpdate?: (id: string, status: RequestStatus, note?: string) => void;
}

const STATUS_CFG: Record<RequestStatus, { label: string; bg: string; color: string; icon: React.ElementType }> = {
  PENDING:   { label: "Pending",   bg: "rgba(251,191,36,0.15)", color: "#92400e", icon: Clock        },
  APPROVED:  { label: "Approved",  bg: "rgba(74,222,128,0.15)", color: "#15803d", icon: CheckCircle  },
  REJECTED:  { label: "Rejected",  bg: "rgba(239,68,68,0.15)",  color: "#dc2626", icon: XCircle      },
  CANCELLED: { label: "Cancelled", bg: "rgba(0,0,0,0.06)",      color: "#6b7280", icon: AlertCircle  },
};

export function AdoptionRequestCard({ request, showActions, onUpdate }: Props) {
  const [reviewNote, setReviewNote] = useState("");
  const [reviewing,  setReviewing]  = useState(false);
  const [loading,    setLoading]    = useState(false);

  const cfg  = STATUS_CFG[request.status];
  const Icon = cfg.icon;

  async function handleAction(status: "APPROVED" | "REJECTED") {
    setLoading(true);
    try {
      const res  = await fetch(`/api/adoption/${request.id}`, {
        method: "PATCH", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status, reviewNote: reviewNote || undefined }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      onUpdate?.(request.id, status, reviewNote);
      setReviewing(false);
    } catch (e: any) { alert(e.message); } finally { setLoading(false); }
  }

  return (
    <div className="card-white" style={{ padding: "1.25rem" }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 14 }}>

        {/* Pet photo */}
        <Link href={`/pets/${request.pet?.id}`} style={{ flexShrink: 0 }}>
          <div style={{ width: 60, height: 60, borderRadius: 14, overflow: "hidden", position: "relative",
            background: "var(--cream)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.8rem" }}>
            {request.pet?.photoUrl
              ? <Image src={request.pet.photoUrl} alt={request.pet.name ?? ""} fill style={{ objectFit: "cover" }} />
              : "🐾"}
          </div>
        </Link>

        {/* Content */}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 8, flexWrap: "wrap" }}>
            <div>
              <Link href={`/pets/${request.pet?.id}`}
                style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem",
                  letterSpacing: "-0.02em", color: "var(--ink)", textDecoration: "none" }}>
                {request.pet?.name}
              </Link>
              <p style={{ fontSize: "0.75rem", color: "var(--muted)", marginTop: 2, fontFamily: "var(--font-body)" }}>
                {request.pet?.breed}
              </p>
            </div>
            <span style={{ display: "inline-flex", alignItems: "center", gap: 5, fontSize: "0.65rem",
              fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase",
              padding: "4px 10px", borderRadius: "100px",
              background: cfg.bg, color: cfg.color, flexShrink: 0 }}>
              <Icon style={{ width: 11, height: 11 }} /> {cfg.label}
            </span>
          </div>

          {/* Applicant */}
          {request.user && (
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
              <div style={{ width: 24, height: 24, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,var(--accent),#cf4f1e)",
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "0.65rem", fontFamily: "var(--font-display)", fontWeight: 800 }}>
                {request.user.name?.[0]}
              </div>
              <span style={{ fontSize: "0.78rem", fontWeight: 600, color: "var(--ink)", fontFamily: "var(--font-body)" }}>
                {request.user.name}
              </span>
              <span style={{ fontSize: "0.72rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                {request.user.email}
              </span>
            </div>
          )}

          {/* Message */}
          {request.message && (
            <p style={{ marginTop: 8, fontSize: "0.78rem", color: "var(--muted)", fontStyle: "italic",
              background: "var(--cream)", borderRadius: 10, padding: "8px 12px", lineHeight: 1.6,
              fontFamily: "var(--font-body)" }}>
              "{request.message}"
            </p>
          )}

          {/* Meta */}
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8,
            fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {request.homeType  && <span>🏠 {request.homeType}</span>}
            {request.hasYard   && <span>🌿 Has Yard</span>}
            {request.experience && <span>💼 Has experience</span>}
            <span>🕐 {formatDistanceToNow(new Date(request.requestDate), { addSuffix: true })}</span>
          </div>

          {request.reviewNote && (
            <p style={{ marginTop: 8, fontSize: "0.72rem", color: "var(--muted)",
              borderLeft: "2px solid var(--border)", paddingLeft: 10, fontFamily: "var(--font-body)" }}>
              Note: {request.reviewNote}
            </p>
          )}

          {/* Admin actions */}
          {showActions && request.status === "PENDING" && (
            <div style={{ marginTop: 12 }}>
              {reviewing ? (
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  <textarea rows={2} className="field" style={{ fontSize: "0.78rem", resize: "none" }}
                    placeholder="Optional review note…"
                    value={reviewNote} onChange={e => setReviewNote(e.target.value)} />
                  <div style={{ display: "flex", gap: 8 }}>
                    <button onClick={() => handleAction("APPROVED")} disabled={loading}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px",
                        borderRadius: "100px", background: "#22c55e", color: "white", border: "none",
                        fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)",
                        opacity: loading ? 0.6 : 1, transition: "all 0.15s" }}>
                      <Check style={{ width: 12, height: 12 }} /> Approve
                    </button>
                    <button onClick={() => handleAction("REJECTED")} disabled={loading}
                      style={{ display: "flex", alignItems: "center", gap: 6, padding: "7px 16px",
                        borderRadius: "100px", background: "#ef4444", color: "white", border: "none",
                        fontSize: "0.75rem", fontWeight: 700, cursor: "pointer", fontFamily: "var(--font-body)",
                        opacity: loading ? 0.6 : 1, transition: "all 0.15s" }}>
                      <X style={{ width: 12, height: 12 }} /> Reject
                    </button>
                    <button onClick={() => setReviewing(false)}
                      style={{ padding: "7px 14px", borderRadius: "100px", border: "none", background: "none",
                        fontSize: "0.75rem", color: "var(--muted)", cursor: "pointer", fontFamily: "var(--font-body)" }}>
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <button onClick={() => setReviewing(true)}
                  style={{ fontSize: "0.75rem", fontWeight: 700, color: "var(--accent)", background: "none",
                    border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
                    textDecoration: "underline", textUnderlineOffset: 3 }}>
                  Review request →
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
