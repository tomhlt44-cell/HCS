"use client";

import { useState } from "react";
import type { Page } from "@/types/database";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";

type Props = {
  page: Page;
  onSave: (data: Partial<Page>) => void;
};

export function SeoPanel({ page, onSave }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <Collapsible open={open} onOpenChange={setOpen}>
      <CollapsibleTrigger className="flex items-center gap-2 font-medium text-sm">
        SEO & metadata
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </CollapsibleTrigger>
      <CollapsibleContent className="pt-4 space-y-4">
        <div>
          <Label>SEO title</Label>
          <Input
            value={page.seo_title ?? ""}
            onChange={(e) => onSave({ seo_title: e.target.value || null })}
            onBlur={(e) => onSave({ seo_title: e.target.value || null })}
          />
        </div>
        <div>
          <Label>Meta description</Label>
          <Textarea
            value={page.seo_description ?? ""}
            onChange={(e) => onSave({ seo_description: e.target.value || null })}
            onBlur={(e) => onSave({ seo_description: e.target.value || null })}
            rows={2}
          />
        </div>
        <div>
          <Label>OG title</Label>
          <Input
            value={page.og_title ?? ""}
            onChange={(e) => onSave({ og_title: e.target.value || null })}
            onBlur={(e) => onSave({ og_title: e.target.value || null })}
          />
        </div>
        <div>
          <Label>OG description</Label>
          <Textarea
            value={page.og_description ?? ""}
            onChange={(e) => onSave({ og_description: e.target.value || null })}
            onBlur={(e) => onSave({ og_description: e.target.value || null })}
            rows={2}
          />
        </div>
        <div>
          <Label>Canonical URL</Label>
          <Input
            value={page.canonical_url ?? ""}
            onChange={(e) => onSave({ canonical_url: e.target.value || null })}
            onBlur={(e) => onSave({ canonical_url: e.target.value || null })}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={page.noindex}
            onCheckedChange={(v) => onSave({ noindex: v })}
          />
          <Label>Noindex (hide from search engines)</Label>
        </div>
      </CollapsibleContent>
    </Collapsible>
  );
}
