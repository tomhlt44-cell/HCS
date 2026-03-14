# Capitol Media Training — Website & CMS

Next.js 14 marketing site with an internal page management system (CMS). The public site is driven by Supabase; admins manage pages, sections, navigation, media, and site settings without code.

## Tech stack

- **Frontend:** Next.js 14 (App Router), TypeScript, Tailwind CSS, shadcn/ui, lucide-react, React Hook Form, Zod, dnd-kit
- **Backend:** Supabase (PostgreSQL, Auth, Storage, RLS)

## Prerequisites

- Node.js 18+
- A Supabase project

## Setup

### 1. Environment

Copy the example env and set your Supabase keys:

```bash
cp .env.local.example .env.local
```

Edit `.env.local`:

- `NEXT_PUBLIC_SUPABASE_URL` — Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` — anon/public key
- `SUPABASE_SERVICE_ROLE_KEY` — service role key (server-only; never expose to the client)
- Optional: `NEXT_PUBLIC_SITE_URL` — site base URL for sitemap (e.g. `https://www.capitolmediatraining.com`)

### 2. Database

Apply the schema and RLS:

1. In the Supabase Dashboard, open **SQL Editor**.
2. Run the SQL in `supabase/migrations/20240313000000_initial_cms_schema.sql`.

Or, with the Supabase CLI (see **Supabase CLI** below).

### Supabase CLI

The project is set up for the [Supabase CLI](https://supabase.com/docs/guides/cli):

- **Already done:** `supabase init` (creates `supabase/config.toml`) and `supabase link --project-ref <ref>` (links to your remote project).
- **Apply migrations:** Run `supabase db push` from the project root. If the remote database already has some of these tables (e.g. `profiles`), the migration will fail; in that case apply the SQL in `supabase/migrations/20240313000000_initial_cms_schema.sql` manually in the Dashboard SQL Editor, or fix the remote schema and run `db push` again.
- **Other commands:** `supabase migration list`, `supabase db diff`, etc.

### 3. Storage bucket (for media)

In the Supabase Dashboard:

1. Go to **Storage** and create a bucket named **`media`**.
2. Set it to **Public** so image URLs work on the site.
3. In **Policies**, add a policy so authenticated users (with admin/editor profile) can upload; or rely on your app using the service role for uploads.

The app’s upload flow uses the service role to insert into Storage and into `media_assets`; the bucket must exist and be public for image URLs to resolve.

### 4. Admin user and profile

1. In Supabase **Authentication**, create a user (e.g. email + password).
2. The migration adds a trigger that creates a row in `public.profiles` on signup. Ensure the new user has a profile with `role` = `admin` or `editor` (e.g. update in **Table Editor** or run:

   ```sql
   UPDATE public.profiles SET role = 'admin' WHERE email = 'your@email.com';
   ```

### 5. Seed content (optional)

To load the Capitol Media Training homepage and nav:

```bash
npm run seed
```

This uses `.env.local` and requires `NEXT_PUBLIC_SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY`. It is idempotent: safe to run more than once.

### 6. Run the app

```bash
npm install
npm run dev
```

- Public site: [http://localhost:3000](http://localhost:3000)
- Admin: [http://localhost:3000/admin](http://localhost:3000/admin) (sign in with your Supabase user)

## Project structure

- `app/` — Next.js routes (public pages, `[slug]`, `admin/*`, `login`)
- `app/admin/` — CMS UI (dashboard, pages, media, navigation, settings)
- `components/public/` — Header, Footer, section components for the marketing site
- `components/admin/` — Page editor, section list, media picker, nav editor, settings form
- `lib/cms/` — Data helpers (getPageBySlug, getHomepage, savePage, saveSection, media, navigation, siteSettings)
- `lib/supabase/` — Supabase client (browser, server, admin)
- `lib/auth/` — requireAdmin for protected routes
- `types/` — CMS and database types
- `supabase/migrations/` — SQL schema and RLS

## Content and images

- **Copy:** The seed script uses recovered public copy (tagline, services, team bios, contact). You can change any of this in the admin after seeding.
- **Images:** The seed does not upload images. Hero, team photos, and logos need to be added in the admin **Media** area, then assigned in the page/section editors. If you have existing assets, upload them in Media and update the homepage (or other pages) to use those URLs.

## Manual steps after deploy

1. Create the `media` bucket in Supabase and set it to public if not already.
2. Ensure at least one user has an admin/editor profile.
3. Run `npm run seed` if you want the default homepage and nav, or create pages and nav manually in the admin.

## Scripts

- `npm run dev` — Start dev server
- `npm run build` — Production build
- `npm run start` — Start production server
- `npm run lint` — Run ESLint
- `npm run seed` — Seed Capitol Media Training content (idempotent)
