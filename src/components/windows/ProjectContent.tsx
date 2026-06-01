import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const TYPE_COLOR: Record<string, string> = {
  Startup: "var(--red)",
  "Personal Project": "var(--text-muted)",
};

export default function ProjectContent({ item }: { item: ContentItem<ProjectFrontmatter> }) {
  const embedUrl = item.frontmatter.url ? getYouTubeEmbedUrl(item.frontmatter.url) : null;

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
        <span style={{ fontSize: 13, fontFamily: "var(--font-geist-mono)", color: "var(--text)", whiteSpace: "nowrap" }}>{item.frontmatter.period}</span>
      </div>

      {/* Description */}
      <p style={{ margin: 0, padding: "16px 18px", fontSize: 15, color: "var(--text)", lineHeight: 1.75 }}>
        {item.content}
      </p>

      {embedUrl && (
        <div style={{ padding: "0 18px 16px" }}>
          <div
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              border: "2px solid var(--border)",
              boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.7)",
              background: "#000",
            }}
          >
            <iframe
              src={embedUrl}
              title={`${item.frontmatter.title} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{
                position: "absolute",
                inset: 0,
                width: "100%",
                height: "100%",
                border: "none",
              }}
            />
          </div>
        </div>
      )}

      {/* Tags */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "10px 18px 14px", borderTop: "1px solid var(--border)" }}>
        {item.frontmatter.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}
