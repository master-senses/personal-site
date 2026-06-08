import { getExperience, getProjects, getResearch } from "@/lib/mdx";
import MobileLayoutPreview from "./MobileLayoutPreview";

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
        <MobileLayoutPreview
          experience={experience}
          projects={projects}
          research={research}
        />
      </div>
    </div>
  );
}
