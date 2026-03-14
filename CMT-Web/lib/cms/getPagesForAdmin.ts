import { createClient } from "@/lib/supabase/server";
import type { Page } from "@/types/database";

export async function getPagesForAdmin(): Promise<Page[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("pages")
    .select("*")
    .order("updated_at", { ascending: false });
  if (error) return [];
  return data ?? [];
}
