import type { PageSection } from "@/types/cms";
import type { ContactContent } from "@/types/cms";

export function ContactSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as ContactContent;

  return (
    <section className="section-pad bg-gray-50">
      <div className="container-narrow">
        {c.sectionTitle && (
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center">
            {c.sectionTitle}
          </h2>
        )}
        <div className="mt-10 flex flex-col sm:flex-row gap-8 justify-center items-center text-center sm:text-left">
          {c.email && (
            <a
              href={`mailto:${c.email}`}
              className="text-lg text-gray-700 hover:text-gray-900 font-medium"
            >
              {c.email}
            </a>
          )}
          {c.phone && (
            <a
              href={`tel:${c.phone.replace(/\D/g, "")}`}
              className="text-lg text-gray-700 hover:text-gray-900 font-medium"
            >
              {c.phone}
            </a>
          )}
        </div>
        {c.address && (
          <p className="mt-4 text-gray-600 text-center">{c.address}</p>
        )}
      </div>
    </section>
  );
}
