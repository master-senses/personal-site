"use client";

import { useState } from "react";
import AboutWindow from "@/components/windows/AboutWindow";
import SkillsWindow from "@/components/windows/SkillsWindow";
import ExperienceContent from "@/components/windows/ExperienceContent";
import ProjectContentMobile from "@/components/windows/ProjectContentMobile";
import ResearchContent from "@/components/windows/ResearchContent";
import {
  ContentItem,
  ExperienceFrontmatter,
  ProjectFrontmatter,
  ResearchFrontmatter,
} from "@/lib/mdx";
import { GithubIcon } from "@/components/icons/GithubIcon";
import { LinkedinIcon } from "@/components/icons/LinkedinIcon";
import { XIcon } from "@/components/icons/XIcon";
import { CONTACT_MAILTO, RESUME_URL } from "@/lib/contact";
import "./mobile-layout.css";

interface Props {
  experience: ContentItem<ExperienceFrontmatter>[];
  projects: ContentItem<ProjectFrontmatter>[];
  research: ContentItem<ResearchFrontmatter>[];
}

type OpenApp =
  | { kind: "about" }
  | { kind: "skills" }
  | { kind: "experience"; slug: string; title: string }
  | { kind: "project"; slug: string; title: string }
  | { kind: "research"; slug: string; title: string };

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

function TxtFileIcon() {
  return (
    <svg className="mobile-app-icon-graphic" viewBox="0 0 52 64" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="37" height="49" rx="2" fill="var(--bg-window)" stroke="var(--yellow)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L39 13" stroke="var(--yellow)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L27 13 L39 13" fill="rgba(249,189,43,0.15)" stroke="var(--yellow)" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="7" y1="22" x2="32" y2="22" stroke="var(--text-dim)" strokeWidth="1.5" />
      <line x1="7" y1="28" x2="32" y2="28" stroke="var(--text-dim)" strokeWidth="1.5" />
      <line x1="7" y1="34" x2="23" y2="34" stroke="var(--text-dim)" strokeWidth="1.5" />
      <rect x="0" y="42" width="52" height="22" rx="3" fill="var(--yellow)" />
      <text x="26" y="58" fontFamily="monospace" fontSize="13" fontWeight="800" fill="var(--text-on-yellow)" textAnchor="middle">TXT</text>
    </svg>
  );
}

function JsonFileIcon() {
  return (
    <svg className="mobile-app-icon-graphic" viewBox="0 0 52 64" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="37" height="49" rx="2" fill="var(--bg-window)" stroke="var(--blue)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L39 13" stroke="var(--blue)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L27 13 L39 13" fill="rgba(74,158,255,0.12)" stroke="var(--blue)" strokeOpacity="0.6" strokeWidth="1" />
      <text x="8" y="28" fontFamily="monospace" fontSize="9" fill="var(--text-dim)">{"{"}</text>
      <text x="12" y="38" fontFamily="monospace" fontSize="8" fill="var(--text-dim)">...</text>
      <rect x="0" y="42" width="52" height="22" rx="3" fill="var(--blue)" />
      <text x="26" y="58" fontFamily="monospace" fontSize="11" fontWeight="800" fill="var(--text-on-yellow)" textAnchor="middle">JSON</text>
    </svg>
  );
}

function AppIcon({
  label,
  onClick,
  children,
}: {
  label: string;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button type="button" className="mobile-app-icon" onClick={onClick}>
      {children}
      <span className="mobile-app-icon-label">{label}</span>
    </button>
  );
}

function AppWindow({
  title,
  onClose,
  children,
}: {
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="mobile-app-window" role="dialog" aria-modal="true" aria-label={title}>
      <div className="mobile-app-window-titlebar">
        <span className="mobile-app-window-title">{title}</span>
        <button
          type="button"
          className="window-close"
          aria-label="Close window"
          onClick={onClose}
        >
          ×
        </button>
      </div>
      <div className="mobile-app-window-body window-content">{children}</div>
    </div>
  );
}

