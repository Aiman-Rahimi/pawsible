"use client";
import { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { Bell, Check, X } from "lucide-react";
import { Notification } from "@/types";

export function NotificationBell() {
  const { data: session } = useSession();
  const [notifs,   setNotifs]   = useState<Notification[]>([]);
  const [unread,   setUnread]   = useState(0);
  const [open,     setOpen]     = useState(false);
  const [loading,  setLoading]  = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!session) return;
    fetchNotifs();
    const interval = setInterval(fetchNotifs, 30000); // poll every 30s
    return () => clearInterval(interval);
  }, [session]);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    }
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  async function fetchNotifs() {
    try {
      const res  = await fetch("/api/notifications");
      const json = await res.json();
      setNotifs(json.data?.notifications ?? []);
      setUnread(json.data?.unreadCount ?? 0);
    } catch {}
  }

  async function markAllRead() {
    setLoading(true);
    await fetch("/api/notifications/all", { method: "PATCH" });
    setNotifs(n => n.map(x => ({ ...x, read: true })));
    setUnread(0);
    setLoading(false);
  }

  async function markRead(id: string) {
    await fetch(`/api/notifications/${id}`, { method: "PATCH" });
    setNotifs(n => n.map(x => x.id === id ? { ...x, read: true } : x));
    setUnread(u => Math.max(0, u - 1));
  }

  if (!session) return null;

  const TYPE_COLOR: Record<string, string> = {
    SUCCESS: "#15803d",
    INFO:    "var(--accent)",
    WARNING: "#d97706",
    ERROR:   "#dc2626",
  };

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button onClick={() => setOpen(!open)} style={{
        position: "relative", padding: 8, borderRadius: 10,
        border: "1.5px solid var(--border)", background: "white",
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        transition: "border-color 0.15s",
      }}
        onMouseEnter={e => (e.currentTarget.style.borderColor = "var(--ink)")}
        onMouseLeave={e => (e.currentTarget.style.borderColor = "var(--border)")}>
        <Bell style={{ width: 16, height: 16, color: unread > 0 ? "var(--accent)" : "var(--muted)" }} />
        {unread > 0 && (
          <span style={{
            position: "absolute", top: -4, right: -4, width: 18, height: 18,
            background: "var(--accent)", color: "white", borderRadius: "50%",
            fontSize: "0.6rem", fontWeight: 700, fontFamily: "var(--font-body)",
            display: "flex", alignItems: "center", justifyContent: "center",
            border: "2px solid var(--paper)",
          }}>
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div style={{
          position: "absolute", right: 0, top: "calc(100% + 8px)", width: 340,
          background: "white", borderRadius: 20, boxShadow: "0 8px 40px rgba(0,0,0,0.14)",
          border: "1px solid var(--border)", zIndex: 300, overflow: "hidden",
        }}>
          {/* Header */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "14px 16px 10px", borderBottom: "1px solid var(--border)" }}>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: "0.95rem" }}>
              Notifications {unread > 0 && <span style={{ color: "var(--accent)" }}>({unread})</span>}
            </p>
            {unread > 0 && (
              <button onClick={markAllRead} disabled={loading} style={{
                fontSize: "0.72rem", fontWeight: 600, color: "var(--accent)", background: "none",
                border: "none", cursor: "pointer", fontFamily: "var(--font-body)",
                display: "flex", alignItems: "center", gap: 4,
              }}>
                <Check style={{ width: 12, height: 12 }} /> Mark all read
              </button>
            )}
          </div>

          {/* List */}
          <div style={{ maxHeight: 360, overflowY: "auto" }}>
            {notifs.length === 0 ? (
              <div style={{ padding: "2.5rem 1rem", textAlign: "center", color: "var(--muted)", fontSize: "0.82rem", fontFamily: "var(--font-body)" }}>
                <Bell style={{ width: 28, height: 28, margin: "0 auto 8px", opacity: 0.3 }} />
                <p>No notifications yet</p>
              </div>
            ) : notifs.map(n => (
              <div key={n.id} onClick={() => { markRead(n.id); if (n.link) window.location.href = n.link; }}
                style={{
                  padding: "12px 16px", cursor: "pointer", transition: "background 0.15s",
                  background: n.read ? "transparent" : "rgba(232,98,42,0.04)",
                  borderBottom: "1px solid var(--border)", display: "flex", gap: 10, alignItems: "flex-start",
                }}
                onMouseEnter={e => (e.currentTarget.style.background = "var(--cream)")}
                onMouseLeave={e => (e.currentTarget.style.background = n.read ? "transparent" : "rgba(232,98,42,0.04)")}>
                <div style={{
                  width: 8, height: 8, borderRadius: "50%", flexShrink: 0, marginTop: 5,
                  background: n.read ? "transparent" : TYPE_COLOR[n.type] ?? "var(--accent)",
                }} />
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontSize: "0.82rem", fontWeight: n.read ? 400 : 700, fontFamily: "var(--font-body)", color: "var(--ink)", marginBottom: 2 }}>
                    {n.title}
                  </p>
                  <p style={{ fontSize: "0.75rem", color: "var(--muted)", fontFamily: "var(--font-body)", lineHeight: 1.5 }}>
                    {n.message}
                  </p>
                  <p style={{ fontSize: "0.68rem", color: "#b8b0a8", fontFamily: "var(--font-body)", marginTop: 4 }}>
                    {new Date(n.createdAt).toLocaleDateString("en-MY", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
