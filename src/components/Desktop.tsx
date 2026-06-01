"use client";

import { useCallback, useRef, useState } from "react";
import DraggableWindow from "./DraggableWindow";
import Terminal from "./Terminal";
import AboutWindow from "./windows/AboutWindow";
import WorkWindow from "./windows/WorkWindow";
import ProjectsWindow from "./windows/ProjectsWindow";
import ResearchWindow from "./windows/ResearchWindow";
import SkillsWindow from "./windows/SkillsWindow";
import { ContentItem, ExperienceFrontmatter, ProjectFrontmatter, ResearchFrontmatter } from "@/lib/mdx";

type WinId = "terminal" | "about" | "work" | "projects" | "research" | "skills";

interface WinConfig {
  open: boolean;
  x: number;
  y: number;
  z: number;
}

const INITIAL: Record<WinId, WinConfig> = {
  terminal:  { open: true,  x: 36,  y: 60,  z: 10 },
  about:     { open: false, x: 520, y: 60,  z: 0  },
  work:      { open: false, x: 80,  y: 90,  z: 0  },
  projects:  { open: false, x: 100, y: 110, z: 0  },
  research:  { open: false, x: 120, y: 130, z: 0  },
  skills:    { open: false, x: 140, y: 150, z: 0  },
};

const WIN_WIDTHS: Record<WinId, number> = {
  terminal: 460,
  about:    380,
  work:     720,
  projects: 780,
  research: 700,
  skills:   620,
};

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

interface Props {
  experience: ContentItem<ExperienceFrontmatter>[];
  projects: ContentItem<ProjectFrontmatter>[];
  research: ContentItem<ResearchFrontmatter>[];
}

