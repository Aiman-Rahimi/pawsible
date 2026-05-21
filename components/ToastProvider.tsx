"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { CheckCircle, Info, XCircle } from "lucide-react";

type ToastTone = "success" | "error" | "info";
type ToastInput = { title: string; message?: string; tone?: ToastTone };
type Toast = ToastInput & { id: string; tone: ToastTone };

const ToastContext = createContext<{ showToast: (toast: ToastInput) => void } | null>(null);

const toneConfig = {
  success: { Icon: CheckCircle, color: "#24745a", bg: "rgba(63,143,114,0.12)" },
  error: { Icon: XCircle, color: "#b42318", bg: "rgba(180,35,24,0.1)" },
  info: { Icon: Info, color: "var(--sky)", bg: "rgba(57,118,216,0.1)" },
};

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: ToastInput) => {
    const id = crypto.randomUUID();
    const nextToast: Toast = { ...toast, id, tone: toast.tone ?? "info" };
    setToasts((current) => [...current, nextToast].slice(-4));
    window.setTimeout(() => {
      setToasts((current) => current.filter((item) => item.id !== id));
    }, 4200);
  }, []);

  const value = useMemo(() => ({ showToast }), [showToast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="true"
        style={{
          position: "fixed",
          right: 18,
          bottom: 18,
          zIndex: 500,
          display: "grid",
          gap: 10,
          width: "min(360px, calc(100vw - 2rem))",
        }}
      >
        {toasts.map((toast) => {
          const cfg = toneConfig[toast.tone];
          const Icon = cfg.Icon;
          return (
            <div
              key={toast.id}
              className="panel anim-fade-up"
              style={{
                display: "grid",
                gridTemplateColumns: "34px 1fr",
                gap: 10,
                padding: "0.9rem",
                boxShadow: "var(--shadow-md)",
              }}
            >
              <span style={{ width: 34, height: 34, borderRadius: 12, background: cfg.bg, color: cfg.color, display: "grid", placeItems: "center" }}>
                <Icon style={{ width: 18, height: 18 }} />
              </span>
              <span>
                <strong style={{ display: "block", fontSize: "0.9rem", color: "var(--ink)" }}>{toast.title}</strong>
                {toast.message && <span style={{ display: "block", color: "var(--muted)", fontSize: "0.8rem", lineHeight: 1.45, marginTop: 2 }}>{toast.message}</span>}
              </span>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return context;
}
