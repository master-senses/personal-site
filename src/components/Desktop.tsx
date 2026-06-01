"use client";

import { useCallback, useRef, useState } from "react";
import DraggableWindow from "./DraggableWindow";
import Terminal from "./Terminal";
import AboutWindow from "./windows/AboutWindow";
import WorkWindow from "./windows/WorkWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ResearchWindow from "./windows/ResearchWindow";
import SkillsWindow from "./windows/SkillsWindow";
import ExperienceContent from "./windows/ExperienceContent";
import ProjectContent from "./windows/ProjectContent";
import ResearchContent from "./windows/ResearchContent";
import {
  ContentItem,
  ExperienceFrontmatter,
  ProjectFrontmatter,
  ResearchFrontmatter,
} from "@/lib/mdx";

// ── Fixed window IDs ──────────────────────────────────────────────────────────
type WinId = "terminal" | "about" | "work" | "projects" | "research" | "skills";

interface WinConfig {
  open: boolean;
  x: number;
  y: number;
  z: number;
}

const INITIAL: Record<WinId, WinConfig> = {
  terminal:  { open: true,  x: 0,   y: 50,  z: 10 },
  about:     { open: false, x: 660, y: 50,  z: 0  },
  work:      { open: false, x: 60,  y: 80,  z: 0  },
  projects:  { open: false, x: 80,  y: 100, z: 0  },
  research:  { open: false, x: 100, y: 120, z: 0  },
  skills:    { open: false, x: 120, y: 140, z: 0  },
};

const WIN_WIDTHS: Record<WinId, number> = {
  terminal: 580,
  about:    640,
  work:     980,
  projects: 1080,
  research: 960,
  skills:   860,
};

/** Individual desktop file windows — ~70ch body at 17px sans */
const ITEM_WIN_WIDTHS = { default: 720, project: 880 } as const;

const WIN_TITLES: Record<WinId, string> = {
  terminal: "terminal — bash",
  about:    "about.txt",
  work:     "work.txt",
  projects: "projects/",
  research: "research.txt",
  skills:   "skills.json",
};

const NAV_ITEMS: { id: WinId; label: string }[] = [
  { id: "work",     label: "Work"     },
  { id: "projects", label: "Projects" },
  { id: "research", label: "Research" },
  { id: "skills",   label: "Skills"   },
];

// ── Item window state ─────────────────────────────────────────────────────────
type ItemType = "experience" | "project" | "research";

interface ItemWin {
  open: boolean;
  x: number;
  y: number;
  z: number;
  type: ItemType;
  slug: string;
  title: string;
}

// Desktop icon groups
interface IconGroup {
  label: string;
  icons: { filename: string; type: ItemType; slug: string }[];
}

// ── Props ─────────────────────────────────────────────────────────────────────
interface Props {
  experience: ContentItem<ExperienceFrontmatter>[];
  projects: ContentItem<ProjectFrontmatter>[];
  research: ContentItem<ResearchFrontmatter>[];
}

// ── Filename helpers ──────────────────────────────────────────────────────────
function expFilename(slug: string, company: string): string {
  const shortCompany = company
    .replace("Eli Lilly and Company", "lilly")
    .replace("Illini Solar Car", "illini-solar")
    .replace("Optivolt Labs", "optivolt")
    .replace("NCSA (National Center for Supercomputing Applications)", "ncsa")
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 20);
  if (slug.includes("intern")) return `${shortCompany}-intern.txt`;
  return `${shortCompany}.txt`;
}

