import Link from "next/link";
import { getPagesForAdmin } from "@/lib/cms/getPagesForAdmin";
import { PageTable } from "@/components/admin/PageTable";
import { Plus } from "lucide-react";

export default async function AdminPagesListPage() {
  const pages = await getPagesForAdmin();

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold text-gray-900">Pages</h1>
        <Link
          href="/admin/pages/new"
          className="inline-flex items-center justify-center rounded-md bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-800"
        >
          <Plus className="h-4 w-4 mr-2" />
          New page
        </Link>
      </div>
      <PageTable pages={pages} />
    </div>
  );
}
