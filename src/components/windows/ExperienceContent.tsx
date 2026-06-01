import { ContentItem, ExperienceFrontmatter } from "@/lib/mdx";

export default function ExperienceContent({ item }: { item: ContentItem<ExperienceFrontmatter> }) {
  const bullets = item.content.split("\n\n").map((p) => p.trim()).filter(Boolean);

  return (
    <div>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "13px 18px", background: "var(--titlebar)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span style={{ fontWeight: 700, fontSize: 16, color: "var(--text)" }}>{item.frontmatter.title}</span>
            {item.frontmatter.current && (
              <span style={{ fontSize: 10, fontFamily: "var(--font-geist-mono)", color: "var(--yellow)", background: "var(--yellow-dim)", border: "1px solid var(--yellow-border)", borderRadius: 3, padding: "2px 6px", textTransform: "uppercase" }}>
                current
              </span>
            )}
          </div>
          <div style={{ fontSize: 14, fontFamily: "var(--font-geist-mono)", color: "var(--yellow)", marginTop: 3 }}>
            {item.frontmatter.company}
          </div>
        </div>
        <span style={{ fontSize: 13, fontFamily: "var(--font-geist-mono)", color: "var(--text)", whiteSpace: "nowrap" }}>
          {item.frontmatter.period}
        </span>
      </div>

      {/* Bullets */}
      <ul style={{ margin: 0, padding: "14px 18px 16px", listStyle: "none" }}>
        {bullets.map((b, i) => (
          <li key={i} style={{ display: "flex", gap: 10, fontSize: 15, color: "var(--text)", lineHeight: 1.7, marginBottom: i < bullets.length - 1 ? 8 : 0 }}>
            <span style={{ color: "var(--text-muted)", flexShrink: 0, fontFamily: "var(--font-geist-mono)", marginTop: 2 }}>·</span>
            {b}
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 18px 14px", borderTop: "1px solid var(--border)" }}>
        {item.frontmatter.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}
