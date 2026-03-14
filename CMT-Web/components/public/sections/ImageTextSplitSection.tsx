import type { PageSection } from "@/types/cms";
import type { ImageTextSplitContent } from "@/types/cms";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function ImageTextSplitSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as ImageTextSplitContent;
  const imageLeft = c.layout === "image-left";

  return (
    <section className="section-pad bg-white">
      <div className="container-wide">
        <div className={cn(
          "grid gap-12 lg:gap-16 items-center lg:grid-cols-2",
          imageLeft && "lg:grid-cols-2"
        )}>
          <div className={imageLeft ? "lg:order-2" : ""}>
            {c.sectionTitle && (
              <h2 className="text-3xl font-bold text-gray-900 tracking-tight">
                {c.sectionTitle}
              </h2>
            )}
            {c.body && (
              <div
                className="mt-6 prose prose-lg text-gray-600 max-w-none"
                dangerouslySetInnerHTML={{ __html: c.body }}
              />
            )}
            {c.ctaLabel && c.ctaHref && (
              <Link
                href={c.ctaHref}
                className="mt-6 inline-flex font-semibold text-gray-900 hover:underline"
              >
                {c.ctaLabel}
              </Link>
            )}
          </div>
          {c.imageUrl && (
            <div className={imageLeft ? "lg:order-1" : ""}>
              <img
                src={c.imageUrl}
                alt={c.imageAlt || ""}
                className="rounded-lg shadow-lg w-full object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
