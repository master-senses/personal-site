import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";

const TYPE_COLOR: Record<string, string> = {
  Startup: "var(--red)",
  "Personal Project": "var(--text-muted)",
};

export default function ProjectContent({ item }: { item: ContentItem<ProjectFrontmatter> }) {
  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "13px 18px", background: "var(--titlebar)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{item.frontmatter.title}</div>
          <div style={{ fontSize: 12, fontFamily: "var(--font-geist-mono)", color: TYPE_COLOR[item.frontmatter.type] ?? "var(--text)", textTransform: "uppercase", letterSpacing: "0.06em", marginTop: 3 }}>
            {item.frontmatter.type}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: 6 }}>
          <span style={{ fontSize: 13, fontFamily: "var(--font-geist-mono)", color: "var(--text)", whiteSpace: "nowrap" }}>{item.frontmatter.period}</span>
          {item.frontmatter.url && (
            <a href={item.frontmatter.url} target="_blank" rel="noopener noreferrer" style={{ fontSize: 13, fontFamily: "var(--font-geist-mono)", color: "var(--yellow)", textDecoration: "none", display: "flex", alignItems: "center", gap: 4 }}>
              <PlayIcon /> demo
            </a>
          )}
        </div>
      </div>

      {/* Description */}
      <p style={{ margin: 0, padding: "16px 18px", fontSize: 15, color: "var(--text)", lineHeight: 1.75 }}>
        {item.content}
      </p>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 18px 14px", borderTop: "1px solid var(--border)" }}>
        {item.frontmatter.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
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
