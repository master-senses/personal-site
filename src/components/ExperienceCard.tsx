import { ContentItem, ExperienceFrontmatter } from "@/lib/mdx";
import Window from "./Window";

interface Props {
  item: ContentItem<ExperienceFrontmatter>;
}

export default function ExperienceCard({ item }: Props) {
  const { frontmatter, content } = item;

  const bullets = content
    .split("\n\n")
    .map((p) => p.trim())
    .filter(Boolean);

  const titleRight = frontmatter.current ? (
    <span className="tag tag-yellow flex items-center gap-1">
      <span
        style={{
          width: 5,
          height: 5,
          borderRadius: "50%",
          background: "var(--yellow)",
          display: "inline-block",
        }}
      />
      current
    </span>
  ) : null;

  return (
    <Window
      title={`${frontmatter.company} — ${frontmatter.title}`}
      titleRight={titleRight}
      accentBar={!!frontmatter.current}
    >
      {/* Period bar */}
      <div
        className="flex items-center gap-3 px-4 py-2 stripe-bg"
        style={{
          borderBottom: "1px solid var(--border)",
          fontSize: 11,
          fontFamily: "var(--font-geist-mono)",
        }}
      >
        <span style={{ color: "var(--text-faint)" }}>period</span>
        <span
          style={{
            width: 1,
            height: 12,
            background: "var(--border)",
          }}
        />
        <span style={{ color: "var(--text-muted)" }}>
          {frontmatter.period}
        </span>
      </div>

      {/* Bullets */}
      <ul className="px-5 py-4 space-y-2">
        {bullets.map((b, i) => (
          <li
            key={i}
            className="flex gap-3 text-sm leading-relaxed"
            style={{ color: "var(--text-muted)" }}
          >
            <span
              style={{
                color: "var(--yellow)",
                marginTop: 1,
                flexShrink: 0,
                fontFamily: "var(--font-geist-mono)",
              }}
            >
              →
            </span>
            <span>{b}</span>
          </li>
        ))}
      </ul>

      {/* Tags */}
      <div
        className="flex flex-wrap gap-1.5 px-5 py-3"
        style={{ borderTop: "1px solid var(--border)" }}
      >
        {frontmatter.tags.map((tag) => (
          <span key={tag} className="tag">
            {tag}
          </span>
        ))}
      </div>
    </Window>
  );
}
