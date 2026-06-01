import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Nav from "@/components/Nav";

export const metadata: Metadata = {
  title: "Hrishikesh Kalyanaraman",
  description:
    "Software engineer building AI tooling, design systems, and things that actually ship.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable}`}>
      <body>
        <Nav />
        <main>{children}</main>

        {/* OS-style status bar footer */}
        <footer
          style={{
            borderTop: "2px solid var(--border)",
            background: "var(--titlebar)",
            height: 28,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            paddingInline: 16,
            position: "sticky",
            bottom: 0,
            zIndex: 50,
          }}
        >
          <div className="flex items-center gap-4">
            <span
              className="font-mono"
              style={{ fontSize: 10, color: "var(--text-faint)" }}
            >
              hrishikesh kalyanaraman · personal-site v1.0
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a
              href="mailto:hrishikeshkalyanaraman@gmail.com"
              className="font-mono transition-colors"
              style={{ fontSize: 10, color: "var(--text-faint)" }}
            >
              hrishikeshkalyanaraman@gmail.com
            </a>
            <span style={{ width: 1, height: 10, background: "var(--border)" }} />
            <a
              href="https://github.com/master-senses"
              target="_blank"
              rel="noopener noreferrer"
              className="font-mono transition-colors"
              style={{ fontSize: 10, color: "var(--text-faint)" }}
            >
              github/master-senses
            </a>
          </div>
        </footer>
      </body>
    </html>
  );
}
