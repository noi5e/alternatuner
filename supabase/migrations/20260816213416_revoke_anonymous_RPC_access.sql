-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

REVOKE ALL ON FUNCTION public.create_scale_with_notes(text, double precision[]) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.create_scale_with_notes(text, double precision[]) FROM anon;

REVOKE ALL ON FUNCTION public.update_scale_with_notes(uuid, text, double precision[]) FROM PUBLIC;

REVOKE ALL ON FUNCTION public.update_scale_with_notes(uuid, text, double precision[]) FROM anon;
