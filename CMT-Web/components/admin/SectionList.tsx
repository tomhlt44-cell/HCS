"use client";

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
import type { PageSection } from "@/types/cms";
import { SECTION_TYPE_LABELS } from "@/lib/cms/sectionSchemas";
import { GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

function SortableSectionRow({
  section,
  isSelected,
  onSelect,
}: {
  section: PageSection;
  isSelected: boolean;
  onSelect: () => void;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "flex items-center gap-2 rounded-md border p-2 bg-white",
        isSelected && "ring-2 ring-primary",
        isDragging && "opacity-50"
      )}
    >
      <button
        type="button"
        className="touch-none cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600"
        {...attributes}
        {...listeners}
      >
        <GripVertical className="h-4 w-4" />
      </button>
      <button
        type="button"
        className="flex-1 text-left text-sm font-medium"
        onClick={onSelect}
      >
        {SECTION_TYPE_LABELS[section.section_type as keyof typeof SECTION_TYPE_LABELS] ?? section.section_type}
      </button>
    </div>
  );
}

export function SectionList({
  sections,
  selectedId,
  onSelect,
  onReorder,
}: {
  sections: PageSection[];
  selectedId: string | null;
  onSelect: (id: string | null) => void;
  onReorder: (orderedIds: string[]) => void;
}) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    const oldIndex = sections.findIndex((s) => s.id === active.id);
    const newIndex = sections.findIndex((s) => s.id === over.id);
    if (oldIndex === -1 || newIndex === -1) return;
    const reordered = arrayMove(sections, oldIndex, newIndex);
    onReorder(reordered.map((s) => s.id));
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={sections.map((s) => s.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="space-y-2">
          {sections.map((section) => (
            <SortableSectionRow
              key={section.id}
              section={section}
              isSelected={selectedId === section.id}
              onSelect={() => onSelect(selectedId === section.id ? null : section.id)}
            />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  );
}
