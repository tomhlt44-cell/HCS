"use server";

import { createClient } from "@/lib/supabase/server";
import type { NavigationItem } from "@/types/database";

export async function getNavigationItemsForAdmin(): Promise<NavigationItem[]> {
  const supabase = await createClient();
  const { data, error } = await supabase
    .from("navigation_items")
    .select("*")
    .order("sort_order", { ascending: true });
  if (error) return [];
  return data ?? [];
}

export async function createNavigationItem(data: {
  label: string;
  item_type: "internal" | "external";
  page_id?: string | null;
  external_url?: string | null;
  sort_order: number;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: row, error } = await supabase
    .from("navigation_items")
    .insert(data)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return row;
}

export async function updateNavigationItem(
  id: string,
  data: Partial<Omit<NavigationItem, "id" | "created_at">>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: row, error } = await supabase
    .from("navigation_items")
    .update(data)
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return row;
}

export async function deleteNavigationItem(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("navigation_items").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function reorderNavigationItems(orderedIds: string[]) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  for (let i = 0; i < orderedIds.length; i++) {
    await supabase
      .from("navigation_items")
      .update({ sort_order: i })
      .eq("id", orderedIds[i]);
  }
}