// ── Component ─────────────────────────────────────────────────────────────────
export default function Desktop({ experience, projects, research }: Props) {
  const [windows, setWindows] = useState<Record<WinId, WinConfig>>(INITIAL);
  const [itemWins, setItemWins] = useState<Record<string, ItemWin>>({});
  const zCounter = useRef(11);

  // ── Focus / open / close for fixed windows ───────────────────────────────
  const focus = useCallback((id: string) => {
    if (id in INITIAL) {
      setWindows((prev) => ({ ...prev, [id]: { ...prev[id as WinId], z: ++zCounter.current } }));
    } else {
      setItemWins((prev) => ({ ...prev, [id]: { ...prev[id], z: ++zCounter.current } }));
    }
  }, []);

  const openFixed = useCallback((id: WinId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], open: true, z: ++zCounter.current },
    }));
  }, []);

  const closeWin = useCallback((id: string) => {
    if (id in INITIAL) {
      setWindows((prev) => ({ ...prev, [id as WinId]: { ...prev[id as WinId], open: false, z: 0 } }));
    } else {
      setItemWins((prev) => ({ ...prev, [id]: { ...prev[id], open: false, z: 0 } }));
    }
  }, []);

  // ── Open individual item window ──────────────────────────────────────────
  const openItem = useCallback((type: ItemType, slug: string, filename: string) => {
    const key = `${type}::${slug}`;
    const existing = itemWins[key];
    if (existing?.open) {
      // Bring to front
      setItemWins((prev) => ({ ...prev, [key]: { ...prev[key], z: ++zCounter.current } }));
      return;
    }
    // Stagger position for each new window
    const base = { experience: { x: 200, y: 80 }, project: { x: 220, y: 100 }, research: { x: 240, y: 120 } }[type] ?? { x: 200, y: 80 };
    const offset = Object.keys(itemWins).filter((k) => itemWins[k].open).length;
    setItemWins((prev) => ({
      ...prev,
      [key]: {
        open: true,
        x: base.x + offset * 24,
        y: base.y + offset * 24,
        z: ++zCounter.current,
        type,
        slug,
        title: filename,
      },
    }));
  }, [itemWins]);

  // ── Terminal callback — position about.txt just right of terminal center ──
  const handleAboutOpen = useCallback(() => {
    const terminalWidth = WIN_WIDTHS.terminal;
    const aboutWidth = WIN_WIDTHS.about;
    const gap = 24;
    // terminal right edge = 50vw + terminalWidth/2
    // clamp so about doesn't go off-screen right
    const x = typeof window !== "undefined"
      ? Math.min(
          Math.round(window.innerWidth / 2 + terminalWidth / 2 + gap),
          window.innerWidth - aboutWidth - 16
        )
      : 640;
    setWindows((prev) => ({
      ...prev,
      about: { ...prev.about, open: true, x, y: INITIAL.about.y, z: ++zCounter.current },
    }));
  }, []);

  // ── Build icon groups ────────────────────────────────────────────────────
  const iconGroups: IconGroup[] = [
    {
      label: "work/",
      icons: experience.map((e) => ({
        filename: expFilename(e.slug, e.frontmatter.company),
        type: "experience" as ItemType,
        slug: e.slug,
      })),
    },
    {
      label: "projects/",
      icons: projects.map((p) => ({
        filename: `${p.slug}.txt`,
        type: "project" as ItemType,
        slug: p.slug,
      })),
    },
    {
      label: "research/",
      icons: research.map((r) => ({
        filename: `${r.slug}.txt`,
        type: "research" as ItemType,
        slug: r.slug,
      })),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}>

      {/* ── Menubar ──────────────────────────────────────────────────────── */}
      <header style={{ background: "var(--titlebar)", borderBottom: "2px solid var(--border)", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "stretch", height: 44 }}>
          {/* Logo */}
          <button
            onClick={() => openFixed("terminal")}
            style={{ display: "flex", alignItems: "center", gap: 9, padding: "0 18px", background: "none", border: "none", borderRight: "1px solid var(--border)", cursor: "pointer", fontFamily: "var(--font-geist-mono)", fontSize: "var(--font-base)", fontWeight: 700, color: "var(--yellow)", letterSpacing: "-0.02em" }}
          >
            <span style={{ width: 22, height: 22, borderRadius: 4, background: "var(--yellow)", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--text-on-yellow)", fontSize: 9, fontWeight: 900, flexShrink: 0 }}>HK</span>
            <span>hrishikesh</span>
          </button>

          {/* Nav items */}
          <nav style={{ display: "flex", alignItems: "stretch", borderRight: "1px solid var(--border)" }}>
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => openFixed(item.id)}
                style={{ display: "flex", alignItems: "center", padding: "0 20px", background: windows[item.id].open ? "rgba(249,189,43,0.1)" : "none", border: "none", borderRight: "1px solid var(--border)", borderBottom: windows[item.id].open ? "2px solid var(--yellow)" : "2px solid transparent", cursor: "pointer", fontSize: "var(--font-base)", color: "var(--text)", fontFamily: "var(--font-geist-sans)", fontWeight: 500, transition: "color 0.15s, background 0.15s" }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "stretch", marginLeft: "auto" }}>
            <a href="https://github.com/master-senses" target="_blank" rel="noopener noreferrer" aria-label="GitHub" style={{ display: "flex", alignItems: "center", padding: "0 13px", borderLeft: "1px solid var(--border)", color: "var(--blue)", textDecoration: "none" }}>
              <GithubIcon />
            </a>
            <a href="https://linkedin.com/in/hrishikeshkalyanaraman" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" style={{ display: "flex", alignItems: "center", padding: "0 13px", borderLeft: "1px solid var(--border)", color: "var(--blue)", textDecoration: "none" }}>
              <LinkedinIcon />
            </a>
            <a href="mailto:hrishikeshkalyanaraman@gmail.com" style={{ display: "flex", alignItems: "center", padding: "0 18px", borderLeft: "2px solid var(--yellow)", background: "var(--yellow)", color: "var(--text-on-yellow)", fontFamily: "var(--font-geist-mono)", fontSize: "var(--font-sm)", fontWeight: 700, textDecoration: "none" }}>
              Get in touch
            </a>
          </div>
        </div>

        {/* Status sub-bar */}
        <div style={{ height: 26, display: "flex", alignItems: "center", paddingInline: 16, gap: 8, borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "var(--font-xs)", color: "var(--yellow)" }}>●</span>
          <span className="type-caption" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text)" }}>personal-site</span>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: "var(--font-xs)", color: "var(--text-secondary)" }}>/</span>
          <span className="type-caption" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text)" }}>main</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 20 }}>
            <span className="type-caption" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--green)", fontWeight: 600 }}>● available for work</span>
            <span className="type-caption" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text)" }}>Indianapolis, IN</span>
          </div>
        </div>
      </header>

      {/* ── Desktop ──────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>

        {/* Fixed windows */}
        <DraggableWindow id="terminal" title={WIN_TITLES.terminal} initialX={INITIAL.terminal.x} initialY={INITIAL.terminal.y} width={WIN_WIDTHS.terminal} isOpen={windows.terminal.open} zIndex={windows.terminal.z} onFocus={focus} onClose={closeWin} accentBar centered>
          <Terminal onAboutOpen={handleAboutOpen} />
        </DraggableWindow>

        <DraggableWindow id="about" title={WIN_TITLES.about} initialX={INITIAL.about.x} initialY={INITIAL.about.y} width={WIN_WIDTHS.about} isOpen={windows.about.open} zIndex={windows.about.z} onFocus={focus} onClose={closeWin}>
          <AboutWindow />
        </DraggableWindow>

        <DraggableWindow id="work" title={WIN_TITLES.work} initialX={INITIAL.work.x} initialY={INITIAL.work.y} width={WIN_WIDTHS.work} isOpen={windows.work.open} zIndex={windows.work.z} onFocus={focus} onClose={closeWin}>
          <WorkWindow experience={experience} />
        </DraggableWindow>

        <DraggableWindow id="projects" title={WIN_TITLES.projects} initialX={INITIAL.projects.x} initialY={INITIAL.projects.y} width={WIN_WIDTHS.projects} isOpen={windows.projects.open} zIndex={windows.projects.z} onFocus={focus} onClose={closeWin}>
          <ProjectsWindow projects={projects} />
        </DraggableWindow>

        <DraggableWindow id="research" title={WIN_TITLES.research} initialX={INITIAL.research.x} initialY={INITIAL.research.y} width={WIN_WIDTHS.research} isOpen={windows.research.open} zIndex={windows.research.z} onFocus={focus} onClose={closeWin}>
          <ResearchWindow research={research} />
        </DraggableWindow>

        <DraggableWindow id="skills" title={WIN_TITLES.skills} initialX={INITIAL.skills.x} initialY={INITIAL.skills.y} width={WIN_WIDTHS.skills} isOpen={windows.skills.open} zIndex={windows.skills.z} onFocus={focus} onClose={closeWin}>
          <SkillsWindow />
        </DraggableWindow>

        {/* Dynamic item windows */}
        {Object.entries(itemWins).map(([key, win]) => {
          if (!win.open) return null;
          let content: React.ReactNode = null;
          if (win.type === "experience") {
            const item = experience.find((e) => e.slug === win.slug);
            if (item) content = <ExperienceContent item={item} />;
          } else if (win.type === "project") {
            const item = projects.find((p) => p.slug === win.slug);
            if (item) content = <ProjectContent item={item} />;
          } else if (win.type === "research") {
            const item = research.find((r) => r.slug === win.slug);
            if (item) content = <ResearchContent item={item} />;
          }
          return (
            <DraggableWindow key={key} id={key} title={win.title} initialX={win.x} initialY={win.y} width={win.type === "project" ? ITEM_WIN_WIDTHS.project : ITEM_WIN_WIDTHS.default} isOpen={win.open} zIndex={win.z} onFocus={focus} onClose={closeWin}>
              {content}
            </DraggableWindow>
          );
        })}

        {/* ── Desktop icon grid (LEFT side) ──────────────────────────── */}
        <div
          style={{
            position: "absolute",
            top: 16,
            left: 16,
            width: 400,
            display: "flex",
            flexDirection: "column",
            gap: 28,
            zIndex: 1,
            pointerEvents: "none",
          }}
        >
          {iconGroups.map((group) => (
            <div key={group.label} style={{ pointerEvents: "auto" }}>
              {/* Group label */}
              <div className="type-label" style={{
                fontFamily: "var(--font-geist-mono)",
                color: "var(--blue)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-label)",
                marginBottom: 10,
                paddingBottom: 5,
                borderBottom: "1px solid var(--blue-border)",
              }}>
                {group.label}
              </div>
              {/* Icon grid */}
              <div style={{ display: "flex", flexWrap: "wrap", columnGap: 36, rowGap: 28 }}>
                {group.icons.map((icon) => (
                  <DesktopIcon
                    key={icon.slug}
                    filename={icon.filename}
                    onClick={() => openItem(icon.type, icon.slug, icon.filename)}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Footer status bar ──────────────────────────────────────────── */}
      <footer style={{ background: "var(--titlebar)", borderTop: "2px solid var(--border)", height: 28, display: "flex", alignItems: "center", justifyContent: "space-between", paddingInline: 16, flexShrink: 0 }}>
        <span className="type-caption" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text)" }}>hrishikesh kalyanaraman · personal-site v2.0</span>
        <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
          <a href="mailto:hrishikeshkalyanaraman@gmail.com" className="type-caption" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text)", textDecoration: "none" }}>hrishikeshkalyanaraman@gmail.com</a>
          <span style={{ width: 1, height: 10, background: "var(--border)" }} />
          <a href="https://github.com/master-senses" target="_blank" rel="noopener noreferrer" className="type-caption" style={{ fontFamily: "var(--font-geist-mono)", color: "var(--text)", textDecoration: "none" }}>github/master-senses</a>
        </div>
      </footer>
    </div>
  );
}

// ── Desktop icon (macOS-style: big doc + label below) ────────────────────────
function DesktopIcon({ filename, onClick }: { filename: string; onClick: () => void }) {
  const [hovered, setHovered] = useState(false);

  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 8,
        padding: "10px 8px 9px",
        background: hovered ? "rgba(249,189,43,0.1)" : "transparent",
        border: hovered ? "1px solid var(--yellow-border)" : "1px solid transparent",
        borderRadius: 6,
        cursor: "pointer",
        width: "var(--icon-desktop-btn)",
        boxSizing: "border-box",
        overflow: "hidden",
        transition: "background 0.12s, border-color 0.12s",
      }}
    >
      <BigTxtFileIcon />
      <span className="type-label" style={{
        fontFamily: "var(--font-geist-mono)",
        fontSize: "var(--font-sm)",
        fontWeight: 500,
        color: "var(--text)",
        textAlign: "center",
        lineHeight: 1.2,
        whiteSpace: "nowrap",
        maxWidth: "100%",
      }}>
        {filename}
      </span>
    </button>
  );
}

