import { getExperience, getProjects, getResearch } from "@/lib/mdx";
import Desktop from "@/components/Desktop";

export default function Home() {
  const experience = getExperience();
  const projects = getProjects();
  const research = getResearch();

  return (
    <Desktop
      experience={experience}
      projects={projects}
      research={research}
    />
  );
}
