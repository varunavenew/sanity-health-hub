
-- 1. Roles infrastructure
DO $$ BEGIN
  CREATE TYPE public.app_role AS ENUM ('admin', 'editor', 'user');
EXCEPTION WHEN duplicate_object THEN NULL; END $$;

CREATE TABLE IF NOT EXISTS public.user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role public.app_role NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, role)
);

GRANT SELECT ON public.user_roles TO authenticated;
GRANT ALL ON public.user_roles TO service_role;

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role public.app_role)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

CREATE POLICY "Users can view own roles"
  ON public.user_roles FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- 2. updated_at helper
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger LANGUAGE plpgsql SET search_path = public AS $$
BEGIN NEW.updated_at = now(); RETURN NEW; END $$;

-- 3. treatment_categories (top-level services)
CREATE TABLE public.treatment_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sanity_id text UNIQUE,
  slug text NOT NULL UNIQUE,
  title text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  long_description text NOT NULL DEFAULT '',
  hero_image_url text,
  icon text,
  color text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

GRANT SELECT ON public.treatment_categories TO anon, authenticated;
GRANT ALL ON public.treatment_categories TO service_role;

ALTER TABLE public.treatment_categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published categories"
  ON public.treatment_categories FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage categories"
  ON public.treatment_categories FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_treatment_categories_updated_at
  BEFORE UPDATE ON public.treatment_categories
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_treatment_categories_sort ON public.treatment_categories (sort_order);

-- 4. treatments (sub-treatments)
CREATE TABLE public.treatments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  sanity_id text UNIQUE,
  category_id uuid REFERENCES public.treatment_categories(id) ON DELETE CASCADE,
  slug text NOT NULL,
  title text NOT NULL,
  short_description text NOT NULL DEFAULT '',
  content jsonb NOT NULL DEFAULT '{}'::jsonb,
  symptoms jsonb NOT NULL DEFAULT '[]'::jsonb,
  surgery jsonb NOT NULL DEFAULT '[]'::jsonb,
  faq jsonb NOT NULL DEFAULT '[]'::jsonb,
  hero_image_url text,
  sort_order integer NOT NULL DEFAULT 0,
  is_published boolean NOT NULL DEFAULT true,
  meta_title text,
  meta_description text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (category_id, slug)
);

GRANT SELECT ON public.treatments TO anon, authenticated;
GRANT ALL ON public.treatments TO service_role;

ALTER TABLE public.treatments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read published treatments"
  ON public.treatments FOR SELECT TO anon, authenticated
  USING (is_published = true OR public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage treatments"
  ON public.treatments FOR ALL TO authenticated
  USING (public.has_role(auth.uid(), 'admin'))
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE TRIGGER trg_treatments_updated_at
  BEFORE UPDATE ON public.treatments
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE INDEX idx_treatments_category ON public.treatments (category_id, sort_order);
CREATE INDEX idx_treatments_slug ON public.treatments (slug);
