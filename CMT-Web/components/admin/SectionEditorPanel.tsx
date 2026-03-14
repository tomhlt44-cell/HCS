"use client";

import type { PageSection } from "@/types/cms";
import type { SectionContent } from "@/types/cms";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

type Props = {
  section: PageSection;
  onSave: (content: SectionContent) => void;
  onDelete?: () => void;
};

export function SectionEditorPanel({ section, onSave, onDelete }: Props) {
  const c = (section.content_json || {}) as Record<string, unknown>;

  function update(field: string, value: unknown) {
    onSave({ ...c, [field]: value } as SectionContent);
  }

  const type = section.section_type;

  if (type === "hero") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Hero</h3>
        <div>
          <Label>Eyebrow</Label>
          <Input
            value={(c.eyebrow as string) ?? ""}
            onChange={(e) => update("eyebrow", e.target.value)}
          />
        </div>
        <div>
          <Label>Headline</Label>
          <Input
            value={(c.headline as string) ?? ""}
            onChange={(e) => update("headline", e.target.value)}
          />
        </div>
        <div>
          <Label>Subheadline</Label>
          <Textarea
            value={(c.subheadline as string) ?? ""}
            onChange={(e) => update("subheadline", e.target.value)}
          />
        </div>
        <div>
          <Label>Primary CTA label</Label>
          <Input
            value={(c.primaryCtaLabel as string) ?? ""}
            onChange={(e) => update("primaryCtaLabel", e.target.value)}
          />
        </div>
        <div>
          <Label>Primary CTA href</Label>
          <Input
            value={(c.primaryCtaHref as string) ?? ""}
            onChange={(e) => update("primaryCtaHref", e.target.value)}
          />
        </div>
        <div>
          <Label>Background image URL</Label>
          <Input
            value={(c.backgroundImageUrl as string) ?? ""}
            onChange={(e) => update("backgroundImageUrl", e.target.value)}
          />
        </div>
        {onDelete && (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            Remove section
          </Button>
        )}
      </div>
    );
  }

  if (type === "rich_text") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Rich text</h3>
        <div>
          <Label>Section title</Label>
          <Input
            value={(c.sectionTitle as string) ?? ""}
            onChange={(e) => update("sectionTitle", e.target.value)}
          />
        </div>
        <div>
          <Label>Body (HTML)</Label>
          <Textarea
            value={(c.body as string) ?? ""}
            onChange={(e) => update("body", e.target.value)}
            rows={6}
          />
        </div>
        <div>
          <Label>Image URL</Label>
          <Input
            value={(c.imageUrl as string) ?? ""}
            onChange={(e) => update("imageUrl", e.target.value)}
          />
        </div>
        <div>
          <Label>Layout</Label>
          <Select
            value={(c.layout as string) ?? "image-right"}
            onValueChange={(v) => update("layout", v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="image-left">Image left</SelectItem>
              <SelectItem value="image-right">Image right</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {onDelete && (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            Remove section
          </Button>
        )}
      </div>
    );
  }

  if (type === "cta_band") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">CTA band</h3>
        <div>
          <Label>Headline</Label>
          <Input
            value={(c.headline as string) ?? ""}
            onChange={(e) => update("headline", e.target.value)}
          />
        </div>
        <div>
          <Label>Body</Label>
          <Textarea
            value={(c.body as string) ?? ""}
            onChange={(e) => update("body", e.target.value)}
          />
        </div>
        <div>
          <Label>CTA label</Label>
          <Input
            value={(c.ctaLabel as string) ?? ""}
            onChange={(e) => update("ctaLabel", e.target.value)}
          />
        </div>
        <div>
          <Label>CTA href</Label>
          <Input
            value={(c.ctaHref as string) ?? ""}
            onChange={(e) => update("ctaHref", e.target.value)}
          />
        </div>
        {onDelete && (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            Remove section
          </Button>
        )}
      </div>
    );
  }

  if (type === "contact") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Contact</h3>
        <div>
          <Label>Section title</Label>
          <Input
            value={(c.sectionTitle as string) ?? ""}
            onChange={(e) => update("sectionTitle", e.target.value)}
          />
        </div>
        <div>
          <Label>Email</Label>
          <Input
            value={(c.email as string) ?? ""}
            onChange={(e) => update("email", e.target.value)}
          />
        </div>
        <div>
          <Label>Phone</Label>
          <Input
            value={(c.phone as string) ?? ""}
            onChange={(e) => update("phone", e.target.value)}
          />
        </div>
        <div>
          <Label>Address</Label>
          <Textarea
            value={(c.address as string) ?? ""}
            onChange={(e) => update("address", e.target.value)}
          />
        </div>
        {onDelete && (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            Remove section
          </Button>
        )}
      </div>
    );
  }

  if (type === "spacer") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Spacer</h3>
        <div>
          <Label>Size</Label>
          <Select
            value={(c.size as string) ?? "md"}
            onValueChange={(v) => update("size", v)}
          >
            <SelectTrigger><SelectValue /></SelectTrigger>
            <SelectContent>
              <SelectItem value="sm">Small</SelectItem>
              <SelectItem value="md">Medium</SelectItem>
              <SelectItem value="lg">Large</SelectItem>
            </SelectContent>
          </Select>
        </div>
        {onDelete && (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            Remove section
          </Button>
        )}
      </div>
    );
  }

  if (type === "footer") {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold">Footer</h3>
        <div>
          <Label>Logo URL</Label>
          <Input
            value={(c.logoUrl as string) ?? ""}
            onChange={(e) => update("logoUrl", e.target.value)}
          />
        </div>
        <div>
          <Label>Text</Label>
          <Textarea
            value={(c.text as string) ?? ""}
            onChange={(e) => update("text", e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Switch
            checked={(c.showSocials as boolean) ?? true}
            onCheckedChange={(v) => update("showSocials", v)}
          />
          <Label>Show socials</Label>
        </div>
        {onDelete && (
          <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
            Remove section
          </Button>
        )}
      </div>
    );
  }

  // Services, team, faq, image_text_split, quote, logo_strip: show minimal editor or JSON hint
  return (
    <div className="space-y-4">
      <h3 className="font-semibold capitalize">{type.replace(/_/g, " ")}</h3>
      <p className="text-sm text-gray-500">
        Edit this section type in the panel. Fields for this type can be added here.
      </p>
      {onDelete && (
        <Button type="button" variant="destructive" size="sm" onClick={onDelete}>
          Remove section
        </Button>
      )}
    </div>
  );
}
