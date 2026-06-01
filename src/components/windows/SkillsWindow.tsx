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
      fontSize: 14,
      padding: "18px 22px",
      lineHeight: 1.8,
      }}
    >
      <div style={{ color: "var(--text-muted)", marginBottom: 6 }}>{"{"}</div>
      <div style={{ paddingLeft: 16 }}>
        {GROUPS.map((g, gi) => (
          <div key={g.label} style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "baseline", marginBottom: gi < GROUPS.length - 1 ? 6 : 0 }}>
            <span style={{ color: "var(--yellow)", opacity: 0.9 }}>&quot;{g.label}&quot;</span>
            <span style={{ color: "var(--text-muted)" }}>: [</span>
            {g.skills.map((s, si) => (
              <span key={s}>
                <span style={{ color: "var(--text)" }}>&quot;{s}&quot;</span>
                {si < g.skills.length - 1 && (
                  <span style={{ color: "var(--text-muted)" }}>,</span>
                )}
              </span>
            ))}
            <span style={{ color: "var(--text-muted)" }}>]</span>
            {gi < GROUPS.length - 1 && <span style={{ color: "var(--text-muted)" }}>,</span>}
          </div>
        ))}
      </div>
      <div style={{ color: "var(--text-muted)", marginTop: 6 }}>{"}"}</div>

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
        fontSize: 12,
          textTransform: "uppercase",
          letterSpacing: "0.08em",
          color: "var(--text-faint)",
          marginBottom: 8,
          }}
        >
          education
        </div>
        <div style={{ fontSize: 15, color: "var(--text)" }}>
          University of Illinois at Urbana-Champaign
        </div>
        <div style={{ color: "var(--yellow)", marginTop: 4 }}>
          B.S. Computer Science
        </div>
      </div>
    </div>
  );
}
