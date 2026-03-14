import { createClient } from "@/lib/supabase/server";
import type { NavItemWithHref } from "@/types/cms";

export async function getNavigation(): Promise<NavItemWithHref[]> {
  const supabase = await createClient();

  const { data: items, error } = await supabase
    .from("navigation_items")
    .select("*")
    .eq("is_enabled", true)
    .order("sort_order", { ascending: true });

  if (error || !items) return [];

  const pageIds = Array.from(new Set(items.map((i) => i.page_id).filter(Boolean))) as string[];
  const hrefMap: Record<string, string> = {};
  if (pageIds.length > 0) {
    const { data: pages } = await supabase
      .from("pages")
      .select("id, slug, is_homepage")
      .in("id", pageIds);
    pages?.forEach((p) => {
      const isHome = (p as { is_homepage?: boolean }).is_homepage;
      hrefMap[p.id] = isHome ? "/" : `/${p.slug}`;
    });
  }

  return items.map((item) => {
    if (item.item_type === "external" && item.external_url) {
      return { ...item, href: item.external_url };
    }
    if (item.page_id && hrefMap[item.page_id]) {
      return { ...item, href: hrefMap[item.page_id] };
    }
    return { ...item, href: "#" };
  });
}
