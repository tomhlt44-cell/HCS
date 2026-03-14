"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";
import type { MediaAsset } from "@/types/database";
import { uploadMedia, deleteMediaAsset } from "@/lib/cms/media";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Upload, Trash2 } from "lucide-react";

export function MediaLibrary({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const router = useRouter();
  const [assets, setAssets] = useState(initialAssets);
  const [search, setSearch] = useState("");
  const [uploading, setUploading] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadMedia(formData);
      if (result) {
        setAssets((prev) => [
          {
            id: result.id,
            file_name: file.name,
            file_path: "",
            file_url: result.file_url,
            alt_text: null,
            mime_type: file.type,
            file_size: file.size,
            width: null,
            height: null,
            uploaded_by: null,
            created_at: new Date().toISOString(),
          },
          ...prev,
        ]);
        toast.success("Uploaded");
        router.refresh();
      }
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed");
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this asset?")) return;
    try {
      await deleteMediaAsset(id);
      setAssets((prev) => prev.filter((a) => a.id !== id));
      toast.success("Deleted");
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    }
  }

  const filtered = search.trim()
    ? assets.filter(
        (a) =>
          a.file_name.toLowerCase().includes(search.toLowerCase()) ||
          (a.alt_text && a.alt_text.toLowerCase().includes(search.toLowerCase()))
      )
    : assets;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={uploading}
          ref={inputRef}
        />
        <Button
          type="button"
          variant="outline"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
        >
          <Upload className="h-4 w-4 mr-2" />
          {uploading ? "Uploading…" : "Upload image"}
        </Button>
        <Input
          placeholder="Search by name or alt text…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="max-w-xs"
        />
      </div>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {filtered.map((asset) => (
          <div
            key={asset.id}
            className="rounded-lg border border-gray-200 bg-white overflow-hidden"
          >
            <div className="aspect-video bg-gray-100 flex items-center justify-center p-2">
              {asset.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                <img
                  src={asset.file_url}
                  alt={asset.alt_text ?? asset.file_name}
                  className="max-h-full w-auto object-contain"
                />
              ) : (
                <span className="text-xs text-gray-400">Preview</span>
              )}
            </div>
            <div className="p-2">
              <p className="text-sm font-medium truncate" title={asset.file_name}>
                {asset.file_name}
              </p>
              <div className="flex items-center justify-between mt-2">
                <button
                  type="button"
                  className="text-xs text-gray-500 hover:text-gray-700"
                  onClick={() => {
                    navigator.clipboard.writeText(asset.file_url);
                    toast.success("URL copied");
                  }}
                >
                  Copy URL
                </button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-destructive"
                  onClick={() => handleDelete(asset.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
      {filtered.length === 0 && (
        <p className="text-center text-gray-500 py-12">No assets yet. Upload an image to get started.</p>
      )}
    </div>
  );
}
