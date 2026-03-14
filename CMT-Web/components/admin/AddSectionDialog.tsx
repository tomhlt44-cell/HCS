"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { SECTION_TYPE_LABELS, SECTION_TYPES } from "@/lib/cms/sectionSchemas";
import type { SectionType } from "@/types/cms";
import { Plus } from "lucide-react";

type Props = {
  onAdd: (sectionType: SectionType) => void;
  disabled?: boolean;
};

export function AddSectionDialog({ onAdd, disabled }: Props) {
  const [open, setOpen] = useState(false);

  function handleSelect(type: SectionType) {
    onAdd(type);
    setOpen(false);
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <Button disabled={disabled}>
          <Plus className="h-4 w-4 mr-2" />
          Add section
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add section</DialogTitle>
        </DialogHeader>
        <div className="grid gap-2 py-4">
          {SECTION_TYPES.map((type) => (
            <Button
              key={type}
              variant="outline"
              className="justify-start"
              onClick={() => handleSelect(type)}
            >
              {SECTION_TYPE_LABELS[type]}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