export default function Desktop({ experience, projects, research }: Props) {
  const [windows, setWindows] = useState<Record<WinId, WinConfig>>(INITIAL);
  const zCounter = useRef(11);

  const focus = useCallback((id: WinId) => {
    setWindows((prev) => ({
      ...prev,
      [id]: { ...prev[id], z: ++zCounter.current },
    }));
  }, []);

  const open = useCallback((id: WinId) => {
    setWindows((prev) => {
      const already = prev[id].open;
      return {
        ...prev,
        [id]: { ...prev[id], open: true, z: ++zCounter.current, x: already ? prev[id].x : INITIAL[id].x, y: already ? prev[id].y : INITIAL[id].y },
      };
    });
  }, []);

  const close = useCallback((id: string) => {
    setWindows((prev) => ({
      ...prev,
      [id as WinId]: { ...prev[id as WinId], open: false, z: 0 },
    }));
  }, []);

  const handleAboutOpen = useCallback(() => {
    open("about");
  }, [open]);

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "100dvh", overflow: "hidden" }}>
      {/* ── Menubar ───────────────────────────────────────── */}
      <header
        style={{
          background: "var(--titlebar)",
          borderBottom: "2px solid var(--border)",
          flexShrink: 0,
        }}
      >
        {/* Top bar */}
        <div style={{ display: "flex", alignItems: "stretch", height: 40 }}>
          {/* Logo */}
          <button
            onClick={() => open("terminal")}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 8,
              padding: "0 16px",
              background: "none",
              borderRight: "1px solid var(--border)",
              cursor: "pointer",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 13,
              fontWeight: 700,
              color: "var(--yellow)",
              letterSpacing: "-0.02em",
            }}
          >
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 4,
                background: "var(--yellow)",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "var(--text-on-yellow)",
                fontSize: 9,
                fontWeight: 900,
                flexShrink: 0,
              }}
            >
              HK
            </span>
            <span>hrishikesh</span>
          </button>

          {/* Nav items */}
          <nav
            style={{
              display: "flex",
              alignItems: "stretch",
              borderRight: "1px solid var(--border)",
            }}
            aria-label="Open windows"
          >
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                onClick={() => open(item.id)}
                style={{
                  display: "flex",
                  alignItems: "center",
                  padding: "0 18px",
                  background: windows[item.id].open ? "rgba(249,189,43,0.1)" : "none",
                  border: "none",
                  borderRight: "1px solid var(--border)",
                  borderBottom: windows[item.id].open ? "2px solid var(--yellow)" : "2px solid transparent",
                  cursor: "pointer",
                  fontSize: 13,
                  color: windows[item.id].open ? "var(--yellow)" : "var(--text-muted)",
                  fontFamily: "var(--font-geist-sans)",
                  transition: "color 0.15s, background 0.15s",
                }}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Right side */}
          <div style={{ display: "flex", alignItems: "stretch", marginLeft: "auto" }}>
            <a
              href="https://github.com/master-senses"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="GitHub"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                borderLeft: "1px solid var(--border)",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              <GithubIcon />
            </a>
            <a
              href="https://linkedin.com/in/hrishikeshkalyanaraman"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 12px",
                borderLeft: "1px solid var(--border)",
                color: "var(--text-muted)",
                textDecoration: "none",
              }}
            >
              <LinkedinIcon />
            </a>
            <a
              href="mailto:hrishikeshkalyanaraman@gmail.com"
              style={{
                display: "flex",
                alignItems: "center",
                padding: "0 16px",
                borderLeft: "2px solid var(--yellow)",
                background: "var(--yellow)",
                color: "var(--text-on-yellow)",
                fontFamily: "var(--font-geist-mono)",
                fontSize: 12,
                fontWeight: 600,
                textDecoration: "none",
              }}
            >
              Get in touch
            </a>
          </div>
        </div>

        {/* Status bar */}
        <div
          style={{
            height: 24,
            display: "flex",
            alignItems: "center",
            paddingInline: 16,
            gap: 8,
            borderTop: "1px solid var(--border-strong, var(--border))",
            background: "rgba(0,0,0,0.2)",
          }}
        >
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: "var(--yellow)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            ●
          </span>
          <span
            style={{
              fontFamily: "var(--font-geist-mono)",
              fontSize: 10,
              color: "var(--text-faint)",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            personal-site
          </span>
          <span style={{ color: "var(--text-faint)", fontFamily: "var(--font-geist-mono)", fontSize: 10 }}>/</span>
          <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>main</span>

          <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                color: "var(--green)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              ● available for work
            </span>
            <span
              style={{
                fontFamily: "var(--font-geist-mono)",
                fontSize: 10,
                color: "var(--text-faint)",
                textTransform: "uppercase",
                letterSpacing: "0.08em",
              }}
            >
              Urbana-Champaign, IL
            </span>
          </div>
        </div>
      </header>

      {/* ── Desktop area ──────────────────────────────────── */}
      <div style={{ position: "relative", flex: 1, overflow: "hidden" }}>
        {/* Terminal */}
        <DraggableWindow
          id="terminal"
          title={WIN_TITLES.terminal}
          initialX={INITIAL.terminal.x}
          initialY={INITIAL.terminal.y}
          width={WIN_WIDTHS.terminal}
          isOpen={windows.terminal.open}
          zIndex={windows.terminal.z}
          onFocus={focus as (id: string) => void}
          onClose={close}
          accentBar
        >
          <Terminal onAboutOpen={handleAboutOpen} />
        </DraggableWindow>

        {/* About */}
        <DraggableWindow
          id="about"
          title={WIN_TITLES.about}
          initialX={INITIAL.about.x}
          initialY={INITIAL.about.y}
          width={WIN_WIDTHS.about}
          isOpen={windows.about.open}
          zIndex={windows.about.z}
          onFocus={focus as (id: string) => void}
          onClose={close}
        >
          <AboutWindow />
        </DraggableWindow>

        {/* Work */}
        <DraggableWindow
          id="work"
          title={WIN_TITLES.work}
          initialX={INITIAL.work.x}
          initialY={INITIAL.work.y}
          width={WIN_WIDTHS.work}
          isOpen={windows.work.open}
          zIndex={windows.work.z}
          onFocus={focus as (id: string) => void}
          onClose={close}
        >
          <WorkWindow experience={experience} />
        </DraggableWindow>

        {/* Projects */}
        <DraggableWindow
          id="projects"
          title={WIN_TITLES.projects}
          initialX={INITIAL.projects.x}
          initialY={INITIAL.projects.y}
          width={WIN_WIDTHS.projects}
          isOpen={windows.projects.open}
          zIndex={windows.projects.z}
          onFocus={focus as (id: string) => void}
          onClose={close}
        >
          <ProjectsWindow projects={projects} />
        </DraggableWindow>

        {/* Research */}
        <DraggableWindow
          id="research"
          title={WIN_TITLES.research}
          initialX={INITIAL.research.x}
          initialY={INITIAL.research.y}
          width={WIN_WIDTHS.research}
          isOpen={windows.research.open}
          zIndex={windows.research.z}
          onFocus={focus as (id: string) => void}
          onClose={close}
        >
          <ResearchWindow research={research} />
        </DraggableWindow>

        {/* Skills */}
        <DraggableWindow
          id="skills"
          title={WIN_TITLES.skills}
          initialX={INITIAL.skills.x}
          initialY={INITIAL.skills.y}
          width={WIN_WIDTHS.skills}
          isOpen={windows.skills.open}
          zIndex={windows.skills.z}
          onFocus={focus as (id: string) => void}
          onClose={close}
        >
          <SkillsWindow />
        </DraggableWindow>

        {/* Empty state hint */}
        {Object.values(windows).filter((w) => w.open).length <= 1 && (
          <div
            style={{
              position: "absolute",
              bottom: 40,
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "var(--font-geist-mono)",
              fontSize: 11,
              color: "var(--text-faint)",
              textAlign: "center",
              pointerEvents: "none",
              textTransform: "uppercase",
              letterSpacing: "0.08em",
            }}
          >
            click Work · Projects · Research · Skills to open windows
          </div>
        )}
      </div>

      {/* ── Dock / status bar ─────────────────────────────── */}
      <footer
        style={{
          background: "var(--titlebar)",
          borderTop: "2px solid var(--border)",
          height: 28,
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          paddingInline: 16,
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)" }}>
          hrishikesh kalyanaraman · personal-site v2.0
        </span>
        <div style={{ display: "flex", gap: 16 }}>
          <a href="mailto:hrishikeshkalyanaraman@gmail.com" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)", textDecoration: "none" }}>
            hrishikeshkalyanaraman@gmail.com
          </a>
          <span style={{ width: 1, background: "var(--border)" }} />
          <a href="https://github.com/master-senses" target="_blank" rel="noopener noreferrer" style={{ fontFamily: "var(--font-geist-mono)", fontSize: 10, color: "var(--text-faint)", textDecoration: "none" }}>
            github/master-senses
          </a>
        </div>
      </footer>
    </div>
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
