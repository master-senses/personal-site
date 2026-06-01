import { ContentItem, ProjectFrontmatter } from "@/lib/mdx";
import ProjectContent from "./ProjectContent";

interface Props {
  projects: ContentItem<ProjectFrontmatter>[];
}

export default function ProjectsWindow({ projects }: Props) {
  return (
    <div>
      {projects.map((item, i) => (
        <div key={item.slug} style={{ borderBottom: i < projects.length - 1 ? "2px solid var(--border)" : "none" }}>
          <ProjectContent item={item} />
        </div>
      ))}
    </div>
  );
}
