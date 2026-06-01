import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

const TYPE_COLOR: Record<string, string> = {
  Startup: "var(--red)",
  "Personal Project": "var(--text-secondary)",
};

export default function ProjectContent({ item }: { item: ContentItem<ProjectFrontmatter> }) {
  const embedUrl = item.frontmatter.url ? getYouTubeEmbedUrl(item.frontmatter.url) : null;

  return (
    <div className="txt-window">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "14px 20px", background: "var(--titlebar)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div className="type-subheading" style={{ fontSize: "var(--font-lg)" }}>{item.frontmatter.title}</div>
          <div className="type-caption" style={{ color: TYPE_COLOR[item.frontmatter.type] ?? "var(--text-secondary)", textTransform: "uppercase", marginTop: 4, fontWeight: 600 }}>
            {item.frontmatter.type}
          </div>
        </div>
        <span className="type-body-mono" style={{ fontSize: "var(--font-sm)", color: "var(--text-secondary)", whiteSpace: "nowrap" }}>
          {item.frontmatter.period}
        </span>
      </div>

      <p className="type-body" style={{ margin: 0, padding: "18px 20px" }}>
        {item.content}
      </p>

      {embedUrl && (
        <div style={{ padding: "0 20px 18px" }}>
          <div style={{ position: "relative", aspectRatio: "16 / 9", border: "2px solid var(--border)", boxShadow: "4px 4px 0px 0px rgba(0,0,0,0.7)", background: "#000" }}>
            <iframe
              src={embedUrl}
              title={`${item.frontmatter.title} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none" }}
            />
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 20px 16px", borderTop: "1px solid var(--border)" }}>
        {item.frontmatter.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}
