-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

DROP EXTENSION pg_net;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO anon;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO authenticated;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT DELETE, INSERT, SELECT, UPDATE ON TABLES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT SELECT, USAGE ON SEQUENCES TO service_role;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public GRANT ALL ON ROUTINES TO service_role;

CREATE TABLE public.scale_notes (
  id         uuid             DEFAULT gen_random_uuid() NOT NULL,
  scale_id   uuid             NOT NULL,
  hertz      double precision NOT NULL,
  "position" integer          NOT NULL
);

ALTER TABLE public.scale_notes
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.scale_notes
  ADD CONSTRAINT scale_notes_hertz_check CHECK (hertz > 0::double precision);

ALTER TABLE public.scale_notes
  ADD CONSTRAINT scale_notes_pkey PRIMARY KEY (id);

ALTER TABLE public.scale_notes
  ADD CONSTRAINT scale_notes_position_check CHECK ("position" >= 0);

ALTER TABLE public.scale_notes
  ADD CONSTRAINT scale_notes_scale_id_hertz_key UNIQUE (scale_id, hertz);

ALTER TABLE public.scale_notes
  ADD CONSTRAINT scale_notes_scale_id_position_key UNIQUE (scale_id, "position");

GRANT ALL ON public.scale_notes TO anon;

GRANT ALL ON public.scale_notes TO authenticated;

GRANT ALL ON public.scale_notes TO service_role;

CREATE INDEX scale_notes_scale_id_idx ON public.scale_notes (scale_id);

CREATE TABLE public.scales (
  id         uuid                     DEFAULT gen_random_uuid() NOT NULL,
  owner_id   uuid                     DEFAULT auth.uid() NOT NULL,
  title      text                     DEFAULT 'Untitled Scale'::text NOT NULL,
  created_at timestamp with time zone DEFAULT now() NOT NULL,
  updated_at timestamp with time zone DEFAULT now() NOT NULL
);

CREATE POLICY "Users can insert notes into their own scales" ON public.scale_notes
  FOR INSERT
  TO authenticated
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.scales
  WHERE ((scales.id = scale_notes.scale_id) AND (scales.owner_id = ( SELECT auth.uid() AS uid))))));

CREATE POLICY "Users delete notes from their scales" ON public.scale_notes
  FOR DELETE
  TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM public.scales
  WHERE ((scales.id = scale_notes.scale_id) AND (scales.owner_id = ( SELECT auth.uid() AS uid))))));

CREATE POLICY "Users read notes from their scales" ON public.scale_notes
  FOR SELECT
  TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM public.scales
  WHERE ((scales.id = scale_notes.scale_id) AND (scales.owner_id = ( SELECT auth.uid() AS uid))))));

CREATE POLICY "Users update notes in their scales" ON public.scale_notes
  FOR UPDATE
  TO authenticated
  USING ((EXISTS ( SELECT 1
   FROM public.scales
  WHERE ((scales.id = scale_notes.scale_id) AND (scales.owner_id = ( SELECT auth.uid() AS uid))))))
  WITH CHECK ((EXISTS ( SELECT 1
   FROM public.scales
  WHERE ((scales.id = scale_notes.scale_id) AND (scales.owner_id = ( SELECT auth.uid() AS uid))))));

ALTER TABLE public.scales
  ENABLE ROW LEVEL SECURITY;

ALTER TABLE public.scales
  ADD CONSTRAINT scales_owner_id_fkey FOREIGN KEY (owner_id) REFERENCES auth.users(id) ON DELETE CASCADE;

ALTER TABLE public.scales
  ADD CONSTRAINT scales_pkey PRIMARY KEY (id);

ALTER TABLE public.scale_notes
  ADD CONSTRAINT scale_notes_scale_id_fkey FOREIGN KEY (scale_id) REFERENCES public.scales(id) ON DELETE CASCADE;

ALTER TABLE public.scales
  ADD CONSTRAINT scales_title_check CHECK (length(title) > 0);

GRANT ALL ON public.scales TO anon;

GRANT ALL ON public.scales TO authenticated;

GRANT ALL ON public.scales TO service_role;

CREATE POLICY "Users can create their own scales" ON public.scales
  FOR INSERT
  TO authenticated
  WITH CHECK ((owner_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "Users can read their own scales" ON public.scales
  FOR SELECT
  TO authenticated
  USING ((owner_id = ( SELECT auth.uid() AS uid)));

CREATE POLICY "Users manage their own scales" ON public.scales
  TO authenticated
  USING ((( SELECT auth.uid() AS uid) = owner_id))
  WITH CHECK ((( SELECT auth.uid() AS uid) = owner_id));
