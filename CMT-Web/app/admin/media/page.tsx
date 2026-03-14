import { getMediaAssets } from "@/lib/cms/media";
import { MediaLibrary } from "@/components/admin/MediaLibrary";

export default async function AdminMediaPage() {
  const assets = await getMediaAssets();

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Media library</h1>
      <MediaLibrary initialAssets={assets} />
    </div>
  );
}
