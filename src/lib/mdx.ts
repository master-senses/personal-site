import fs from "fs";
import path from "path";
import matter from "gray-matter";

const contentDir = path.join(process.cwd(), "content");

export interface ExperienceFrontmatter {
  title: string;
  company: string;
  period: string;
  tags: string[];
  current?: boolean;
}

export interface ProjectFrontmatter {
  title: string;
  period: string;
  tags: string[];
  url?: string;
  type: string;
}

export interface ResearchFrontmatter {
  title: string;
  company: string;
  period: string;
  tags: string[];
  url?: string;
}

export interface ContentItem<T> {
  slug: string;
  frontmatter: T;
  content: string;
}

function getContentItems<T>(folder: string): ContentItem<T>[] {
  const dir = path.join(contentDir, folder);
  if (!fs.existsSync(dir)) return [];

  const files = fs.readdirSync(dir).filter((f) => f.endsWith(".mdx"));
  return files.map((file) => {
    const raw = fs.readFileSync(path.join(dir, file), "utf-8");
    const { data, content } = matter(raw);
    return {
      slug: file.replace(".mdx", ""),
      frontmatter: data as T,
      content: content.trim(),
    };
  });
}

export function getExperience(): ContentItem<ExperienceFrontmatter>[] {
  return getContentItems<ExperienceFrontmatter>("experience");
}

export function getProjects(): ContentItem<ProjectFrontmatter>[] {
  return getContentItems<ProjectFrontmatter>("projects");
}

export function getResearch(): ContentItem<ResearchFrontmatter>[] {
  return getContentItems<ResearchFrontmatter>("research");
}
