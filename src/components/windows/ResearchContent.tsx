import { ContentItem, ResearchFrontmatter } from "@/lib/mdx";

export default function ResearchContent({ item }: { item: ContentItem<ResearchFrontmatter> }) {
  const bullets = item.content.split("\n\n").map((p) => p.trim()).filter(Boolean);

  return (
    <div className="txt-window">
      <div style={{ display: "flex", flexDirection: "column", gap: 8, padding: "12px 16px", background: "var(--titlebar)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div className="type-subheading">{item.frontmatter.title}</div>
          <div className="type-label" style={{ color: "var(--red)", marginTop: 4 }}>{item.frontmatter.company}</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <span className="type-label" style={{ color: "var(--text)" }}>{item.frontmatter.period}</span>
          {item.frontmatter.url && (
            <a href={item.frontmatter.url} target="_blank" rel="noopener noreferrer" className="type-label" style={{ color: "var(--blue)", textDecoration: "underline", textUnderlineOffset: 2, flexShrink: 0 }}>
              paper ↗
            </a>
          )}
        </div>
      </div>

      <ul style={{ margin: 0, padding: "12px 16px", listStyle: "none", display: "flex", flexDirection: "column", gap: 12 }}>
        {bullets.map((b, i) => (
          <li key={i} className="type-body" style={{ display: "flex", gap: 12 }}>
            <span style={{ color: "var(--yellow)", flexShrink: 0, marginTop: 2, fontWeight: 700 }}>·</span>
            <span style={{ minWidth: 0 }}>{b}</span>
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        {item.frontmatter.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}
