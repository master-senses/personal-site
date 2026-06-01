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
    <div className="type-body-mono" style={{ padding: "22px 26px" }}>
      <div style={{ color: "var(--text-secondary)", marginBottom: 8 }}>{"{"}</div>
      <div style={{ paddingLeft: 20 }}>
        {GROUPS.map((g, gi) => (
          <div key={g.label} style={{ display: "flex", flexWrap: "wrap", gap: 5, alignItems: "baseline", marginBottom: gi < GROUPS.length - 1 ? 10 : 0 }}>
            <span className="type-label" style={{ color: "var(--yellow)", fontSize: "var(--font-base)" }}>&quot;{g.label}&quot;</span>
            <span style={{ color: "var(--text-secondary)" }}>: [</span>
            {g.skills.map((s, si) => (
              <span key={s}>
                <span style={{ color: "var(--text)", fontWeight: 500 }}>&quot;{s}&quot;</span>
                {si < g.skills.length - 1 && <span style={{ color: "var(--text-secondary)" }}>, </span>}
              </span>
            ))}
            <span style={{ color: "var(--text-secondary)" }}>]</span>
            {gi < GROUPS.length - 1 && <span style={{ color: "var(--text-secondary)" }}>,</span>}
          </div>
        ))}
      </div>
      <div style={{ color: "var(--text-secondary)", marginTop: 8 }}>{"}"}</div>

      <div style={{ marginTop: 22, paddingTop: 18, borderTop: "1px solid var(--border)" }}>
        <div className="type-caption" style={{ textTransform: "uppercase", color: "var(--text)", marginBottom: 10, fontWeight: 600 }}>
          education
        </div>
        <div className="type-body" style={{ fontSize: "var(--font-lg)", fontWeight: 500 }}>University of Illinois at Urbana-Champaign</div>
        <div className="type-label" style={{ color: "var(--blue)", marginTop: 6, fontSize: "var(--font-base)" }}>B.S. Computer Science</div>
      </div>
    </div>
  );
}
