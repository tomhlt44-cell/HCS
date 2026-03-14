import { notFound } from "next/navigation";
import { getPageForAdmin } from "@/lib/cms/getPageForAdmin";
import { PageEditor } from "@/components/admin/PageEditor";

export default async function AdminPageEditorPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { page, sections } = await getPageForAdmin(id);

  if (!page) notFound();

  return <PageEditor page={page} sections={sections} />;
}
