import Window from "./Window";

const SKILL_GROUPS = [
  {
    label: "Languages",
    skills: ["Python", "TypeScript", "Shell"],
  },
  {
    label: "Frontend",
    skills: ["React", "Next.js", "Tailwind CSS"],
  },
  {
    label: "Backend",
    skills: ["Node.js", "FastAPI", "Flask", "REST APIs"],
  },
  {
    label: "Infra & Tools",
    skills: ["Linux", "Docker", "AWS", "MongoDB", "PostgreSQL"],
  },
  {
    label: "AI Tooling",
    skills: ["LangChain", "FastMCP", "Claude Code", "Cursor", "ComfyUI", "Databricks"],
  },
  {
    label: "Certifications",
    skills: ["AWS Cloud Practitioner", "AWS AI Practitioner"],
  },
];

const EDUCATION = {
  school: "University of Illinois at Urbana-Champaign",
  degree: "B.S. Computer Science",
};

export default function SkillsSection() {
  return (
    <div className="grid md:grid-cols-3 gap-6 mt-8">
      {/* Skills window */}
      <div className="md:col-span-2">
        <Window title="skills.json">
          <div
            className="p-5 font-mono text-xs"
            style={{ color: "var(--text-muted)" }}
          >
            <span style={{ color: "var(--border-strong)" }}>{"{"}</span>
            <div className="pl-4 space-y-2 py-2">
              {SKILL_GROUPS.map((group) => (
                <div key={group.label} className="flex gap-2 flex-wrap">
                  <span style={{ color: "var(--yellow)" }}>
                    &quot;{group.label}&quot;
                  </span>
                  <span style={{ color: "var(--border-strong)" }}>:</span>
                  <span style={{ color: "var(--border-strong)" }}>[</span>
                  <span className="flex flex-wrap gap-1">
                    {group.skills.map((s, i) => (
                      <span key={s}>
                        <span style={{ color: "var(--green)" }}>
                          &quot;{s}&quot;
                        </span>
                        {i < group.skills.length - 1 && (
                          <span style={{ color: "var(--text-faint)" }}>,</span>
                        )}
                      </span>
                    ))}
                  </span>
                  <span style={{ color: "var(--border-strong)" }}>]</span>
                </div>
              ))}
            </div>
            <span style={{ color: "var(--border-strong)" }}>{"}"}</span>
          </div>
        </Window>
      </div>

      {/* Education + contact */}
      <div className="flex flex-col gap-6">
        <Window title="education.txt">
          <div className="p-5 space-y-3">
            <div>
              <p
                className="font-mono text-xs uppercase tracking-widest mb-1"
                style={{ color: "var(--text-faint)" }}
              >
                school
              </p>
              <p className="text-sm" style={{ color: "var(--text)" }}>
                {EDUCATION.school}
              </p>
            </div>
            <div
              style={{ height: 1, background: "var(--border)" }}
            />
            <div>
              <p
                className="font-mono text-xs uppercase tracking-widest mb-1"
                style={{ color: "var(--text-faint)" }}
              >
                degree
              </p>
              <p className="text-sm" style={{ color: "var(--yellow)" }}>
                {EDUCATION.degree}
              </p>
            </div>
          </div>
        </Window>

        <Window title="contact.txt" accentBar>
          <div className="p-5 space-y-2">
            {[
              { label: "email", value: "hrishikeshkalyanaraman@gmail.com", href: "mailto:hrishikeshkalyanaraman@gmail.com" },
              { label: "github", value: "master-senses", href: "https://github.com/master-senses" },
              { label: "linkedin", value: "hrishikeshkalyanaraman", href: "https://linkedin.com/in/hrishikeshkalyanaraman" },
              { label: "phone", value: "217-200-2548", href: "tel:2172002548" },
            ].map((item) => (
              <div key={item.label}>
                <p
                  className="font-mono"
                  style={{ fontSize: 10, color: "var(--text-faint)", textTransform: "uppercase", letterSpacing: "0.08em" }}
                >
                  {item.label}
                </p>
                <a
                  href={item.href}
                  target={item.href.startsWith("http") ? "_blank" : undefined}
                  rel={item.href.startsWith("http") ? "noopener noreferrer" : undefined}
                  className="font-mono transition-colors"
                  style={{ fontSize: 11, color: "var(--text-muted)" }}
                >
                  {item.value}
                </a>
              </div>
            ))}
          </div>
        </Window>
      </div>
    </div>
  );
}