function BigTxtFileIcon() {
  return (
    <svg style={{ width: "var(--icon-desktop-w)", height: "var(--icon-desktop-h)" }} viewBox="0 0 52 64" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="37" height="49" rx="2" fill="var(--bg-window)" stroke="var(--yellow)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L39 13" stroke="var(--yellow)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L27 13 L39 13" fill="rgba(249,189,43,0.15)" stroke="var(--yellow)" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="7" y1="22" x2="32" y2="22" stroke="var(--text-secondary)" strokeOpacity="0.8" strokeWidth="1.5" />
      <line x1="7" y1="28" x2="32" y2="28" stroke="var(--text-secondary)" strokeOpacity="0.8" strokeWidth="1.5" />
      <line x1="7" y1="34" x2="23" y2="34" stroke="var(--text-secondary)" strokeOpacity="0.8" strokeWidth="1.5" />
      <rect x="0" y="42" width="52" height="22" rx="3" fill="var(--yellow)" />
      <text x="26" y="58" fontFamily="monospace" fontSize="13" fontWeight="800" fill="var(--text-on-yellow)" textAnchor="middle">TXT</text>
    </svg>
  );
}

function GithubIcon() {
  return (
    <svg style={{ width: "var(--icon-inline)", height: "var(--icon-inline)" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  );
}

function LinkedinIcon() {
  return (
    <svg style={{ width: "var(--icon-inline)", height: "var(--icon-inline)" }} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  );
}
