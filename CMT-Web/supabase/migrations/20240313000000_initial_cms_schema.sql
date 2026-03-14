-- CMT-Web: Initial CMS schema
-- Run this migration in your Supabase project (Dashboard SQL Editor or supabase db push).

-- Trigger to set updated_at
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- profiles: linked to auth.users
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text,
  full_name text,
  role text NOT NULL DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- pages
CREATE TABLE public.pages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL UNIQUE,
  page_type text NOT NULL DEFAULT 'standard',
  status text NOT NULL DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
  excerpt text,
  seo_title text,
  seo_description text,
  og_title text,
  og_description text,
  canonical_url text,
  noindex boolean NOT NULL DEFAULT false,
  in_navigation boolean NOT NULL DEFAULT false,
  nav_label text,
  nav_order integer,
  is_homepage boolean NOT NULL DEFAULT false,
  published_at timestamptz,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  updated_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_pages_slug ON public.pages(slug);
CREATE INDEX idx_pages_status ON public.pages(status);
CREATE INDEX idx_pages_is_homepage ON public.pages(is_homepage) WHERE is_homepage = true;
CREATE INDEX idx_pages_nav_order ON public.pages(nav_order) WHERE in_navigation = true;

CREATE TRIGGER pages_updated_at
  BEFORE UPDATE ON public.pages
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- page_sections
CREATE TABLE public.page_sections (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  section_type text NOT NULL,
  section_key text,
  position integer NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  content_json jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_sections_page_id ON public.page_sections(page_id);
CREATE INDEX idx_page_sections_page_position ON public.page_sections(page_id, position);

CREATE TRIGGER page_sections_updated_at
  BEFORE UPDATE ON public.page_sections
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- site_settings (singleton)
CREATE TABLE public.site_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  site_name text,
  default_seo_title text,
  default_seo_description text,
  default_og_image text,
  contact_email text,
  contact_phone text,
  footer_text text,
  logo_url text,
  favicon_url text,
  social_json jsonb NOT NULL DEFAULT '{}',
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE TRIGGER site_settings_updated_at
  BEFORE UPDATE ON public.site_settings
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- media_assets
CREATE TABLE public.media_assets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_url text NOT NULL,
  alt_text text,
  mime_type text,
  file_size integer,
  width integer,
  height integer,
  uploaded_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_media_assets_file_name ON public.media_assets(file_name);

-- navigation_items
CREATE TABLE public.navigation_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  label text NOT NULL,
  item_type text NOT NULL DEFAULT 'internal' CHECK (item_type IN ('internal', 'external')),
  page_id uuid REFERENCES public.pages(id) ON DELETE SET NULL,
  external_url text,
  sort_order integer NOT NULL,
  is_enabled boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_navigation_items_sort ON public.navigation_items(sort_order);

CREATE TRIGGER navigation_items_updated_at
  BEFORE UPDATE ON public.navigation_items
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

-- page_revisions (optional)
CREATE TABLE public.page_revisions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  page_id uuid NOT NULL REFERENCES public.pages(id) ON DELETE CASCADE,
  revision_json jsonb NOT NULL,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_page_revisions_page_id ON public.page_revisions(page_id);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.pages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_sections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.site_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.media_assets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.navigation_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.page_revisions ENABLE ROW LEVEL SECURITY;

-- Helper: true if current user has a profile with role admin or editor
CREATE OR REPLACE FUNCTION public.is_cms_editor()
RETURNS boolean AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.profiles
    WHERE id = auth.uid() AND role IN ('admin', 'editor')
  );
$$ LANGUAGE sql SECURITY DEFINER STABLE;

-- profiles: users can read/update own profile; editors can read all
CREATE POLICY "Users can read own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Service role can manage profiles" ON public.profiles
  FOR ALL USING (auth.jwt() ->> 'role' = 'service_role');

-- pages: public can read published pages only; editors can read and manage all
CREATE POLICY "Public can read published pages" ON public.pages
  FOR SELECT USING (status = 'published');

CREATE POLICY "Editors can manage pages" ON public.pages
  FOR ALL USING (public.is_cms_editor());

-- page_sections: public can read sections of published pages only (via join in app; allow read for published page context)
-- Simpler: allow public SELECT where the page is published. We do this by allowing SELECT for all and filtering in app,
-- OR we use a policy that checks page status. Subquery:
CREATE POLICY "Public can read sections of published pages" ON public.page_sections
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM public.pages p
      WHERE p.id = page_sections.page_id AND p.status = 'published'
    )
  );

CREATE POLICY "Editors can manage page_sections" ON public.page_sections
  FOR ALL USING (public.is_cms_editor());

-- site_settings: public read; editors write
CREATE POLICY "Public can read site_settings" ON public.site_settings
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Editors can update site_settings" ON public.site_settings
  FOR ALL USING (public.is_cms_editor());

-- media_assets: public read (for rendering); editors insert/update/delete
CREATE POLICY "Public can read media_assets" ON public.media_assets
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Editors can manage media_assets" ON public.media_assets
  FOR ALL USING (public.is_cms_editor());

-- navigation_items: public read; editors manage
CREATE POLICY "Public can read navigation_items" ON public.navigation_items
  FOR SELECT TO anon, authenticated USING (true);

CREATE POLICY "Editors can manage navigation_items" ON public.navigation_items
  FOR ALL USING (public.is_cms_editor());

-- page_revisions: editors only
CREATE POLICY "Editors can manage page_revisions" ON public.page_revisions
  FOR ALL USING (public.is_cms_editor());

-- Trigger: create profile on signup (optional but useful)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', NEW.raw_user_meta_data ->> 'name'),
    COALESCE((NEW.raw_user_meta_data ->> 'role')::text, 'editor')
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Storage bucket for media (run in Supabase Dashboard or via API if needed)
-- INSERT INTO storage.buckets (id, name, public) VALUES ('media', 'media', true);
-- Storage RLS: allow public read, authenticated upload/delete (handled in app with service role or auth check)
