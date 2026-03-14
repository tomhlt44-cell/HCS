import Link from "next/link";
import { getNavigation } from "@/lib/cms/getNavigation";
import { getSiteSettings } from "@/lib/cms/getSiteSettings";

export async function Header() {
  const [navItems, settings] = await Promise.all([
    getNavigation(),
    getSiteSettings(),
  ]);

  const logoUrl = settings?.logo_url;
  const siteName = settings?.site_name ?? "Capitol Media Training";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/95 backdrop-blur">
      <div className="container-wide flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-semibold text-gray-900">
          {logoUrl ? (
            <img src={logoUrl} alt={siteName} className="h-8 w-auto" />
          ) : (
            <span>{siteName}</span>
          )}
        </Link>
        <nav className="hidden sm:flex items-center gap-8">
          {navItems.map((item) => (
            <Link
              key={item.id}
              href={item.href}
              className="text-sm font-medium text-gray-600 hover:text-gray-900"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
