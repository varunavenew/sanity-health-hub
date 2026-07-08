
DROP POLICY IF EXISTS "Authenticated can insert overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Authenticated can update overrides" ON public.content_overrides;
DROP POLICY IF EXISTS "Authenticated can delete overrides" ON public.content_overrides;

CREATE POLICY "Team can insert overrides"
  ON public.content_overrides FOR INSERT
  TO authenticated
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );

CREATE POLICY "Team can update overrides"
  ON public.content_overrides FOR UPDATE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  )
  WITH CHECK (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );

CREATE POLICY "Team can delete overrides"
  ON public.content_overrides FOR DELETE
  TO authenticated
  USING (
    public.has_role(auth.uid(), 'admin') OR public.has_role(auth.uid(), 'editor')
  );
