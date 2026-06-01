const GROUPS = [
  { label: "Languages",     skills: ["Python", "TypeScript", "Shell"] },
  { label: "Frontend",      skills: ["React", "Next.js", "Tailwind CSS"] },
  { label: "Backend",       skills: ["Node.js", "FastAPI", "Flask", "REST APIs"] },
  { label: "Infra & Tools", skills: ["Linux", "Docker", "AWS", "MongoDB", "PostgreSQL"] },
  { label: "AI Tooling",    skills: ["LangChain", "FastMCP", "Claude Code", "Cursor", "ComfyUI", "Databricks"] },
  { label: "Certs",         skills: ["AWS Cloud Practitioner", "AWS AI Practitioner"] },
];

export default function SkillsWindow() {
  return (
    <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 15, padding: "20px 24px", lineHeight: 1.85 }}>
      <div style={{ color: "var(--text-secondary)", marginBottom: 6 }}>{"{"}</div>
      <div style={{ paddingLeft: 18 }}>
        {GROUPS.map((g, gi) => (
          <div key={g.label} style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "baseline", marginBottom: gi < GROUPS.length - 1 ? 8 : 0 }}>
            <span style={{ color: "var(--yellow)", opacity: 0.9 }}>&quot;{g.label}&quot;</span>
            <span style={{ color: "var(--text-secondary)" }}>: [</span>
            {g.skills.map((s, si) => (
              <span key={s}>
                <span style={{ color: "var(--text)" }}>&quot;{s}&quot;</span>
                {si < g.skills.length - 1 && <span style={{ color: "var(--text-secondary)" }}>, </span>}
              </span>
            ))}
            <span style={{ color: "var(--text-secondary)" }}>]</span>
            {gi < GROUPS.length - 1 && <span style={{ color: "var(--text-secondary)" }}>,</span>}
          </div>
        ))}
      </div>
      <div style={{ color: "var(--text-secondary)", marginTop: 6 }}>{"}"}</div>

      <div style={{ marginTop: 20, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <div style={{ fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text)", marginBottom: 8 }}>
          education
        </div>
        <div style={{ fontSize: 16, color: "var(--text)" }}>University of Illinois at Urbana-Champaign</div>
        <div style={{ fontSize: 15, color: "var(--blue)", fontWeight: 600, marginTop: 4 }}>B.S. Computer Science</div>
      </div>
    </div>
  );
}
