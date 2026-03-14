/**
 * Seed script for Capitol Media Training site content.
 * Run with: npx dotenv -e .env.local -- tsx scripts/seed-capitol-site.ts
 * Or: node -r dotenv/config scripts/seed-capitol-site.ts dotenv_config_path=.env.local
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */

import { config } from "dotenv";
config({ path: ".env.local" });
import { createClient } from "@supabase/supabase-js";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
if (!url || !serviceKey) {
  console.error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY");
  process.exit(1);
}

const supabase = createClient(url, serviceKey);

async function seed() {
  console.log("Seeding Capitol Media Training site...");

  // 1. Site settings
  const { data: existingSettings } = await supabase.from("site_settings").select("id").limit(1).single();
  if (!existingSettings?.id) {
    await supabase.from("site_settings").insert({
      site_name: "Capitol Media Training",
      default_seo_title: "Capitol Media Training | Deliver Your Message Like a TV Anchor",
      default_seo_description:
        "Media training for professionals. Led by seasoned experts who have advised political leaders, Fortune 100 executives, and government officials.",
      contact_email: "Terry@holtstrategy.com",
      contact_phone: "(202) 641-4530",
      footer_text:
        "Capitol Media Training helps professionals deliver their message with confidence. Washington, DC.",
    });
    console.log("  - site_settings inserted");
  } else {
    console.log("  - site_settings already exists");
  }

  // 2. Homepage
  const { data: existingHome } = await supabase
    .from("pages")
    .select("id")
    .eq("is_homepage", true)
    .single();

  let homepageId: string;

  if (existingHome?.id) {
    homepageId = existingHome.id;
    console.log("  - homepage already exists");
  } else {
    const { data: homePage, error: pageErr } = await supabase
      .from("pages")
      .insert({
        title: "Home",
        slug: "home",
        status: "published",
        is_homepage: true,
        published_at: new Date().toISOString(),
      })
      .select("id")
      .single();

    if (pageErr) {
      console.error("  - failed to create homepage:", pageErr.message);
      return;
    }
    homepageId = homePage!.id;
    console.log("  - homepage created");
  }

  // 3. Sections (only if none exist for this page)
  const { data: existingSections } = await supabase
    .from("page_sections")
    .select("id")
    .eq("page_id", homepageId)
    .limit(1);

  if (existingSections?.length) {
    console.log("  - page_sections already exist for homepage");
  } else {
    const sections = [
      {
        page_id: homepageId,
        section_type: "hero",
        position: 0,
        content_json: {
          eyebrow: "Washington, DC",
          headline: "Deliver your message like a TV anchor.",
          subheadline:
            "Media training for executives and leaders. Our trainers have advised political leaders, Fortune 100 C-Suite executives, White House cabinet secretaries, and U.S. House and Senate leaders.",
          primaryCtaLabel: "Our Services",
          primaryCtaHref: "#services",
          alignment: "center",
        },
      },
      {
        page_id: homepageId,
        section_type: "rich_text",
        position: 1,
        content_json: {
          sectionTitle: "Why Capitol Media Training",
          body: "<p>What distinguishes Capitol Media Training is that our trainers have direct experience—they've given speeches, done national TV interviews, and worked on political campaigns from both in front of and behind the camera.</p><p>We focus on teaching clients the fundamentals of media relations, reputation-building, and delivering clear, persuasive messages while driving thought leadership across influencer networks and media platforms.</p>",
          layout: "image-right",
        },
      },
      {
        page_id: homepageId,
        section_type: "services",
        position: 2,
        content_json: {
          sectionTitle: "Our Services",
          intro: "Four comprehensive media and communication training programs.",
          items: [
            {
              title: "Inside the Newsroom",
              description:
                "Learn the inner workings of modern newsrooms, effective strategies for working with journalists, how to identify newsworthy stories, techniques for pitching reporters, and how to become a valuable media source.",
              ctaLabel: "Learn more",
              ctaHref: "#services",
            },
            {
              title: "Inside the War Room",
              description:
                "High-stakes interview and media engagement training. Rapid-response methods, positioning yourself effectively within conflicts, developing measurable media outreach strategies, and crafting compelling talking points.",
              ctaLabel: "Learn more",
              ctaHref: "#services",
            },
            {
              title: "Inside the Green Room",
              description:
                "Interview preparation that covers everything from logistical preparation to mastering soundbites. Control your narrative and make every interview count.",
              ctaLabel: "Learn more",
              ctaHref: "#services",
            },
            {
              title: "Inside the Board Room",
              description:
                "Executive presence for leaders: analyze audiences, optimize presentations for maximum impact, and craft compelling narratives with confident delivery.",
              ctaLabel: "Learn more",
              ctaHref: "#services",
            },
          ],
        },
      },
      {
        page_id: homepageId,
        section_type: "team",
        position: 3,
        content_json: {
          sectionTitle: "Our Team",
          intro: "Seasoned professionals with direct experience in media, politics, and communications.",
          members: [
            {
              name: "Terry Holt",
              role: "Founder",
              bio: "Political and policy strategist with over 25 years of experience. Former national spokesperson for presidential campaigns and senior advisor to the RNC.",
            },
            {
              name: "Jackie Gulley",
              role: "Co-Founder",
              bio: "Full-time entrepreneur focused on messaging strategy and visibility. Helps clients build brand and authenticity.",
            },
            {
              name: "Lisa Camooso Miller",
              role: "Featured Speaker",
              bio: "Communications leader with over 20 years in government, political campaigns, and advocacy. RNC communications director experience.",
            },
            {
              name: "Emily Miller",
              role: "Featured Speaker",
              bio: "Public affairs and media consultant. Former Deputy Press Secretary at U.S. Department of State and network television producer.",
            },
          ],
        },
      },
      {
        page_id: homepageId,
        section_type: "cta_band",
        position: 4,
        content_json: {
          headline: "Ready to deliver your message with confidence?",
          body: "Get in touch to discuss media training for your team or organization.",
          ctaLabel: "Contact Us",
          ctaHref: "#contact",
        },
      },
      {
        page_id: homepageId,
        section_type: "contact",
        position: 5,
        content_json: {
          sectionTitle: "Connect With Us",
          email: "Terry@holtstrategy.com",
          phone: "(202) 641-4530",
        },
      },
      {
        page_id: homepageId,
        section_type: "footer",
        position: 6,
        content_json: {
          text: "Capitol Media Training. Washington, DC.",
          showSocials: false,
        },
      },
    ];

    for (const section of sections) {
      await supabase.from("page_sections").insert(section);
    }
    console.log("  - page_sections inserted:", sections.length);
  }

  // 4. Navigation items
  const { data: existingNav } = await supabase.from("navigation_items").select("id").limit(1);
  if (existingNav?.length) {
    console.log("  - navigation_items already exist");
  } else {
    await supabase.from("navigation_items").insert([
      { label: "Home", item_type: "internal", page_id: homepageId, sort_order: 0 },
      { label: "Services", item_type: "internal", page_id: homepageId, sort_order: 1 },
      { label: "Contact", item_type: "internal", page_id: homepageId, sort_order: 2 },
    ]);
    console.log("  - navigation_items inserted");
  }

  console.log("Seed complete.");
}

seed().catch((e) => {
  console.error(e);
  process.exit(1);
});
