"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import type { Page } from "@/types/database";
import type { PageSection } from "@/types/cms";
import { SectionList } from "./SectionList";
import { SectionEditorPanel } from "./SectionEditorPanel";
import { AddSectionDialog } from "./AddSectionDialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  createSection,
  updateSection,
  deleteSection,
  reorderSections,
} from "@/lib/cms/saveSection";
import { updatePage, publishPage, setHomepage } from "@/lib/cms/savePage";
import { toast } from "sonner";
import type { SectionContent } from "@/types/cms";
import type { Json } from "@/types/database";
import { Eye } from "lucide-react";
import { SeoPanel } from "./SeoPanel";

type Props = {
  page: Page;
  sections: PageSection[];
};

export function PageEditor({ page: initialPage, sections: initialSections }: Props) {
  const router = useRouter();
  const [page, setPage] = useState(initialPage);
  const [sections, setSections] = useState(initialSections);
  const [selectedSectionId, setSelectedSectionId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const selectedSection = sections.find((s) => s.id === selectedSectionId);

  async function handleSavePage(fields: Partial<Page>) {
    setSaving(true);
    try {
      const updated = await updatePage(page.id, fields);
      setPage(updated);
      toast.success("Page saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    } finally {
      setSaving(false);
    }
  }

  async function handlePublish() {
    setSaving(true);
    try {
      await publishPage(page.id);
      setPage((p) => ({ ...p, status: "published" }));
      toast.success("Page published");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to publish");
    } finally {
      setSaving(false);
    }
  }

  async function handleSetHomepage() {
    try {
      await setHomepage(page.id);
      toast.success("Set as homepage");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function handleAddSection(sectionType: string) {
    try {
      const newSection = await createSection({
        page_id: page.id,
        section_type: sectionType,
        position: sections.length,
        content_json: {},
      });
      setSections((prev) => [...prev, newSection]);
      setSelectedSectionId(newSection.id);
      toast.success("Section added");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to add section");
    }
  }

  async function handleSaveSectionContent(content: SectionContent) {
    if (!selectedSectionId) return;
    try {
      await updateSection(selectedSectionId, { content_json: content as unknown as Json });
      setSections((prev) =>
        prev.map((s) =>
          s.id === selectedSectionId ? { ...s, content_json: content as unknown as Json } : s
        )
      );
      toast.success("Section saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save section");
    }
  }

  async function handleDeleteSection() {
    if (!selectedSectionId) return;
    if (!confirm("Remove this section?")) return;
    try {
      await deleteSection(selectedSectionId);
      setSections((prev) => prev.filter((s) => s.id !== selectedSectionId));
      setSelectedSectionId(null);
      toast.success("Section removed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to remove");
    }
  }

  async function handleReorder(orderedIds: string[]) {
    const byId = Object.fromEntries(sections.map((s) => [s.id, s]));
    const reordered = orderedIds.map((id) => byId[id]).filter(Boolean);
    const missingCount = orderedIds.length - reordered.length;
    if (missingCount > 0) {
      toast.error(
        `Reorder skipped: ${missingCount} section(s) not found. The page may have changed. Refreshing.`
      );
      router.refresh();
      return;
    }
    try {
      await reorderSections(page.id, orderedIds);
      setSections(reordered);
      toast.success("Order saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to reorder");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/pages" className="text-sm text-gray-600 hover:text-gray-900">
            ← Back
          </Link>
          <h1 className="text-2xl font-bold text-gray-900">Edit page</h1>
        </div>
        <div className="flex items-center gap-2">
          {page.status === "published" ? (
            <Link
              href={page.is_homepage ? "/" : `/${page.slug}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-gray-50"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </Link>
          ) : (
            <span
              className="inline-flex items-center justify-center rounded-md border border-gray-200 bg-gray-50 px-3 py-1.5 text-sm font-medium text-gray-400 cursor-not-allowed"
              title="Publish the page to preview"
            >
              <Eye className="h-4 w-4 mr-1" />
              Preview
            </span>
          )}
          {page.status !== "published" && (
            <Button size="sm" onClick={handlePublish} disabled={saving}>
              Publish
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            onClick={handleSetHomepage}
            disabled={page.is_homepage}
          >
            {page.is_homepage ? "Homepage" : "Set as homepage"}
          </Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-4">
          <div>
            <Label>Title</Label>
            <Input
              value={page.title}
              onChange={(e) => setPage((p) => ({ ...p, title: e.target.value }))}
              onBlur={(e) => handleSavePage({ title: e.target.value })}
            />
          </div>
          <div>
            <Label>Slug</Label>
            <Input
              value={page.slug}
              onChange={(e) => setPage((p) => ({ ...p, slug: e.target.value }))}
              onBlur={(e) => handleSavePage({ slug: e.target.value })}
            />
          </div>

          <SeoPanel page={page} onSave={handleSavePage} />

          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Sections</h2>
            <AddSectionDialog
              onAdd={(type) => handleAddSection(type)}
            />
          </div>
          <SectionList
            sections={sections}
            selectedId={selectedSectionId}
            onSelect={setSelectedSectionId}
            onReorder={handleReorder}
          />
        </div>

        <div className="rounded-lg border border-gray-200 bg-white p-4">
          {selectedSection ? (
            <SectionEditorPanel
              section={selectedSection}
              onSave={handleSaveSectionContent}
              onDelete={handleDeleteSection}
            />
          ) : (
            <p className="text-sm text-gray-500">Select a section to edit.</p>
          )}
        </div>
      </div>
    </div>
  );
}
