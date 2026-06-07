import { ContentItem, ExperienceFrontmatter } from "@/lib/mdx";
import ExperienceContent from "./ExperienceContent";

interface Props {
  experience: ContentItem<ExperienceFrontmatter>[];
}

export default function WorkWindow({ experience }: Props) {
  const sorted = experience.toSorted((a, b) => {
    if (a.frontmatter.current) return -1;
    if (b.frontmatter.current) return 1;
    return 0;
  });

  return (
    <div>
      {sorted.map((item, i) => (
        <div key={item.slug} style={{ borderBottom: i < sorted.length - 1 ? "2px solid var(--border)" : "none" }}>
          <ExperienceContent item={item} />
        </div>
      ))}
    </div>
  );
}
