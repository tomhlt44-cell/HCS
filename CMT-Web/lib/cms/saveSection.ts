"use server";

import { createClient } from "@/lib/supabase/server";
import type { Json } from "@/types/database";

export async function createSection(data: {
  page_id: string;
  section_type: string;
  position: number;
  content_json?: Json;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: section, error } = await supabase
    .from("page_sections")
    .insert({
      page_id: data.page_id,
      section_type: data.section_type,
      position: data.position,
      content_json: data.content_json ?? {},
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return section;
}

export async function updateSection(
  id: string,
  data: { content_json?: Json; is_enabled?: boolean }
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: section, error } = await supabase
    .from("page_sections")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return section;
}

export async function deleteSection(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("page_sections").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderSections(
  pageId: string,
  sectionIds: string[]
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  for (let i = 0; i < sectionIds.length; i++) {
    await supabase
      .from("page_sections")
      .update({ position: i })
      .eq("id", sectionIds[i])
      .eq("page_id", pageId);
  }
}
