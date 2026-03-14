import { createClient } from "@/lib/supabase/server";

export type RecentPage = {
  id: string;
  title: string;
  slug: string;
  status: string;
  updated_at: string;
};

export async function getDashboardStats() {
  const supabase = await createClient();

  const [pagesRes, mediaRes] = await Promise.all([
    supabase.from("pages").select("id, title, slug, status, updated_at"),
    supabase.from("media_assets").select("id", { count: "exact", head: true }),
  ]);

  const pages = (pagesRes.data ?? []) as RecentPage[];
  const total = pages.length;
  const published = pages.filter((p) => p.status === "published").length;
  const draft = pages.filter((p) => p.status === "draft").length;
  const recentPages = [...pages]
    .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
    .slice(0, 5);

  return {
    totalPages: total,
    publishedPages: published,
    draftPages: draft,
    mediaCount: mediaRes.count ?? 0,
    recentPages,
  };
}
