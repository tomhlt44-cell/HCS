"use server";

import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";

const BUCKET = "media";

export async function getMediaAssets(search?: string) {
  const supabase = await createClient();
  let query = supabase.from("media_assets").select("*").order("created_at", { ascending: false });
  if (search?.trim()) {
    query = query.or(`file_name.ilike.%${search.trim()}%,alt_text.ilike.%${search.trim()}%`);
  }
  const { data, error } = await query;
  if (error) return [];
  return data ?? [];
}

export async function uploadMedia(formData: FormData): Promise<{ id: string; file_url: string } | null> {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const file = formData.get("file") as File | null;
  if (!file) throw new Error("No file");

  const admin = createAdminClient();
  const path = `${user.id}/${Date.now()}-${file.name.replace(/[^a-zA-Z0-9.-]/g, "_")}`;

  const { error: uploadError } = await admin.storage.from(BUCKET).upload(path, file, {
    contentType: file.type,
    upsert: false,
  });

  if (uploadError) throw new Error(uploadError.message);

  const { data: urlData } = admin.storage.from(BUCKET).getPublicUrl(path);
  const file_url = urlData.publicUrl;

  const { data: row, error: insertError } = await admin
    .from("media_assets")
    .insert({
      file_name: file.name,
      file_path: path,
      file_url,
      mime_type: file.type,
      file_size: file.size,
      uploaded_by: user.id,
    })
    .select("id, file_url")
    .single();

  if (insertError) throw new Error(insertError.message);
  return row;
}

export async function deleteMediaAsset(id: string) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { data: asset } = await supabase.from("media_assets").select("file_path").eq("id", id).single();
  if (!asset) throw new Error("Asset not found");

  const admin = createAdminClient();
  await admin.storage.from(BUCKET).remove([asset.file_path]);
  const { error } = await admin.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);
}

export async function updateMediaAlt(id: string, alt_text: string | null) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error("Unauthorized");

  const { error } = await supabase.from("media_assets").update({ alt_text }).eq("id", id);
  if (error) throw new Error(error.message);
}
