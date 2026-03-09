"use client";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Star } from "lucide-react";
import { Review } from "@/types";

export function PetReviews({ petId }: { petId: string }) {
  const { data: session } = useSession();
  const [reviews,  setReviews]  = useState<Review[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [canReview, setCanReview] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [rating,   setRating]   = useState(5);
  const [comment,  setComment]  = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [hovered,  setHovered]  = useState(0);

  useEffect(() => { fetchReviews(); }, [petId]);

  async function fetchReviews() {
    const res  = await fetch(`/api/reviews/${petId}`);
    const json = await res.json();
    setReviews(json.data?.reviews ?? []);
    setLoading(false);
  }

  useEffect(() => {
    if (!session) return;
    // Check if user has approved request for this pet
    fetch("/api/adoption/mine").then(r => r.json()).then(json => {
      const requests = json.data?.requests ?? [];
      const hasApproved = requests.some((r: any) => r.petId === petId && r.status === "APPROVED");
      const alreadyReviewed = reviews.some((r: any) => r.userId === (session.user as any).id);
      setCanReview(hasApproved && !alreadyReviewed);
    });
  }, [session, reviews, petId]);

  async function submitReview(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res  = await fetch(`/api/reviews/${petId}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ rating, comment }) });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      setReviews(r => [json.data.review, ...r]);
      setShowForm(false);
      setCanReview(false);
    } catch (err: any) { alert(err.message); } finally { setSubmitting(false); }
  }

  const avgRating = reviews.length > 0 ? (reviews.reduce((s, r) => s + r.rating, 0) / reviews.length).toFixed(1) : null;

  const label = { display: "block" as const, fontSize: "0.72rem", fontWeight: 700, marginBottom: 6, textTransform: "uppercase" as const, letterSpacing: "0.06em", fontFamily: "var(--font-body)", color: "var(--ink)" };

  return (
    <div style={{ marginTop: "3rem", paddingTop: "2.5rem", borderTop: "1px solid var(--border)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "1.5rem" }}>
        <div>
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "1.4rem", fontWeight: 800, letterSpacing: "-0.03em" }}>
            Reviews {avgRating && <span style={{ color: "var(--accent)" }}>★ {avgRating}</span>}
          </h2>
          <p style={{ fontSize: "0.78rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
            {reviews.length} review{reviews.length !== 1 ? "s" : ""}
          </p>
        </div>
        {canReview && !showForm && (
          <button onClick={() => setShowForm(true)} className="btn-accent" style={{ fontSize: "0.8rem", padding: "8px 18px" }}>
            ✍️ Write Review
          </button>
        )}
      </div>

      {/* Review form */}
      {showForm && (
        <form onSubmit={submitReview} style={{ background: "var(--cream)", borderRadius: 16, padding: "1.5rem", marginBottom: "1.5rem", border: "1px solid var(--border)" }}>
          <h3 style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "1rem", marginBottom: "1rem" }}>Your Review</h3>
          <div style={{ marginBottom: "1rem" }}>
            <label style={label}>Rating</label>
            <div style={{ display: "flex", gap: 6 }}>
              {[1,2,3,4,5].map(s => (
                <button key={s} type="button"
                  onMouseEnter={() => setHovered(s)} onMouseLeave={() => setHovered(0)}
                  onClick={() => setRating(s)} style={{ background: "none", border: "none", cursor: "pointer", padding: 2 }}>
                  <Star style={{ width: 28, height: 28, color: s <= (hovered || rating) ? "#f59e0b" : "#d1d5db" }} fill={s <= (hovered || rating) ? "#f59e0b" : "none"} />
                </button>
              ))}
            </div>
          </div>
          <div style={{ marginBottom: "1rem" }}>
            <label style={label}>Comment (optional)</label>
            <textarea rows={3} className="field" style={{ resize: "none" }} placeholder="Share your experience..."
              value={comment} onChange={e => setComment(e.target.value)} />
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <button type="submit" disabled={submitting} className="btn-ink" style={{ opacity: submitting ? 0.6 : 1 }}>
              {submitting ? "Submitting…" : "Submit Review"}
            </button>
            <button type="button" onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>
          </div>
        </form>
      )}

      {/* Reviews list */}
      {loading ? (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {[1,2].map(i => <div key={i} style={{ height: 80, background: "var(--cream)", borderRadius: 14 }} className="pulse-bg" />)}
        </div>
      ) : reviews.length === 0 ? (
        <div style={{ textAlign: "center", padding: "2.5rem", background: "var(--cream)", borderRadius: 16 }}>
          <Star style={{ width: 28, height: 28, color: "#d1d5db", margin: "0 auto 8px" }} />
          <p style={{ color: "var(--muted)", fontSize: "0.85rem", fontFamily: "var(--font-body)" }}>No reviews yet. Be the first!</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
          {reviews.map(r => (
            <div key={r.id} style={{ background: "white", borderRadius: 16, padding: "1.25rem", border: "1px solid rgba(0,0,0,0.06)" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 8 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <div style={{ width: 34, height: 34, borderRadius: "50%", background: "linear-gradient(135deg, var(--accent), #cf4f1e)", display: "flex", alignItems: "center", justifyContent: "center", color: "white", fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "0.85rem" }}>
                    {r.user?.name?.[0]?.toUpperCase()}
                  </div>
                  <div>
                    <p style={{ fontFamily: "var(--font-body)", fontWeight: 700, fontSize: "0.85rem", color: "var(--ink)" }}>{r.user?.name}</p>
                    <p style={{ fontSize: "0.68rem", color: "var(--muted)", fontFamily: "var(--font-body)" }}>
                      {new Date(r.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "short", year: "numeric" })}
                    </p>
                  </div>
                </div>
                <div style={{ display: "flex", gap: 2 }}>
                  {[1,2,3,4,5].map(s => (
                    <Star key={s} style={{ width: 14, height: 14, color: s <= r.rating ? "#f59e0b" : "#e5e7eb" }} fill={s <= r.rating ? "#f59e0b" : "none"} />
                  ))}
                </div>
              </div>
              {r.comment && <p style={{ fontSize: "0.83rem", color: "var(--muted)", lineHeight: 1.65, fontFamily: "var(--font-body)" }}>{r.comment}</p>}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
