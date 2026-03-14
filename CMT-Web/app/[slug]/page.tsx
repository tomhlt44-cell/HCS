import { notFound } from "next/navigation";
import { getPageBySlug } from "@/lib/cms/getPageBySlug";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { SectionRenderer } from "@/components/public/SectionRenderer";
import { getSiteSettings } from "@/lib/cms/getSiteSettings";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const page = await getPageBySlug(slug);
  const settings = await getSiteSettings();
  if (!page) return { title: settings?.site_name ?? "Capitol Media Training" };

  const title = page.seo_title || page.title;
  const description = page.seo_description || (page.excerpt ?? undefined);
  const ogTitle = page.og_title || title;
  const ogDescription = page.og_description || description;
  const siteName = settings?.site_name ?? "Capitol Media Training";

  return {
    title: page.noindex ? title : `${title} | ${siteName}`,
    description,
    openGraph: {
      title: ogTitle,
      description: ogDescription,
      type: "website",
    },
    robots: page.noindex ? { index: false, follow: false } : undefined,
    alternates: page.canonical_url ? { canonical: page.canonical_url } : undefined,
  };
}

export default async function SlugPage({ params }: Props) {
  const { slug } = await params;
  if (slug === "admin" || slug === "login") notFound();

  const page = await getPageBySlug(slug);
  if (!page) notFound();

  return (
    <>
      <Header />
      <main>
        <SectionRenderer sections={page.sections} />
      </main>
      <Footer />
    </>
  );
}
