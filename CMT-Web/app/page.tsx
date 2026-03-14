import { getHomepage } from "@/lib/cms/getHomepage";
import { Header } from "@/components/public/Header";
import { Footer } from "@/components/public/Footer";
import { SectionRenderer } from "@/components/public/SectionRenderer";
import Link from "next/link";

export default async function HomePage() {
  const page = await getHomepage();

  if (!page) {
    return (
      <>
        <Header />
        <main className="min-h-[60vh] flex flex-col items-center justify-center container-narrow section-pad">
          <h1 className="text-3xl font-bold text-gray-900">Welcome</h1>
          <p className="mt-4 text-gray-600 text-center">
            No homepage has been published yet. Set a page as homepage and publish it in the admin.
          </p>
          <Link href="/admin" className="mt-6 text-gray-900 font-medium hover:underline">
            Go to Admin →
          </Link>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header />
      <main>
        <SectionRenderer sections={page.sections} />
      </main>
      <Footer />
    </>
  );
}
