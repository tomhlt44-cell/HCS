import { SectionRenderer as Renderer } from "@/lib/cms/sectionRenderer";
import type { PageSection } from "@/types/cms";

export function SectionRenderer({ sections }: { sections: PageSection[] }) {
  return (
    <>
      {sections.map((section) => (
        <Renderer key={section.id} section={section} />
      ))}
    </>
  );
}
