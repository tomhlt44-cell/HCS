import Link from "next/link";
import { getSiteSettings } from "@/lib/cms/getSiteSettings";
import { getNavigation } from "@/lib/cms/getNavigation";

export async function Footer() {
  const [settings, navItems] = await Promise.all([
    getSiteSettings(),
    getNavigation(),
  ]);

  const footerText = settings?.footer_text;
  const logoUrl = settings?.logo_url;
  const siteName = settings?.site_name ?? "Capitol Media Training";
  const contactEmail = settings?.contact_email;
  const contactPhone = settings?.contact_phone;

  return (
    <footer className="border-t border-gray-200 bg-gray-50 section-pad-sm">
      <div className="container-wide">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            {logoUrl ? (
              <img src={logoUrl} alt="" className="h-8 w-auto" />
            ) : (
              <span className="font-semibold text-gray-900">{siteName}</span>
            )}
            {footerText && (
              <p className="text-sm text-gray-600 max-w-md">{footerText}</p>
            )}
          </div>
          <div className="flex flex-wrap items-center gap-6">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className="text-sm text-gray-600 hover:text-gray-900"
              >
                {item.label}
              </Link>
            ))}
            {contactEmail && (
              <a href={`mailto:${contactEmail}`} className="text-sm text-gray-600 hover:text-gray-900">
                Contact
              </a>
            )}
          </div>
        </div>
        {(contactEmail || contactPhone) && (
          <div className="mt-4 pt-4 border-t border-gray-200 text-center sm:text-left text-sm text-gray-500">
            {contactEmail && <a href={`mailto:${contactEmail}`}>{contactEmail}</a>}
            {contactEmail && contactPhone && " · "}
            {contactPhone && <a href={`tel:${contactPhone.replace(/\D/g, "")}`}>{contactPhone}</a>}
          </div>
        )}
      </div>
    </footer>
  );
}
