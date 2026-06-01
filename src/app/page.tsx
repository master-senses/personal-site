import { getExperience, getProjects, getResearch } from "@/lib/mdx";
import Window from "@/components/Window";
import Terminal from "@/components/Terminal";
import ExperienceCard from "@/components/ExperienceCard";
import ProjectCard from "@/components/ProjectCard";
import ResearchCard from "@/components/ResearchCard";
import SkillsSection from "@/components/SkillsSection";

export default function Home() {
  const experience = getExperience();
  const projects = getProjects();
  const research = getResearch();

  const sortedExperience = [...experience].sort((a, b) => {
    if (a.frontmatter.current) return -1;
    if (b.frontmatter.current) return 1;
    return 0;
  });

  return (
    <div
      style={{
        maxWidth: 1100,
        margin: "0 auto",
        padding: "40px 24px 80px",
      }}
    >
      {/* ── Hero row ─────────────────────────────────────── */}
      <div className="grid lg:grid-cols-5 gap-6 mb-8">
        {/* Terminal window */}
        <div className="lg:col-span-3">
          <Window title="terminal — bash" accentBar>
            <Terminal />
          </Window>
        </div>

        {/* Identity panel */}
        <div className="lg:col-span-2 flex flex-col gap-6">
          {/* Name card */}
          <Window title="about.txt">
            <div
              className="stripe-yellow p-5 flex flex-col gap-2"
              style={{ borderBottom: "2px solid var(--border)" }}
            >
              <h1
                className="font-bold leading-none"
                style={{ fontSize: 28, color: "var(--text)", letterSpacing: "-0.03em" }}
              >
                Hrishikesh
                <br />
                <span style={{ color: "var(--yellow)" }}>Kalyanaraman</span>
              </h1>
              <p
                className="font-mono"
                style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}
              >
                Software Engineer
              </p>
            </div>
            <p
              className="text-sm leading-relaxed px-5 py-4"
              style={{ color: "var(--text-muted)" }}
            >
              Building AI tooling, design systems, and things that ship.
              Prototyped the MCP server now adopted as official internal
              tooling at Eli Lilly.
            </p>
          </Window>

          {/* Stats grid */}
          <Window title="stats.json">
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: 0,
              }}
            >
              {[
                { n: "4", label: "companies" },
                { n: "2", label: "AWS certs" },
                { n: "80%", label: "workload reduction" },
                { n: "3K+", label: "chatbot users" },
              ].map((s, i) => (
                <div
                  key={s.label}
                  className="p-4 flex flex-col"
                  style={{
                    borderRight: i % 2 === 0 ? "1px solid var(--border)" : "none",
                    borderBottom: i < 2 ? "1px solid var(--border)" : "none",
                  }}
                >
                  <span
                    className="font-bold font-mono"
                    style={{ fontSize: 22, color: "var(--yellow)", lineHeight: 1 }}
                  >
                    {s.n}
                  </span>
                  <span
                    className="font-mono mt-1"
                    style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}
                  >
                    {s.label}
                  </span>
                </div>
              ))}
            </div>
          </Window>
        </div>
      </div>

      {/* ── Work Experience ───────────────────────────────── */}
      <section id="work" style={{ scrollMarginTop: 80, marginBottom: 40 }}>
        <SectionLabel num="01" title="Work Experience" />
        <div className="flex flex-col gap-6 mt-4">
          {sortedExperience.map((item) => (
            <ExperienceCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* ── Projects ─────────────────────────────────────── */}
      <section id="projects" style={{ scrollMarginTop: 80, marginBottom: 40 }}>
        <SectionLabel num="02" title="Projects" />
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-4">
          {projects.map((item) => (
            <ProjectCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* ── Research ─────────────────────────────────────── */}
      <section id="research" style={{ scrollMarginTop: 80, marginBottom: 40 }}>
        <SectionLabel num="03" title="Research" />
        <div className="flex flex-col gap-6 mt-4">
          {research.map((item) => (
            <ResearchCard key={item.slug} item={item} />
          ))}
        </div>
      </section>

      {/* ── Skills ───────────────────────────────────────── */}
      <section id="skills" style={{ scrollMarginTop: 80 }}>
        <SectionLabel num="04" title="Skills & Education" />
        <SkillsSection />
      </section>
    </div>
  );
}

function SectionLabel({ num, title }: { num: string; title: string }) {
  return (
    <div className="flex items-center gap-3 mb-2">
      <span
        className="font-mono"
        style={{
          fontSize: 10,
          color: "var(--yellow)",
          background: "var(--yellow-dim)",
          border: "1px solid var(--yellow-border)",
          borderRadius: 3,
          padding: "2px 6px",
          letterSpacing: "0.04em",
        }}
      >
        {num}
      </span>
      <h2
        className="font-bold"
        style={{ fontSize: 18, letterSpacing: "-0.02em" }}
      >
        {title}
      </h2>
      <div
        style={{
          flex: 1,
          height: 1,
          background: "var(--border)",
          marginLeft: 8,
        }}
      />
    </div>
  );
}
