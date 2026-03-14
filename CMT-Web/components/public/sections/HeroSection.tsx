import type { PageSection } from "@/types/cms";
import type { HeroContent } from "@/types/cms";
import Link from "next/link";
import { cn } from "@/lib/utils";

export function HeroSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as HeroContent;
  const alignment = c.alignment === "left" ? "text-left" : c.alignment === "right" ? "text-right" : "text-center";
  const overlay = c.overlayStrength === "dark" ? "bg-black/60" : c.overlayStrength === "light" ? "bg-black/30" : "bg-black/45";

  return (
    <section className="relative min-h-[70vh] flex items-center justify-center overflow-hidden">
      {c.backgroundImageUrl && (
        <div className="absolute inset-0 z-0">
          <img
            src={c.backgroundImageUrl}
            alt=""
            className="object-cover w-full h-full"
          />
          <div className={cn("absolute inset-0", overlay)} />
        </div>
      )}
      <div className={cn("container-wide relative z-10 section-pad", alignment)}>
        {c.eyebrow && (
          <p className="text-sm font-medium tracking-wider text-white/90 uppercase mb-4">
            {c.eyebrow}
          </p>
        )}
        {c.headline && (
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white tracking-tight max-w-4xl mx-auto">
            {c.headline}
          </h1>
        )}
        {c.subheadline && (
          <p className="mt-6 text-xl text-white/95 max-w-2xl mx-auto">
            {c.subheadline}
          </p>
        )}
        <div className="mt-10 flex flex-wrap gap-4 justify-center sm:justify-start">
          {c.primaryCtaLabel && c.primaryCtaHref && (
            <Link
              href={c.primaryCtaHref}
              className="inline-flex items-center justify-center rounded-md bg-white px-6 py-3 text-base font-semibold text-gray-900 shadow-sm hover:bg-gray-100 transition-colors"
            >
              {c.primaryCtaLabel}
            </Link>
          )}
          {c.secondaryCtaLabel && c.secondaryCtaHref && (
            <Link
              href={c.secondaryCtaHref}
              className="inline-flex items-center justify-center rounded-md border border-white px-6 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
            >
              {c.secondaryCtaLabel}
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}
