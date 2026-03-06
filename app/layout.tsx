import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Pawsible — Find Your Perfect Pet",
  description: "Connect with pets who need a forever home.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>
            <Navbar />
            <main style={{ flex: 1 }}>{children}</main>
            <footer style={{
              background: "var(--ink)", color: "rgba(255,255,255,0.35)",
              borderTop: "1px solid rgba(255,255,255,0.06)",
              padding: "2.5rem 3rem", display: "flex",
              alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem"
            }}>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.2rem", fontWeight: 800, color: "var(--paper)", letterSpacing: "-0.02em" }}>
                  🐾 Pawsible
                </p>
                <p style={{ fontSize: "0.75rem", marginTop: 4, fontFamily: "var(--font-body)" }}>
                  Built with Next.js · TypeScript · PostgreSQL · Prisma
                </p>
              </div>
              <p style={{ fontSize: "0.75rem", fontFamily: "var(--font-body)" }}>
                © {new Date().getFullYear()} Pawsible. Every pet deserves a loving home.
              </p>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
