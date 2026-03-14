import { getNavigationItemsForAdmin } from "@/lib/cms/navigation";
import { getPagesForAdmin } from "@/lib/cms/getPagesForAdmin";
import { NavigationEditor } from "@/components/admin/NavigationEditor";

export default async function AdminNavigationPage() {
  const [navItems, pages] = await Promise.all([
    getNavigationItemsForAdmin(),
    getPagesForAdmin(),
  ]);

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Navigation</h1>
      <NavigationEditor initialItems={navItems} pages={pages} />
    </div>
  );
}
