import { createClient } from "@/lib/supabase/server";
import type { Page } from "@/types/database";
import type { PageSection } from "@/types/cms";

export async function getPageForAdmin(id: string): Promise<{
  page: Page | null;
  sections: PageSection[];
}> {
  const supabase = await createClient();
  const { data: page, error: pageError } = await supabase
    .from("pages")
    .select("*")
    .eq("id", id)
    .single();

  if (pageError || !page) return { page: null, sections: [] };

  const { data: sections } = await supabase
    .from("page_sections")
    .select("*")
    .eq("page_id", id)
    .order("position", { ascending: true });

  return { page, sections: sections ?? [] };
}
