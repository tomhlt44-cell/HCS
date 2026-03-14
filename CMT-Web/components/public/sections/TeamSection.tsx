import type { PageSection } from "@/types/cms";
import type { TeamContent } from "@/types/cms";
import Link from "next/link";

export function TeamSection({ section }: { section: PageSection }) {
  const c = (section.content_json || {}) as unknown as TeamContent;
  const members = c.members ?? [];

  return (
    <section className="section-pad bg-white">
      <div className="container-wide">
        {c.sectionTitle && (
          <h2 className="text-3xl font-bold text-gray-900 tracking-tight text-center">
            {c.sectionTitle}
          </h2>
        )}
        {c.intro && (
          <p className="mt-4 text-lg text-gray-600 text-center max-w-2xl mx-auto">
            {c.intro}
          </p>
        )}
        <div className="mt-12 grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {members.map((member, i) => (
            <div key={i} className="text-center">
              {member.imageUrl ? (
                <img
                  src={member.imageUrl}
                  alt={member.name}
                  className="mx-auto h-48 w-48 rounded-full object-cover"
                />
              ) : (
                <div className="mx-auto h-48 w-48 rounded-full bg-gray-200 flex items-center justify-center text-gray-400 text-4xl font-semibold">
                  {member.name.charAt(0)}
                </div>
              )}
              <h3 className="mt-4 text-xl font-semibold text-gray-900">{member.name}</h3>
              <p className="text-gray-600">{member.role}</p>
              {member.bio && (
                <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
              )}
              {member.ctaLabel && member.ctaHref && (
                <Link
                  href={member.ctaHref}
                  className="mt-3 inline-flex font-medium text-gray-900 hover:underline"
                >
                  {member.ctaLabel}
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