export default function MobileLayout({
  experience,
  projects,
  research,
}: Props) {
  const [openApp, setOpenApp] = useState<OpenApp | null>(null);

  let appContent: React.ReactNode = null;
  if (openApp?.kind === "about") {
    appContent = <AboutWindow />;
  } else if (openApp?.kind === "skills") {
    appContent = <SkillsWindow />;
  } else if (openApp?.kind === "experience") {
    const item = experience.find((e) => e.slug === openApp.slug);
    if (item) appContent = <ExperienceContent item={item} />;
  } else if (openApp?.kind === "project") {
    const item = projects.find((p) => p.slug === openApp.slug);
    if (item) appContent = <ProjectContentMobile item={item} />;
  } else if (openApp?.kind === "research") {
    const item = research.find((r) => r.slug === openApp.slug);
    if (item) appContent = <ResearchContent item={item} />;
  }

  const appTitle =
    openApp?.kind === "about"
      ? "about.txt"
      : openApp?.kind === "skills"
        ? "skills.json"
        : openApp?.title ?? "";

  return (
    <div className="mobile-layout-root" data-app-open={openApp ? "true" : "false"}>
      <header className="mobile-menubar">
        <button type="button" className="mobile-logo-btn" onClick={() => setOpenApp(null)}>
          <span className="mobile-logo-mark">HK</span>
        </button>
        <a
          href={RESUME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mobile-menubar-nav-link mobile-menubar-resume-link"
        >
          Resume
        </a>
        <div className="mobile-menubar-actions">
          <a
            href="https://github.com/master-senses"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="mobile-menubar-icon-link"
          >
            <GithubIcon />
          </a>
          <a
            href="https://www.linkedin.com/in/hk39/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="LinkedIn"
            className="mobile-menubar-icon-link"
          >
            <LinkedinIcon />
          </a>
          <a
            href="https://x.com/thereal_hk"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="mobile-menubar-icon-link"
          >
            <XIcon />
          </a>
          <a href={CONTACT_MAILTO} className="mobile-menubar-cta">
            Get in touch
          </a>
        </div>
      </header>

      {!openApp ? (
        <main className="mobile-home">
          <div className="mobile-app-icon-grid">
            <AppIcon label="about.txt" onClick={() => setOpenApp({ kind: "about" })}>
              <TxtFileIcon />
            </AppIcon>
            <AppIcon label="skills.json" onClick={() => setOpenApp({ kind: "skills" })}>
              <JsonFileIcon />
            </AppIcon>
          </div>

          <div className="mobile-app-folder">
            <div className="mobile-app-folder-label">work/</div>
            <div className="mobile-app-icon-grid">
              {experience.map((item) => {
                const title = expFilename(item.slug, item.frontmatter.company);
                return (
                  <AppIcon
                    key={item.slug}
                    label={title}
                    onClick={() => setOpenApp({ kind: "experience", slug: item.slug, title })}
                  >
                    <TxtFileIcon />
                  </AppIcon>
                );
              })}
            </div>
          </div>

          <div className="mobile-app-folder">
            <div className="mobile-app-folder-label">projects/</div>
            <div className="mobile-app-icon-grid">
              {projects.map((item) => {
                const title = `${item.slug}.txt`;
                return (
                  <AppIcon
                    key={item.slug}
                    label={title}
                    onClick={() => setOpenApp({ kind: "project", slug: item.slug, title })}
                  >
                    <TxtFileIcon />
                  </AppIcon>
                );
              })}
            </div>
          </div>

          <div className="mobile-app-folder">
            <div className="mobile-app-folder-label">research/</div>
            <div className="mobile-app-icon-grid">
              {research.map((item) => {
                const title = `${item.slug}.txt`;
                return (
                  <AppIcon
                    key={item.slug}
                    label={title}
                    onClick={() => setOpenApp({ kind: "research", slug: item.slug, title })}
                  >
                    <TxtFileIcon />
                  </AppIcon>
                );
              })}
            </div>
          </div>
        </main>
      ) : (
        <AppWindow title={appTitle} onClose={() => setOpenApp(null)}>
          {appContent}
        </AppWindow>
      )}
    </div>
  );
}
