
CREATE TABLE public.content_overrides (
  page_path TEXT NOT NULL,
  field_id TEXT NOT NULL,
  value TEXT NOT NULL DEFAULT '',
  updated_by UUID REFERENCES auth.users(id),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  PRIMARY KEY (page_path, field_id)
);

GRANT SELECT ON public.content_overrides TO anon;
GRANT SELECT, INSERT, UPDATE, DELETE ON public.content_overrides TO authenticated;
GRANT ALL ON public.content_overrides TO service_role;

ALTER TABLE public.content_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Public can read overrides"
  ON public.content_overrides FOR SELECT
  USING (true);

CREATE POLICY "Authenticated can insert overrides"
  ON public.content_overrides FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can update overrides"
  ON public.content_overrides FOR UPDATE
  TO authenticated
  USING (auth.uid() IS NOT NULL)
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Authenticated can delete overrides"
  ON public.content_overrides FOR DELETE
  TO authenticated
  USING (auth.uid() IS NOT NULL);

CREATE TRIGGER content_overrides_set_updated_at
  BEFORE UPDATE ON public.content_overrides
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.content_overrides;
ALTER TABLE public.content_overrides REPLICA IDENTITY FULL;
