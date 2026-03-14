import type { PageSection } from "@/types/cms";
import type { LogoStripContent } from "@/types/cms";

export function LogoStripSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as LogoStripContent;
  const urls = c.logoUrls ?? [];

  return (
    <section className="section-pad-sm bg-white border-y border-gray-100">
      <div className="container-wide">
        {c.sectionTitle && (
          <p className="text-center text-sm font-medium text-gray-500 uppercase tracking-wider mb-8">
            {c.sectionTitle}
          </p>
        )}
        <div className="flex flex-wrap justify-center items-center gap-10 opacity-70">
          {urls.map((url, i) => (
            <img
              key={i}
              src={url}
              alt=""
              className="h-8 w-auto object-contain max-w-[120px]"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
