import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";
import Window from "./Window";

interface Props {
  item: ContentItem<ProjectFrontmatter>;
}

const TYPE_ACCENT: Record<string, string> = {
  Startup: "var(--red)",
  "Personal Project": "var(--text-muted)",
};

export default function ProjectCard({ item }: Props) {
  const { frontmatter, content } = item;

  const typeRight = (
    <span
      className="font-mono"
      style={{
        fontSize: 10,
        color: TYPE_ACCENT[frontmatter.type] ?? "var(--text-faint)",
        textTransform: "uppercase",
        letterSpacing: "0.08em",
      }}
    >
      {frontmatter.type}
    </span>
  );

  return (
    <Window title={frontmatter.title} titleRight={typeRight}>
      {/* Content area */}
      <div className="p-5 flex flex-col gap-4">
        <p
          className="text-sm leading-relaxed"
          style={{ color: "var(--text-muted)" }}
        >
          {content}
        </p>

        <div className="flex items-end justify-between gap-3">
          <div className="flex flex-wrap gap-1">
            {frontmatter.tags.map((tag) => (
              <span key={tag} className="tag">
                {tag}
              </span>
            ))}
          </div>

          {frontmatter.url && (
            <a
              href={frontmatter.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 font-mono text-xs shrink-0 transition-colors"
              style={{
                color: "var(--yellow)",
                textDecoration: "none",
              }}
            >
              <PlayIcon />
              demo
            </a>
          )}
        </div>
      </div>

      {/* Period footer */}
      <div
        className="stripe-bg px-4 py-2"
        style={{
          borderTop: "1px solid var(--border)",
          fontSize: 10,
          fontFamily: "var(--font-geist-mono)",
          color: "var(--text-faint)",
        }}
      >
        {frontmatter.period}
      </div>
    </Window>
  );
}

function PlayIcon() {
  return (
    <svg
      width="11"
      height="11"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}
