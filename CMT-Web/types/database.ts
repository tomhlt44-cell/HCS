export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ProfileRole = "admin" | "editor";
export type PageStatus = "draft" | "published" | "archived";
export type NavItemType = "internal" | "external";

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          email: string | null;
          full_name: string | null;
          role: ProfileRole;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          email?: string | null;
          full_name?: string | null;
          role?: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string | null;
          full_name?: string | null;
          role?: ProfileRole;
          created_at?: string;
          updated_at?: string;
        };
      };
      pages: {
        Row: {
          id: string;
          title: string;
          slug: string;
          page_type: string;
          status: PageStatus;
          excerpt: string | null;
          seo_title: string | null;
          seo_description: string | null;
          og_title: string | null;
          og_description: string | null;
          canonical_url: string | null;
          noindex: boolean;
          in_navigation: boolean;
          nav_label: string | null;
          nav_order: number | null;
          is_homepage: boolean;
          published_at: string | null;
          created_by: string | null;
          updated_by: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          title: string;
          slug: string;
          page_type?: string;
          status?: PageStatus;
          excerpt?: string | null;
          seo_title?: string | null;
          seo_description?: string | null;
          og_title?: string | null;
          og_description?: string | null;
          canonical_url?: string | null;
          noindex?: boolean;
          in_navigation?: boolean;
          nav_label?: string | null;
          nav_order?: number | null;
          is_homepage?: boolean;
          published_at?: string | null;
          created_by?: string | null;
          updated_by?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["pages"]["Insert"]> & { id: string };
      };
      page_sections: {
        Row: {
          id: string;
          page_id: string;
          section_type: string;
          section_key: string | null;
          position: number;
          is_enabled: boolean;
          content_json: Json;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          section_type: string;
          section_key?: string | null;
          position: number;
          is_enabled?: boolean;
          content_json?: Json;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["page_sections"]["Insert"]> & { id: string };
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string | null;
          default_seo_title: string | null;
          default_seo_description: string | null;
          default_og_image: string | null;
          contact_email: string | null;
          contact_phone: string | null;
          footer_text: string | null;
          logo_url: string | null;
          favicon_url: string | null;
          social_json: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name?: string | null;
          default_seo_title?: string | null;
          default_seo_description?: string | null;
          default_og_image?: string | null;
          contact_email?: string | null;
          contact_phone?: string | null;
          footer_text?: string | null;
          logo_url?: string | null;
          favicon_url?: string | null;
          social_json?: Json;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["site_settings"]["Insert"]> & { id: string };
      };
      media_assets: {
        Row: {
          id: string;
          file_name: string;
          file_path: string;
          file_url: string;
          alt_text: string | null;
          mime_type: string | null;
          file_size: number | null;
          width: number | null;
          height: number | null;
          uploaded_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          file_name: string;
          file_path: string;
          file_url: string;
          alt_text?: string | null;
          mime_type?: string | null;
          file_size?: number | null;
          width?: number | null;
          height?: number | null;
          uploaded_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["media_assets"]["Insert"]> & { id: string };
      };
      navigation_items: {
        Row: {
          id: string;
          label: string;
          item_type: NavItemType;
          page_id: string | null;
          external_url: string | null;
          sort_order: number;
          is_enabled: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          label: string;
          item_type?: NavItemType;
          page_id?: string | null;
          external_url?: string | null;
          sort_order: number;
          is_enabled?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["navigation_items"]["Insert"]> & { id: string };
      };
      page_revisions: {
        Row: {
          id: string;
          page_id: string;
          revision_json: Json;
          created_by: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          page_id: string;
          revision_json: Json;
          created_by?: string | null;
          created_at?: string;
        };
        Update: Partial<Database["public"]["Tables"]["page_revisions"]["Insert"]> & { id: string };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Page = Database["public"]["Tables"]["pages"]["Row"];
export type PageSection = Database["public"]["Tables"]["page_sections"]["Row"];
export type SiteSettings = Database["public"]["Tables"]["site_settings"]["Row"];
export type MediaAsset = Database["public"]["Tables"]["media_assets"]["Row"];
export type NavigationItem = Database["public"]["Tables"]["navigation_items"]["Row"];
export type PageRevision = Database["public"]["Tables"]["page_revisions"]["Row"];
