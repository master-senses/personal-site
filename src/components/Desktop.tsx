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
import { BigTxtFileIcon } from "./icons/BigTxtFileIcon";
import { GithubIcon } from "./icons/GithubIcon";
import { LinkedinIcon } from "./icons/LinkedinIcon";
import { XIcon } from "./icons/XIcon";
import { CONTACT_MAILTO, openContactEmail } from "@/lib/contact";

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
  terminal: 480,
  about:    520,
  work:     780,
  projects: 860,
  research: 760,
  skills:   680,
};

/** Individual desktop file windows — ~55–60ch body at 17px sans */
const ITEM_WIN_WIDTHS = { default: 580, project: 700 } as const;

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

function renderItemContent(
  win: ItemWin,
  experience: ContentItem<ExperienceFrontmatter>[],
  projects: ContentItem<ProjectFrontmatter>[],
  research: ContentItem<ResearchFrontmatter>[],
) {
  switch (win.type) {
    case "experience": {
      const item = experience.find((e) => e.slug === win.slug);
      return item ? <ExperienceContent item={item} /> : null;
    }
    case "project": {
      const item = projects.find((p) => p.slug === win.slug);
      return item ? <ProjectContent item={item} /> : null;
    }
    case "research": {
      const item = research.find((r) => r.slug === win.slug);
      return item ? <ResearchContent item={item} /> : null;
    }
  }
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
    setItemWins((prev) => {
      const existing = prev[key];
      if (existing?.open) {
        return { ...prev, [key]: { ...existing, z: ++zCounter.current } };
      }
      const base = { experience: { x: 200, y: 80 }, project: { x: 220, y: 100 }, research: { x: 240, y: 120 } }[type] ?? { x: 200, y: 80 };
      const offset = Object.keys(prev).filter((k) => prev[k].open).length;
      return {
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
      };
    });
  }, []);

  // ── Terminal callback — position about.txt just right of terminal center ──
  const handleAboutOpen = useCallback(() => {
    const terminalWidth = WIN_WIDTHS.terminal;
    const aboutWidth = WIN_WIDTHS.about;
    const gap = 24;
    const x = typeof window !== "undefined"
      ? Math.min(
          Math.round(window.innerWidth / 2 + terminalWidth / 2 + gap),
          window.innerWidth - aboutWidth - 16
        )
      : 640;
    setWindows((prev) => ({
      ...prev,
      about: { ...prev.about, open: true, x, y: INITIAL.terminal.y, z: ++zCounter.current },
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
            type="button"
            onClick={() => openFixed("terminal")}
            className="menubar-logo-btn font-mono"
          >
            <span className="menubar-logo-mark">HK</span>
            <span>hrishikesh</span>
          </button>

          {/* Nav items */}
          <nav style={{ display: "flex", alignItems: "stretch", borderRight: "1px solid var(--border)" }}>
            {NAV_ITEMS.map((item) => (
              <button
                type="button"
                key={item.id}
                onClick={() => openFixed(item.id)}
                className="nav-item"
                data-open={windows[item.id].open}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right */}
          <div style={{ display: "flex", alignItems: "stretch", marginLeft: "auto" }}>
            <a href="https://github.com/master-senses" target="_blank" rel="noopener noreferrer" aria-label="GitHub" className="menubar-icon-link">
              <GithubIcon />
            </a>
            <a href="https://www.linkedin.com/in/hk39/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn" className="menubar-icon-link">
              <LinkedinIcon />
            </a>
            <a href="https://x.com/thereal_hk" target="_blank" rel="noopener noreferrer" aria-label="X" className="menubar-icon-link">
              <XIcon />
            </a>
            <a
              href={CONTACT_MAILTO}
              className="cta-link"
              onClick={(e) => {
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey || e.button !== 0) return;
                e.preventDefault();
                openContactEmail();
              }}
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Status sub-bar */}
        <div style={{ height: 28, display: "flex", alignItems: "center", paddingInline: 16, gap: 8, borderTop: "1px solid var(--border)", background: "rgba(0,0,0,0.2)" }}>
          <span className="font-mono" style={{ fontSize: "var(--font-xs)", color: "var(--yellow)" }}>●</span>
          <span className="type-caption font-mono" style={{ color: "var(--text)" }}>personal-site</span>
          <span className="font-mono" style={{ fontSize: "var(--font-xs)", color: "var(--text-dim)" }}>/</span>
          <span className="type-caption font-mono" style={{ color: "var(--text)" }}>main</span>
          <div style={{ marginLeft: "auto", display: "flex", gap: 24 }}>
            <span className="type-caption font-mono" style={{ color: "var(--green)", fontWeight: 600 }}>● available for work</span>
            <span className="type-caption font-mono" style={{ color: "var(--text)" }}>Indianapolis, IN</span>
          </div>
        </div>
      </header>

      {/* ── Desktop ──────────────────────────────────────────────────────── */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>

        {/* Fixed windows */}
        <DraggableWindow id="terminal" title={WIN_TITLES.terminal} initialX={INITIAL.terminal.x} initialY={INITIAL.terminal.y} width={WIN_WIDTHS.terminal} isOpen={windows.terminal.open} zIndex={windows.terminal.z} onFocus={focus} onClose={closeWin} accentBar centered>
          <Terminal onAboutOpen={handleAboutOpen} />
        </DraggableWindow>

        <DraggableWindow id="about" title={WIN_TITLES.about} initialX={windows.about.x} initialY={windows.about.y} width={WIN_WIDTHS.about} isOpen={windows.about.open} zIndex={windows.about.z} onFocus={focus} onClose={closeWin}>
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
          const content = renderItemContent(win, experience, projects, research);
          if (!content) return null;
          return (
            <DraggableWindow key={key} id={key} title={win.title} initialX={win.x} initialY={win.y} width={win.type === "project" ? ITEM_WIN_WIDTHS.project : ITEM_WIN_WIDTHS.default} isOpen={win.open} zIndex={win.z} onFocus={focus} onClose={closeWin}>
              {content}
            </DraggableWindow>
          );
        })}

        {/* ── Desktop icon grid (LEFT side) ──────────────────────────── */}
        <div className="desktop-icon-grid">
          {iconGroups.map((group) => (
            <div key={group.label} style={{ pointerEvents: "auto" }}>
              {/* Group label */}
              <div className="type-label font-mono" style={{
                color: "var(--blue)",
                textTransform: "uppercase",
                letterSpacing: "var(--tracking-label)",
                marginBottom: 8,
                paddingBottom: 4,
                borderBottom: "1px solid var(--blue-border)",
              }}>
                {group.label}
              </div>
              {/* Icon grid */}
              <div style={{ display: "flex", flexWrap: "wrap", columnGap: 32, rowGap: 32 }}>
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
      <footer className="desktop-footer">
        <span className="type-caption font-mono" style={{ color: "var(--text-dim)" }}>hrishikesh kalyanaraman</span>
      </footer>
    </div>
  );
}

// ── Desktop icon (macOS-style: big doc + label below) ────────────────────────
function DesktopIcon({ filename, onClick }: { filename: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="desktop-icon-btn"
    >
      <BigTxtFileIcon />
      <span className="type-label font-mono" style={{
        fontSize: "var(--font-sm)",
        fontWeight: 500,
        color: "var(--text)",
        textAlign: "center",
        lineHeight: "var(--leading-snug)",
        whiteSpace: "nowrap",
        maxWidth: "100%",
      }}>
        {filename}
      </span>
    </button>
  );
}
