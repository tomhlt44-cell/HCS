"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { NavigationItem } from "@/types/database";
import type { Page } from "@/types/database";
import {
  createNavigationItem,
  updateNavigationItem,
  deleteNavigationItem,
  reorderNavigationItems,
} from "@/lib/cms/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { Plus, Trash2, GripVertical } from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

function SortableNavRow({
  item,
  pages,
  onUpdate,
  onDelete,
}: {
  item: NavigationItem;
  pages: Page[];
  onUpdate: (id: string, data: Partial<NavigationItem>) => void;
  onDelete: (id: string) => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: item.id });

  const style = { transform: CSS.Transform.toString(transform), transition };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded border p-3 bg-white",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        className="touch-none cursor-grab text-gray-400"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <div className="flex-1 grid gap-2 sm:grid-cols-3">
        <Input
          value={item.label}
          onChange={(e) => onUpdate(item.id, { label: e.target.value })}
          onBlur={(e) => onUpdate(item.id, { label: e.target.value })}
          placeholder="Label"
        />
        <Select
          value={item.item_type}
          onValueChange={(v) => onUpdate(item.id, { item_type: v as "internal" | "external" })}
        >
          <SelectTrigger><SelectValue /></SelectTrigger>
          <SelectContent>
            <SelectItem value="internal">Internal page</SelectItem>
            <SelectItem value="external">External URL</SelectItem>
          </SelectContent>
        </Select>
        {item.item_type === "internal" ? (
          <Select
            value={item.page_id ?? ""}
            onValueChange={(v) => onUpdate(item.id, { page_id: v || null, external_url: null })}
          >
            <SelectTrigger><SelectValue placeholder="Select page" /></SelectTrigger>
            <SelectContent>
              {pages.filter((p) => p.status === "published").map((p) => (
                <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        ) : (
          <Input
            value={item.external_url ?? ""}
            onChange={(e) => onUpdate(item.id, { external_url: e.target.value || null })}
            onBlur={(e) => onUpdate(item.id, { external_url: e.target.value || null })}
            placeholder="https://…"
          />
        )}
      </div>
      <div className="flex items-center gap-2">
        <Switch
          checked={item.is_enabled}
          onCheckedChange={(v) => onUpdate(item.id, { is_enabled: v })}
        />
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="text-destructive"
          onClick={() => onDelete(item.id)}
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

export function NavigationEditor({
  initialItems,
  pages,
}: {
  initialItems: NavigationItem[];
  pages: Page[];
}) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [newLabel, setNewLabel] = useState("");
  const [newType, setNewType] = useState<"internal" | "external">("internal");
  const [newPageId, setNewPageId] = useState("");
  const [newUrl, setNewUrl] = useState("");

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  async function handleAdd() {
    if (!newLabel.trim()) return;
    try {
      const row = await createNavigationItem({
        label: newLabel.trim(),
        item_type: newType,
        page_id: newType === "internal" ? (newPageId || null) : null,
        external_url: newType === "external" ? (newUrl || null) : null,
        sort_order: items.length,
      });
      setItems((prev) => [...prev, row]);
      setNewLabel("");
      setNewPageId("");
      setNewUrl("");
      toast.success("Item added");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function handleUpdate(id: string, data: Partial<NavigationItem>) {
    try {
      const updated = await updateNavigationItem(id, data);
      setItems((prev) => prev.map((i) => (i.id === id ? updated : i)));
      toast.success("Saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  async function handleDelete(id: string) {
    try {
      await deleteNavigationItem(id);
      setItems((prev) => prev.filter((i) => i.id !== id));
      toast.success("Removed");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed");
    }
  }

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = items.findIndex((i) => i.id === active.id);
    const newIndex = items.findIndex((i) => i.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(items, oldIndex, newIndex);
    const previousItems = items;
    setItems(reordered);
    reorderNavigationItems(reordered.map((i) => i.id))
      .then(() => {
        toast.success("Order saved");
        router.refresh();
      })
      .catch((e) => {
        setItems(previousItems);
        toast.error(e instanceof Error ? e.message : "Failed to save order");
        router.refresh();
      });
  }

  return (
    <div className="space-y-6">
      <div className="rounded border border-gray-200 bg-gray-50 p-4 space-y-4">
        <h2 className="font-medium">Add item</h2>
        <div className="flex flex-wrap gap-4 items-end">
          <div>
            <Label>Label</Label>
            <Input
              value={newLabel}
              onChange={(e) => setNewLabel(e.target.value)}
              placeholder="Menu label"
            />
          </div>
          <div>
            <Label>Type</Label>
            <Select value={newType} onValueChange={(v) => setNewType(v as "internal" | "external")}>
              <SelectTrigger className="w-36"><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="internal">Internal</SelectItem>
                <SelectItem value="external">External</SelectItem>
              </SelectContent>
            </Select>
          </div>
          {newType === "internal" && (
            <div>
              <Label>Page</Label>
              <Select value={newPageId} onValueChange={(v) => setNewPageId(v ?? "")}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Select page" /></SelectTrigger>
                <SelectContent>
                  {pages.filter((p) => p.status === "published").map((p) => (
                    <SelectItem key={p.id} value={p.id}>{p.title}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          {newType === "external" && (
            <div>
              <Label>URL</Label>
              <Input
                value={newUrl}
                onChange={(e) => setNewUrl(e.target.value)}
                placeholder="https://…"
              />
            </div>
          )}
          <Button onClick={handleAdd} disabled={!newLabel.trim()}>
            <Plus className="h-4 w-4 mr-2" />
            Add
          </Button>
        </div>
      </div>

      <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
        <SortableContext items={items.map((i) => i.id)} strategy={verticalListSortingStrategy}>
          <div className="space-y-2">
            {items.map((item) => (
              <SortableNavRow
                key={item.id}
                item={item}
                pages={pages}
                onUpdate={handleUpdate}
                onDelete={handleDelete}
              />
            ))}
          </div>
        </SortableContext>
      </DndContext>
    </div>
  );
}
