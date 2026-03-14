import type { SectionType } from "@/types/cms";

export const SECTION_TYPE_LABELS: Record<SectionType, string> = {
  hero: "Hero",
  rich_text: "Rich text / Intro",
  services: "Services cards",
  team: "Team grid",
  cta_band: "CTA band",
  image_text_split: "Image + text split",
  contact: "Contact section",
  footer: "Simple footer",
  faq: "FAQ accordion",
  spacer: "Spacer",
  quote: "Quote / Testimonial",
  logo_strip: "Logo strip",
};

export const SECTION_TYPES: SectionType[] = [
  "hero",
  "rich_text",
  "services",
  "team",
  "cta_band",
  "image_text_split",
  "contact",
  "footer",
  "faq",
  "spacer",
  "quote",
  "logo_strip",
];
