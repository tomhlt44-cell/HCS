import type { PageSection } from "@/types/cms";
import type { SpacerContent } from "@/types/cms";
import { cn } from "@/lib/utils";

export function SpacerSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as SpacerContent;
  const size = c.size ?? "md";
  const className =
    size === "sm" ? "h-8 sm:h-12" : size === "lg" ? "h-16 sm:h-24" : "h-12 sm:h-16";

  return <div className={cn("w-full", className)} aria-hidden />;
}
