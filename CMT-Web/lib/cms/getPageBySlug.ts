import { createClient } from "@/lib/supabase/server";
import type { PageWithSections } from "@/types/cms";

export async function getPageBySlug(slug: string): Promise<PageWithSections | null> {
  const supabase = await createClient();

  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("slug", slug)
    .eq("status", "published")
    .single();

  if (pageError || !page) return null;

  const { data: sections, error: sectionsError } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", page.id)
    .eq("is_enabled", true)
    .order("position", { ascending: true });

  if (sectionsError) return { ...page, sections: [] };

  return {
    ...page,
    sections: sections ?? [],
  };
}
