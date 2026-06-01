const GROUPS = [
  { label: "Languages", skills: ["Python", "TypeScript", "Shell"] },
  { label: "Frontend", skills: ["React", "Next.js", "Tailwind CSS"] },
  { label: "Backend", skills: ["Node.js", "FastAPI", "Flask", "REST APIs"] },
  { label: "Infra & Tools", skills: ["Linux", "Docker", "AWS", "MongoDB", "PostgreSQL"] },
  { label: "AI Tooling", skills: ["LangChain", "FastMCP", "Claude Code", "Cursor", "ComfyUI", "Databricks"] },
  { label: "Certifications", skills: ["AWS Cloud Practitioner", "AWS AI Practitioner"] },
];

export default function SkillsWindow() {
  return (
    <div
      style={{
        fontFamily: "var(--font-geist-mono), monospace",
        fontSize: 12,
        padding: "14px 18px",
        lineHeight: 1.7,
      }}
    >
      <div style={{ color: "var(--border-strong)", marginBottom: 6 }}>{"{"}</div>
      <div style={{ paddingLeft: 16 }}>
        {GROUPS.map((g, gi) => (
          <div key={g.label} style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "baseline", marginBottom: gi < GROUPS.length - 1 ? 4 : 0 }}>
            <span style={{ color: "var(--yellow)" }}>&quot;{g.label}&quot;</span>
            <span style={{ color: "var(--text-faint)" }}>: [</span>
            {g.skills.map((s, si) => (
              <span key={s}>
                <span style={{ color: "var(--green)" }}>&quot;{s}&quot;</span>
                {si < g.skills.length - 1 && (
                  <span style={{ color: "var(--text-faint)" }}>,</span>
                )}
              </span>
            ))}
            <span style={{ color: "var(--text-faint)" }}>]</span>
            {gi < GROUPS.length - 1 && <span style={{ color: "var(--text-faint)" }}>,</span>}
          </div>
        ))}
      </div>
      <div style={{ color: "var(--border-strong)", marginTop: 6 }}>{"}"}</div>

      {/* Education */}
      <div
        style={{
          marginTop: 16,
          paddingTop: 14,
          borderTop: "1px solid var(--border)",
        }}
      >
        <div
          style={{
            fontSize: 10,
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            color: "var(--text-faint)",
            marginBottom: 6,
          }}
        >
          education
        </div>
        <div style={{ color: "var(--text-muted)" }}>
          University of Illinois at Urbana-Champaign
        </div>
        <div style={{ color: "var(--yellow)", marginTop: 2 }}>
          B.S. Computer Science
        </div>
      </div>
    </div>
  );
}
