import { createClient } from "@/lib/supabase/server";
import type { MetadataRoute } from "next";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const supabase = await createClient();
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.capitolmediatraining.com";

  const { data: pages } = await supabase
    .from("pages")
    .select("slug, updated_at, is_homepage")
    .eq("status", "published");

  const entries: MetadataRoute.Sitemap = [];
  const seenUrls = new Set<string>();

  for (const p of pages ?? []) {
    if ((p as { is_homepage?: boolean }).is_homepage) {
      if (!seenUrls.has(baseUrl)) {
        seenUrls.add(baseUrl);
        entries.push({
          url: baseUrl,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 1,
        });
      }
    } else {
      const url = `${baseUrl}/${p.slug}`;
      if (!seenUrls.has(url)) {
        seenUrls.add(url);
        entries.push({
          url,
          lastModified: p.updated_at ? new Date(p.updated_at) : new Date(),
          changeFrequency: "weekly",
          priority: 0.8,
        });
      }
    }
  }

  if (entries.length === 0) {
    entries.push({ url: baseUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 });
  }

  return entries;
}
