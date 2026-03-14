import type { PageSection } from "@/types/cms";
import type { ServicesContent } from "@/types/cms";
import Link from "next/link";

export function ServicesSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as ServicesContent;
  const items = c.items ?? [];

  return (
    <section className="section-pad bg-gray-50">
      <div className="container-wide">
        {c.sectionTitle && (
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center">
            {c.sectionTitle}
          </h2>
        )}
        {c.intro && (
          <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto">
            {c.intro}
          </p>
        )}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <div
              key={i}
              className="rounded-lg bg-white p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
            >
              <h3 className="text-xl font-semibold text-gray-900">{item.title}</h3>
              <p className="mt-3 text-gray-600">{item.description}</p>
              {item.ctaLabel && item.ctaHref && (
                <Link
                  href={item.ctaHref}
                  className="mt-4 inline-flex font-medium text-gray-900 hover:underline"
                >
                  {item.ctaLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
