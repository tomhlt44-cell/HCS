import type { PageSection } from "@/types/cms";
import type { QuoteContent } from "@/types/cms";

export function QuoteSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as QuoteContent;

  return (
    <section className="section-pad bg-gray-50">
      <div className="container-narrow text-center">
        {c.quote && (
          <blockquote className="text-2xl sm:text-3xl font-medium text-gray-900 italic">
            &ldquo;{c.quote}&rdquo;
          </blockquote>
        )}
        {(c.attribution || c.role) && (
          <footer className="mt-6 text-gray-600">
            {c.attribution && <cite className="font-semibold not-italic">{c.attribution}</cite>}
            {c.role && <span className="block text-sm">{c.role}</span>}
          </footer>
        )}
      </div>
    </section>
  );
}
