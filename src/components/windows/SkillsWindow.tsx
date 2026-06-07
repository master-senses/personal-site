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
    <div className="json-window type-body-mono" style={{ padding: "16px" }}>
      <div style={{ marginBottom: 8 }}>{"{"}</div>
      <div style={{ paddingLeft: 16 }}>
        {GROUPS.map((g, gi) => (
          <div key={g.label} style={{ display: "flex", flexWrap: "wrap", gap: 4, alignItems: "baseline", marginBottom: gi < GROUPS.length - 1 ? 12 : 0 }}>
            <span className="type-label" style={{ color: "var(--yellow)", fontSize: "var(--font-base)" }}>&quot;{g.label}&quot;</span>
            <span>: [</span>
            {g.skills.map((s, si) => (
              <span key={s}>
                <span style={{ fontWeight: 500 }}>&quot;{s}&quot;</span>
                {si < g.skills.length - 1 && <span>, </span>}
              </span>
            ))}
            <span>]</span>
            {gi < GROUPS.length - 1 && <span>,</span>}
          </div>
        ))}
      </div>
      <div style={{ marginTop: 8 }}>{"}"}</div>

      <div style={{ marginTop: 24, paddingTop: 16, borderTop: "1px solid var(--border)" }}>
        <div className="type-caption" style={{ textTransform: "uppercase", color: "var(--text)", marginBottom: 8, fontWeight: 600 }}>
          education
        </div>
        <div className="type-body" style={{ fontSize: "var(--font-lg)", fontWeight: 500, lineHeight: "var(--leading-snug)" }}>University of Illinois at Urbana-Champaign</div>
        <div className="type-label" style={{ color: "var(--blue)", marginTop: 6, fontSize: "var(--font-base)" }}>B.S. Computer Science</div>
      </div>
    </div>
  );
}
