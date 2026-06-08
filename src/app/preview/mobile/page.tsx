import { getExperience, getProjects, getResearch } from "@/lib/mdx";
import MobileLayout from "@/components/MobileLayout";

export default function MobilePreviewPage() {
  const experience = getExperience();
  const projects = getProjects();
  const research = getResearch();

  return (
    <div className="mobile-preview-frame">
      <div className="mobile-preview-phone">
        <div className="mobile-preview-banner">
          Layout preview only — delete src/app/preview/mobile to remove
        </div>
        <MobileLayout
          experience={experience}
          projects={projects}
          research={research}
        />
      </div>
    </div>
  );
}
