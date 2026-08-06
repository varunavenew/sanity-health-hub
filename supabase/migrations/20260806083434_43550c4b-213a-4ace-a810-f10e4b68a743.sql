CREATE TABLE public.launch_checklist (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  seksjon text NOT NULL,
  oppgave text NOT NULL,
  ansvarlig text NOT NULL DEFAULT '',
  status text NOT NULL DEFAULT 'Ikke startet',
  ferdig boolean NOT NULL DEFAULT false,
  kommentar text NOT NULL DEFAULT '',
  sort_order integer NOT NULL DEFAULT 0,
  updated_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_by text NOT NULL DEFAULT ''
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.launch_checklist TO authenticated;
GRANT ALL ON public.launch_checklist TO service_role;

ALTER TABLE public.launch_checklist ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team can read checklist" ON public.launch_checklist FOR SELECT TO authenticated USING (true);
CREATE POLICY "Team can update checklist" ON public.launch_checklist FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Editors can insert checklist" ON public.launch_checklist FOR INSERT TO authenticated WITH CHECK (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));
CREATE POLICY "Editors can delete checklist" ON public.launch_checklist FOR DELETE TO authenticated USING (has_role(auth.uid(), 'admin'::app_role) OR has_role(auth.uid(), 'editor'::app_role));

CREATE TRIGGER trg_launch_checklist_updated_at
BEFORE UPDATE ON public.launch_checklist
FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

ALTER PUBLICATION supabase_realtime ADD TABLE public.launch_checklist;