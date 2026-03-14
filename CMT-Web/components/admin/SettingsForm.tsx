"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import type { SiteSettings } from "@/types/database";
import { updateSiteSettings } from "@/lib/cms/siteSettings";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

export function SettingsForm({ initialSettings }: { initialSettings: SiteSettings | null }) {
  const router = useRouter();
  const [settings, setSettings] = useState(initialSettings ?? ({} as SiteSettings));

  async function handleSave(fields: Partial<SiteSettings>) {
    try {
      const updated = await updateSiteSettings(fields);
      setSettings(updated);
      toast.success("Settings saved");
      router.refresh();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Failed to save");
    }
  }

  return (
    <div className="max-w-2xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>General</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Site name</Label>
            <Input
              value={settings.site_name ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, site_name: e.target.value }))}
              onBlur={(e) => handleSave({ site_name: e.target.value || null })}
            />
          </div>
          <div>
            <Label>Contact email</Label>
            <Input
              type="email"
              value={settings.contact_email ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, contact_email: e.target.value }))}
              onBlur={(e) => handleSave({ contact_email: e.target.value || null })}
            />
          </div>
          <div>
            <Label>Contact phone</Label>
            <Input
              value={settings.contact_phone ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, contact_phone: e.target.value }))}
              onBlur={(e) => handleSave({ contact_phone: e.target.value || null })}
            />
          </div>
          <div>
            <Label>Footer text</Label>
            <Textarea
              value={settings.footer_text ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, footer_text: e.target.value }))}
              onBlur={(e) => handleSave({ footer_text: e.target.value || null })}
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Branding</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Logo URL</Label>
            <Input
              value={settings.logo_url ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, logo_url: e.target.value }))}
              onBlur={(e) => handleSave({ logo_url: e.target.value || null })}
            />
          </div>
          <div>
            <Label>Favicon URL</Label>
            <Input
              value={settings.favicon_url ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, favicon_url: e.target.value }))}
              onBlur={(e) => handleSave({ favicon_url: e.target.value || null })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Default SEO</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Default SEO title</Label>
            <Input
              value={settings.default_seo_title ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, default_seo_title: e.target.value }))}
              onBlur={(e) => handleSave({ default_seo_title: e.target.value || null })}
            />
          </div>
          <div>
            <Label>Default meta description</Label>
            <Textarea
              value={settings.default_seo_description ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, default_seo_description: e.target.value }))}
              onBlur={(e) => handleSave({ default_seo_description: e.target.value || null })}
              rows={2}
            />
          </div>
          <div>
            <Label>Default OG image URL</Label>
            <Input
              value={settings.default_og_image ?? ""}
              onChange={(e) => setSettings((s) => ({ ...s, default_og_image: e.target.value }))}
              onBlur={(e) => handleSave({ default_og_image: e.target.value || null })}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
