import type { Page, PageSection, SiteSettings, NavigationItem, MediaAsset } from "./database";

export type { Page, PageSection, SiteSettings, NavigationItem, MediaAsset };

export type SectionType =
  | "hero"
  | "rich_text"
  | "services"
  | "team"
  | "cta_band"
  | "image_text_split"
  | "contact"
  | "footer"
  | "faq"
  | "spacer"
  | "quote"
  | "logo_strip";

export interface HeroContent {
  eyebrow?: string;
  headline?: string;
  subheadline?: string;
  primaryCtaLabel?: string;
  primaryCtaHref?: string;
  secondaryCtaLabel?: string;
  secondaryCtaHref?: string;
  backgroundImageUrl?: string;
  foregroundImageUrl?: string;
  overlayStrength?: "light" | "medium" | "dark";
  alignment?: "left" | "center" | "right";
}

export interface RichTextContent {
  sectionTitle?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
  imageUrl?: string;
  imageAlt?: string;
  layout?: "image-left" | "image-right";
}

export interface ServiceItem {
  title: string;
  description: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ServicesContent {
  sectionTitle?: string;
  intro?: string;
  items: ServiceItem[];
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface TeamContent {
  sectionTitle?: string;
  intro?: string;
  members: TeamMember[];
}

export interface CtaBandContent {
  headline?: string;
  body?: string;
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ImageTextSplitContent {
  sectionTitle?: string;
  body?: string;
  imageUrl?: string;
  imageAlt?: string;
  layout?: "image-left" | "image-right";
  ctaLabel?: string;
  ctaHref?: string;
}

export interface ContactContent {
  sectionTitle?: string;
  email?: string;
  phone?: string;
  address?: string;
  formEnabled?: boolean;
}

export interface FooterContent {
  logoUrl?: string;
  text?: string;
  showSocials?: boolean;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface FaqContent {
  sectionTitle?: string;
  items: FaqItem[];
}

export interface SpacerContent {
  size?: "sm" | "md" | "lg";
}

export interface QuoteContent {
  quote?: string;
  attribution?: string;
  role?: string;
}

export interface LogoStripContent {
  sectionTitle?: string;
  logoUrls?: string[];
}

export type SectionContent =
  | HeroContent
  | RichTextContent
  | ServicesContent
  | TeamContent
  | CtaBandContent
  | ImageTextSplitContent
  | ContactContent
  | FooterContent
  | FaqContent
  | SpacerContent
  | QuoteContent
  | LogoStripContent;

export interface PageWithSections extends Page {
  sections: PageSection[];
}

export interface NavItemWithHref extends NavigationItem {
  href: string;
}
