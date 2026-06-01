import { ContentItem, ExperienceFrontmatter } from "@/lib/mdx";

export default function ExperienceContent({ item }: { item: ContentItem<ExperienceFrontmatter> }) {
  const bullets = item.content.split("\n\n").map((p) => p.trim()).filter(Boolean);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "14px 20px", background: "var(--titlebar)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="type-subheading" style={{ fontSize: "var(--font-lg)" }}>{item.frontmatter.title}</span>
            {item.frontmatter.current && (
              <span className="type-caption" style={{ color: "var(--yellow)", background: "var(--yellow-dim)", border: "1px solid var(--yellow-border)", borderRadius: 3, padding: "2px 7px", fontWeight: 700 }}>
                current
              </span>
            )}
          </div>
          <div className="type-label" style={{ color: "var(--blue)", marginTop: 4 }}>
            {item.frontmatter.company}
          </div>
        </div>
        <span className="type-body-mono" style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
          {item.frontmatter.period}
        </span>
      </div>

      <ul style={{ margin: 0, padding: "16px 20px 18px", listStyle: "none" }}>
        {bullets.map((b, i) => (
          <li key={i} className="type-body" style={{ display: "flex", gap: 10, marginBottom: i < bullets.length - 1 ? 10 : 0 }}>
            <span style={{ color: "var(--text-secondary)", flexShrink: 0, fontFamily: "var(--font-geist-mono)", marginTop: 3 }}>·</span>
            {b}
          </li>
        ))}
      </ul>

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 20px 16px", borderTop: "1px solid var(--border)" }}>
        {item.frontmatter.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}
