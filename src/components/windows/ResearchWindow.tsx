import { ContentItem, ResearchFrontmatter } from "@/lib/mdx";

interface Props {
  research: ContentItem<ResearchFrontmatter>[];
}

export default function ResearchWindow({ research }: Props) {
  return (
    <div>
      {research.map((item, i) => {
        const bullets = item.content
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean);

        return (
          <div
            key={item.slug}
            style={{
              borderBottom: i < research.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                gap: 12,
                padding: "12px 18px",
                background: "var(--titlebar)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ fontWeight: 600, fontSize: 15, color: "var(--text)" }}>
                  {item.frontmatter.title}
                </div>
                <div
                  style={{
                    fontSize: 13,
                    fontFamily: "var(--font-geist-mono)",
                    color: "var(--yellow)",
                    marginTop: 3,
                  }}
                >
                  {item.frontmatter.company}
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
                <span
                  style={{
                    fontSize: 12,
                    fontFamily: "var(--font-geist-mono)",
                    color: "var(--text-faint)",
                    whiteSpace: "nowrap",
                  }}
                >
                  {item.frontmatter.period}
                </span>
                {item.frontmatter.url && (
                  <a
                    href={item.frontmatter.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      fontSize: 10,
                      fontFamily: "var(--font-geist-mono)",
                      color: "var(--text-muted)",
                      textDecoration: "underline",
                      textUnderlineOffset: 2,
                    }}
                  >
                    paper ↗
                  </a>
                )}
              </div>
            </div>

            <ul style={{ margin: 0, padding: "12px 18px 14px", listStyle: "none" }}>
              {bullets.map((b, bi) => (
                <li
                  key={bi}
                  style={{
                    display: "flex",
                    gap: 10,
                    fontSize: 14,
                    color: "var(--text)",
                    lineHeight: 1.7,
                    marginBottom: bi < bullets.length - 1 ? 6 : 0,
                  }}
                >
                  <span style={{ color: "var(--text-muted)", flexShrink: 0, fontFamily: "var(--font-geist-mono)" }}>
                    ·
                  </span>
                  {b}
                </li>
              ))}
            </ul>

            <div style={{ display: "flex", flexWrap: "wrap", gap: 5, padding: "8px 16px 12px", borderTop: "1px solid var(--border)" }}>
              {item.frontmatter.tags.map((t) => (
                <span key={t} className="tag">{t}</span>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
