import { ContentItem, ResearchFrontmatter } from "@/lib/mdx";
import ResearchContent from "./ResearchContent";

interface Props {
  research: ContentItem<ResearchFrontmatter>[];
}

export default function ResearchWindow({ research }: Props) {
  return (
    <div>
      {research.map((item, i) => (
        <div key={item.slug} style={{ borderBottom: i < research.length - 1 ? "2px solid var(--border)" : "none" }}>
          <ResearchContent item={item} />
        </div>
      ))}
    </div>
  );
}
