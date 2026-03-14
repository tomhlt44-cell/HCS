"use client";

import type { PageSection } from "@/types/cms";
import type { FaqContent } from "@/types/cms";
import { useState } from "react";
import { cn } from "@/lib/utils";

export function FaqSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as FaqContent;
  const items = c.items ?? [];
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section className="section-pad bg-white">
      <div className="container-narrow">
        {c.sectionTitle && (
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center mb-10">
            {c.sectionTitle}
          </h2>
        )}
        <div className="space-y-2">
          {items.map((item, i) => (
            <div
              key={i}
              className="border border-gray-200 rounded-lg overflow-hidden"
            >
              <button
                type="button"
                onClick={() => setOpenIndex(openIndex === i ? null : i)}
                className="w-full px-6 py-4 text-left font-medium text-gray-900 hover:bg-gray-50 flex justify-between items-center"
              >
                {item.question}
                <span className={cn(
                  "text-gray-500 transition-transform",
                  openIndex === i && "rotate-180"
                )}>
                  ▼
                </span>
              </button>
              {openIndex === i && (
                <div className="px-6 pb-4 text-gray-600 border-t border-gray-100 pt-2">
                  {item.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
