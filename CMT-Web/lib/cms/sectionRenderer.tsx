import type { PageSection } from "@/types/cms";
import { HeroSection } from "@/components/public/sections/HeroSection";
import { RichTextSection } from "@/components/public/sections/RichTextSection";
import { ServicesSection } from "@/components/public/sections/ServicesSection";
import { TeamSection } from "@/components/public/sections/TeamSection";
import { CtaBandSection } from "@/components/public/sections/CtaBandSection";
import { ImageTextSplitSection } from "@/components/public/sections/ImageTextSplitSection";
import { ContactSection } from "@/components/public/sections/ContactSection";
import { FooterSection } from "@/components/public/sections/FooterSection";
import { FaqSection } from "@/components/public/sections/FaqSection";
import { SpacerSection } from "@/components/public/sections/SpacerSection";
import { QuoteSection } from "@/components/public/sections/QuoteSection";
import { LogoStripSection } from "@/components/public/sections/LogoStripSection";

const SECTION_MAP: Record<
  string,
  React.ComponentType<{ section: PageSection }>
> = {
  hero: HeroSection,
  rich_text: RichTextSection,
  services: ServicesSection,
  team: TeamSection,
  cta_band: CtaBandSection,
  image_text_split: ImageTextSplitSection,
  contact: ContactSection,
  footer: FooterSection,
  faq: FaqSection,
  spacer: SpacerSection,
  quote: QuoteSection,
  logo_strip: LogoStripSection,
};

export function SectionRenderer({ section }: { section: PageSection }) {
  const Component = SECTION_MAP[section.section_type];
  if (!Component) return null;
  return <Component section={section} />;
}
