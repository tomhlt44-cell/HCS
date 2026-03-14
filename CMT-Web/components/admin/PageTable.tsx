"use client";

import Link from "next/link";
import { useState } from "react";
import type { Page } from "@/types/database";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Pencil, Trash2, Eye } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  publishPage,
  unpublishPage,
  deletePage,
} from "@/lib/cms/savePage";
import { toast } from "sonner";

export function PageTable({ pages }: { pages: Page[] }) {
  const router = useRouter();
  const [filter, setFilter] = useState<"all" | "draft" | "published">("all");
  const [search, setSearch] = useState("");

  const filtered = pages.filter((p) => {
    const matchStatus = filter === "all" || p.status === filter;
    const matchSearch =
      !search ||
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.slug.toLowerCase().includes(search.toLowerCase());
    return matchStatus && matchSearch;
  });

  async function handlePublish(id: string) {
    try {
      await publishPage(id);
      toast.success("Page published");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    }
  }

  async function handleUnpublish(id: string) {
    try {
      await unpublishPage(id);
      toast.success("Page unpublished");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to unpublish");
    }
  }

  async function handleDelete(id: string) {
    if (!confirm("Delete this page? This cannot be undone.")) return;
    try {
      await deletePage(id);
      toast.success("Page deleted");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to delete");
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-4 items-center">
        <input
          type="search"
          placeholder="Search by title or slug…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-md border border-gray-300 px-3 py-2 text-sm w-64"
        />
        <div className="flex gap-2">
          {(["all", "draft", "published"] as const).map((f) => (
            <Button
              key={f}
              variant={filter === f ? "default" : "outline"}
              size="sm"
              onClick={() => setFilter(f)}
            >
              {f === "all" ? "All" : f === "draft" ? "Draft" : "Published"}
            </Button>
          ))}
        </div>
      </div>
      <div className="rounded-md border border-gray-200 bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Slug</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filtered.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center text-gray-500 py-8">
                  No pages found.
                </TableCell>
              </TableRow>
            ) : (
              filtered.map((p) => (
                <TableRow key={p.id}>
                  <TableCell>
                    <Link
                      href={`/admin/pages/${p.id}`}
                      className="font-medium text-gray-900 hover:underline"
                    >
                      {p.title}
                    </Link>
                    {p.is_homepage && (
                      <span className="ml-2 text-xs text-amber-600">Homepage</span>
                    )}
                  </TableCell>
                  <TableCell className="text-gray-600">/{p.slug}</TableCell>
                  <TableCell>
                    <span
                      className={
                        p.status === "published"
                          ? "text-green-600"
                          : "text-amber-600"
                      }
                    >
                      {p.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      {p.status === "published" ? (
                        <Link
                          href={p.is_homepage ? "/" : `/${p.slug}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex p-2 text-gray-500 hover:text-gray-900"
                        >
                          <Eye className="h-4 w-4" />
                        </Link>
                      ) : (
                        <span className="inline-flex p-2 text-gray-300 cursor-not-allowed" title="Publish to view">
                          <Eye className="h-4 w-4" />
                        </span>
                      )}
                      <DropdownMenu>
                        <DropdownMenuTrigger>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link href={`/admin/pages/${p.id}`}>
                              <Pencil className="h-4 w-4 mr-2" />
                              Edit
                            </Link>
                          </DropdownMenuItem>
                          {p.status === "published" && (
                            <DropdownMenuItem>
                              <Link href={p.is_homepage ? "/" : `/${p.slug}`} target="_blank" rel="noopener noreferrer">
                                <Eye className="h-4 w-4 mr-2" />
                                View
                              </Link>
                            </DropdownMenuItem>
                          )}
                          {p.status === "published" ? (
                            <DropdownMenuItem
                              onClick={() => handleUnpublish(p.id)}
                            >
                              Unpublish
                            </DropdownMenuItem>
                          ) : (
                            <DropdownMenuItem
                              onClick={() => handlePublish(p.id)}
                            >
                              Publish
                            </DropdownMenuItem>
                          )}
                          <DropdownMenuItem
                            className="text-destructive"
                            onClick={() => handleDelete(p.id)}
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
