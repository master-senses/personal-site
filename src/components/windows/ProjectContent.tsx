import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export default function ProjectContent({ item }: { item: ContentItem<ProjectFrontmatter> }) {
  const embedUrl = item.frontmatter.url ? getYouTubeEmbedUrl(item.frontmatter.url) : null;

  return (
    <div className="txt-window">
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, padding: "12px 16px", background: "var(--titlebar)", borderBottom: "1px solid var(--border)" }}>
        <div>
          <div className="type-subheading">{item.frontmatter.title}</div>
          <div className="type-caption" style={{ color: "var(--red)", textTransform: "uppercase", marginTop: 4, fontWeight: 600 }}>
            {item.frontmatter.type}
          </div>
        </div>
        <span className="type-label" style={{ color: "var(--text)", whiteSpace: "nowrap" }}>
          {item.frontmatter.period}
        </span>
      </div>

      <p className="type-body" style={{ margin: 0, padding: "12px 16px" }}>
        {item.content}
      </p>

      {embedUrl && (
        <div style={{ padding: "0 16px 12px" }}>
          <div style={{ position: "relative", aspectRatio: "16 / 9", background: "var(--bg)" }}>
            <iframe
              src={embedUrl}
              title={`${item.frontmatter.title} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              style={{ position: "absolute", inset: 0, width: "100%", height: "100%", border: "none", outline: "none" }}
            />
          </div>
        </div>
      )}

      <div style={{ display: "flex", flexWrap: "wrap", gap: 8, padding: "12px 16px", borderTop: "1px solid var(--border)" }}>
        {item.frontmatter.tags.map((t) => <span key={t} className="tag">{t}</span>)}
      </div>
    </div>
  );
}
