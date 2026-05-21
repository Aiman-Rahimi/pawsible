import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "@/components/Providers";
import { Navbar } from "@/components/Navbar";

export const metadata: Metadata = {
  title: "Pawsible - Find Your Perfect Pet",
  description: "Connect with pets who need a forever home.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Providers>
          <div className="app-shell">
            <Navbar />
            <main className="app-main">{children}</main>
            <footer className="site-footer">
              <div
                className="container mobile-stack"
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "1rem",
                }}
              >
                <div>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.25rem", fontWeight: 900, color: "var(--paper)" }}>
                    Pawsible
                  </p>
                  <p style={{ fontSize: "0.78rem", marginTop: 4 }}>
                    Built with Next.js, TypeScript, PostgreSQL, and Prisma.
                  </p>
                </div>
                <p style={{ fontSize: "0.78rem" }}>
                  Copyright {new Date().getFullYear()} Pawsible. Every pet deserves a loving home.
                </p>
              </div>
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
