"use server";

import { createClient } from "@/lib/supabase/server";
import type { SiteSettings } from "@/types/database";

export async function updateSiteSettings(data: Partial<Omit<SiteSettings, "id">>) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: existing } = await supabase
    .from("site_settings")
    .select("id")
    .limit(1)
    .single();

  if (existing?.id) {
    const { data: row, error } = await supabase
      .from("site_settings")
      .update(data)
      .eq("id", existing.id)
      .select()
      .single();
    if (error) throw new Error(error.message);
    return row;
  }

  const { data: inserted, error: insertError } = await supabase
    .from("site_settings")
    .insert(data as Record<string, unknown>)
    .select()
    .single();
  if (insertError) throw new Error(insertError.message);
  return inserted;
}
