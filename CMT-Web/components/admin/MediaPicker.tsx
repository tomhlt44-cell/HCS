"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { getMediaAssets } from "@/lib/cms/media";

type Props = {
  onSelect: (url: string) => void;
  children: React.ReactNode;
};

export function MediaPicker({ onSelect, children }: Props) {
  const [open, setOpen] = useState(false);
  const [assets, setAssets] = useState<{ id: string; file_name: string; file_url: string }[]>([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) return;
    setLoading(true);
    getMediaAssets(search || undefined)
      .then((data) => setAssets(data))
      .finally(() => setLoading(false));
  }, [open, search]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>{children}</DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose image</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Search…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="mb-4"
        />
        <div className="flex-1 overflow-auto grid gap-4 grid-cols-3 sm:grid-cols-4">
          {loading ? (
            <p className="col-span-full text-sm text-gray-500">Loading…</p>
          ) : assets.length === 0 ? (
            <p className="col-span-full text-sm text-gray-500">No images found.</p>
          ) : (
            assets.map((asset) => (
              <button
                key={asset.id}
                type="button"
                className="rounded border border-gray-200 overflow-hidden hover:ring-2 ring-primary aspect-square flex items-center justify-center bg-gray-50"
                onClick={() => {
                  onSelect(asset.file_url);
                  setOpen(false);
                }}
              >
                {asset.file_url.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                  <img
                    src={asset.file_url}
                    alt={asset.file_name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <span className="text-xs text-gray-400">Image</span>
                )}
              </button>
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
