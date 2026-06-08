import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";
import { getYouTubeEmbedUrl } from "@/lib/youtube";

export default function ProjectContentMobile({ item }: { item: ContentItem<ProjectFrontmatter> }) {
  const embedUrl = item.frontmatter.url ? getYouTubeEmbedUrl(item.frontmatter.url) : null;

  return (
    <div className="txt-window mobile-txt-content">
      <div className="mobile-content-header">
        <div className="mobile-content-header-main">
          <div className="type-subheading">{item.frontmatter.title}</div>
          <div
            className="type-caption"
            style={{
              color: "var(--red)",
              textTransform: "uppercase",
              marginTop: 4,
              fontWeight: 600,
            }}
          >
            {item.frontmatter.type}
          </div>
        </div>
        <span className="type-label mobile-content-period">{item.frontmatter.period}</span>
      </div>

      <p className="type-body mobile-content-body">{item.content}</p>

      {embedUrl && (
        <div className="mobile-youtube-wrap">
          <div className="mobile-youtube-embed">
            <iframe
              src={embedUrl}
              title={`${item.frontmatter.title} demo`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              allowFullScreen
              loading="eager"
            />
          </div>
        </div>
      )}

      <div className="mobile-content-tags">
        {item.frontmatter.tags.map((t) => (
          <span key={t} className="tag">
            {t}
          </span>
        ))}
      </div>
    </div>
  );
}
