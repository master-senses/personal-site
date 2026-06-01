"use client";

import Link from "next/link";

const NAV_LINKS = [
  { href: "#work", label: "Work" },
  { href: "#projects", label: "Projects" },
  { href: "#research", label: "Research" },
  { href: "#skills", label: "Skills" },
];

export default function Nav() {
  return (
    <header
      className="sticky top-0 z-50"
      style={{
        background: "var(--titlebar)",
        borderBottom: "2px solid var(--border)",
        boxShadow: "0 2px 0 0 rgba(0,0,0,0.4)",
      }}
    >
      {/* Mac-style menu bar */}
      <div
        className="flex items-stretch"
        style={{ height: 40 }}
      >
        {/* Apple logo area / Logo */}
        <Link
          href="/"
          className="flex items-center px-4 gap-2 transition-colors"
          style={{
            borderRight: "1px solid var(--border)",
            fontFamily: "var(--font-geist-mono)",
            fontSize: 13,
            fontWeight: 700,
            color: "var(--yellow)",
            letterSpacing: "-0.02em",
          }}
        >
          <span
            style={{
              width: 18,
              height: 18,
              borderRadius: 3,
              background: "var(--yellow)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "var(--text-on-yellow)",
              fontSize: 10,
              fontWeight: 900,
            }}
          >
            HK
          </span>
          <span className="hidden sm:block">hrishikesh</span>
        </Link>

        {/* Nav links — looks like Mac menu bar items */}
        <nav
          className="flex items-stretch"
          aria-label="Primary navigation"
          style={{ borderRight: "1px solid var(--border)" }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="flex items-center px-4 transition-colors hover:bg-[var(--yellow)] hover:text-[var(--text-on-yellow)]"
              style={{
                fontSize: 13,
                fontFamily: "var(--font-geist-sans)",
                color: "var(--text-muted)",
                borderRight: "1px solid var(--border)",
              }}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Right side — external links */}
        <div className="flex items-stretch ml-auto">
          <a
            href="https://github.com/master-senses"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub profile"
            className="flex items-center px-3 transition-colors hover:text-yellow"
            style={{
              borderLeft: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <GithubIcon />
          </a>
          <a
            href="https://linkedin.com/in/hrishikeshkalyanaraman"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn profile"
            className="flex items-center px-3 transition-colors hover:text-yellow"
            style={{
              borderLeft: "1px solid var(--border)",
              color: "var(--text-muted)",
            }}
          >
            <LinkedinIcon />
          </a>
          <a
            href="mailto:hrishikeshkalyanaraman@gmail.com"
            className="flex items-center px-4 gap-2 font-mono text-xs font-semibold transition-colors"
            style={{
              borderLeft: "2px solid var(--yellow)",
              background: "var(--yellow)",
              color: "var(--text-on-yellow)",
            }}
          >
            Get in touch
          </a>
        </div>
      </div>

      {/* Second bar — breadcrumb / status */}
      <div
        className="flex items-center px-4 gap-2"
        style={{
          height: 24,
          borderTop: "1px solid var(--border-strong)",
          background: "rgba(0,0,0,0.2)",
        }}
      >
        <span className="section-label" style={{ fontSize: 10 }}>
          <span style={{ color: "var(--yellow)" }}>●</span>
          <span>personal-site</span>
          <span style={{ color: "var(--text-faint)" }}>/</span>
          <span>main</span>
        </span>
        <div className="ml-auto flex items-center gap-3">
          <span className="section-label" style={{ fontSize: 10 }}>
            <span style={{ color: "var(--green)" }}>●</span>
            available for work
          </span>
          <span className="section-label" style={{ fontSize: 10 }}>
            Urbana-Champaign, IL
          </span>
        </div>
      </div>
    </header>
  );
}

function GithubIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
