import type { PageSection } from "@/types/cms";
import type { CtaBandContent } from "@/types/cms";
import Link from "next/link";

export function CtaBandSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as CtaBandContent;

  return (
    <section className="section-pad bg-gray-900">
      <div className="container-narrow text-center">
        {c.headline && (
          <h2 className="text-3xl font-bold text-white tracking-tight">
            {c.headline}
          </h2>
        )}
        {c.body && (
          <p className="mt-4 text-lg text-gray-300">{c.body}</p>
        )}
        {c.ctaLabel && c.ctaHref && (
          <Link
            href={c.ctaHref}
            className="mt-8 inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
          >
            {c.ctaLabel}
          </Link>
        )}
      </div>
    </section>
  );
}
