import type { PageSection } from "@/types/cms";
import type { FooterContent } from "@/types/cms";

export function FooterSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as FooterContent;

  return (
    <footer className="section-pad-sm bg-gray-900 text-gray-300">
      <div className="container-wide flex flex-col sm:flex-row items-center justify-between gap-6">
        {c.logoUrl && (
          <img src={c.logoUrl} alt="" className="h-8 w-auto" />
        )}
        {c.text && <p className="text-sm">{c.text}</p>}
        {c.showSocials && (
          <div className="flex gap-4">
            {/* Placeholder for social links from site_settings */}
          </div>
        )}
      </div>
    </footer>
  );
}
