import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <h1 className="text-4xl font-bold text-gray-900">404</h1>
      <p className="mt-4 text-gray-600">This page could not be found.</p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center rounded-md bg-gray-900 px-6 py-3 text-white font-medium hover:bg-gray-800"
      >
        Go home
      </Link>
    </div>
  );
}
