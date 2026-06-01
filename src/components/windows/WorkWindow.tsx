import { ContentItem, ExperienceFrontmatter } from "@/lib/mdx";

interface Props {
  experience: ContentItem<ExperienceFrontmatter>[];
}

export default function WorkWindow({ experience }: Props) {
  const sorted = [...experience].sort((a, b) => {
    if (a.frontmatter.current) return -1;
    if (b.frontmatter.current) return 1;
    return 0;
  });

  return (
    <div style={{ fontFamily: "var(--font-geist-sans), sans-serif" }}>
      {sorted.map((item, i) => {
        const bullets = item.content
          .split("\n\n")
          .map((p) => p.trim())
          .filter(Boolean);

        return (
          <div
            key={item.slug}
            style={{
              borderBottom: i < sorted.length - 1 ? "1px solid var(--border)" : "none",
            }}
          >
            {/* Row header */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 12,
                padding: "12px 18px",
                background: "var(--titlebar)",
                borderBottom: "1px solid var(--border)",
              }}
            >
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontWeight: 700, fontSize: 15, color: "var(--text)" }}>
                    {item.frontmatter.title}
                  </span>
                  {item.frontmatter.current && (
                    <span
                      style={{
                        fontSize: 9,
                        fontFamily: "var(--font-geist-mono)",
                        color: "var(--yellow)",
                        background: "var(--yellow-dim)",
                        border: "1px solid var(--yellow-border)",
                        borderRadius: 3,
                        padding: "1px 5px",
                        letterSpacing: "0.04em",
                        textTransform: "uppercase",
                      }}
                    >
                      current
                    </span>
                  )}
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
            </div>

            {/* Bullets */}
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

            {/* Tags */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 6,
                padding: "10px 18px 14px",
                borderTop: "1px solid var(--border-subtle, var(--border))",
              }}
            >
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
