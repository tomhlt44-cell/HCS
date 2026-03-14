"use server";

import { createClient } from "@/lib/supabase/server";
import type { Page } from "@/types/database";

export async function createPage(data: {
  title: string;
  slug: string;
  status?: Page["status"];
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: page, error } = await supabase
    .from("pages")
    .insert({
      title: data.title,
      slug: data.slug,
      status: data.status ?? "draft",
      updated_by: user.id,
      created_by: user.id,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  return page;
}

export async function updatePage(
  id: string,
  data: Partial<Omit<Page, "id" | "created_at">>
) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: page, error } = await supabase
    .from("pages")
    .update({ ...data, updated_by: user.id })
    .eq("id", id)
    .select()
    .single();

  if (error) throw new Error(error.message);
  return page;
}

export async function publishPage(id: string) {
  return updatePage(id, { status: "published", published_at: new Date().toISOString() });
}

export async function unpublishPage(id: string) {
  return updatePage(id, { status: "draft", published_at: null });
}

export async function deletePage(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("pages").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function setHomepage(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  await supabase.from("pages").update({ is_homepage: false }).neq("id", id);
  await supabase.from("pages").update({ is_homepage: true }).eq("id", id);
}
