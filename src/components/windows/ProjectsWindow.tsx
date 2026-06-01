import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";

interface Props {
  projects: ContentItem<ProjectFrontmatter>[];
}

const TYPE_COLOR: Record<string, string> = {
  Startup: "var(--red)",
  "Personal Project": "var(--text-faint)",
};

export default function ProjectsWindow({ projects }: Props) {
  return (
    <div
      style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))",
        gap: 0,
      }}
    >
      {projects.map((item, i) => (
        <div
          key={item.slug}
          style={{
            padding: "14px 16px",
            borderRight: (i + 1) % 3 !== 0 ? "1px solid var(--border)" : "none",
            borderBottom: i < projects.length - Math.ceil(projects.length / 3)
              ? "1px solid var(--border)"
              : "none",
            display: "flex",
            flexDirection: "column",
            gap: 8,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 13, color: "var(--text)" }}>
                {item.frontmatter.title}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "var(--font-geist-mono)",
                  color: TYPE_COLOR[item.frontmatter.type] ?? "var(--text-faint)",
                  textTransform: "uppercase",
                  letterSpacing: "0.06em",
                  marginTop: 2,
                }}
              >
                {item.frontmatter.type}
              </div>
            </div>
            {item.frontmatter.url && (
              <a
                href={item.frontmatter.url}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Watch ${item.frontmatter.title} demo`}
                style={{
                  color: "var(--yellow)",
                  display: "flex",
                  alignItems: "center",
                  gap: 3,
                  fontSize: 11,
                  fontFamily: "var(--font-geist-mono)",
                  textDecoration: "none",
                  flexShrink: 0,
                }}
              >
                <PlayIcon />
                demo
              </a>
            )}
          </div>

          <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.6, margin: 0, flex: 1 }}>
            {item.content}
          </p>

          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {item.frontmatter.tags.map((t) => (
              <span key={t} className="tag">{t}</span>
            ))}
          </div>

          <div
            style={{
              fontSize: 10,
              fontFamily: "var(--font-geist-mono)",
              color: "var(--text-faint)",
            }}
          >
            {item.frontmatter.period}
          </div>
        </div>
      ))}
    </div>
  );
}

function PlayIcon() {
  return (
    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
