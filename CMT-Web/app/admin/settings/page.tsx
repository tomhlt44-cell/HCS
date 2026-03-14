import { getSiteSettings } from "@/lib/cms/getSiteSettings";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const settings = await getSiteSettings();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Site settings</h1>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
