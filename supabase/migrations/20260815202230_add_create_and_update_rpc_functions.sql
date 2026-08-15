-- Migration unit 1: schema_changes
-- Transaction mode: transactional
-- Boundary reason: default

SET check_function_bodies = false;

ALTER TABLE public.scale_notes
  DROP CONSTRAINT scale_notes_hertz_check;

ALTER TABLE public.scales
  DROP CONSTRAINT scales_title_check;

CREATE FUNCTION public.create_scale_with_notes (
  p_title text,
  p_notes double precision[] DEFAULT ARRAY[]::double precision[]
)
  RETURNS public.scales
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
declare
  v_scale public.scales;
begin
  if auth.uid() is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication required.';
  end if;

  if p_notes is null then
    raise exception using
      errcode = '22023',
      message = 'p_notes must be a double precision array.';
  end if;

  insert into public.scales (owner_id, title)
  values (
    auth.uid(),
    coalesce(nullif(btrim(p_title), ''), 'Untitled Scale')
  )
  returning * into v_scale;

  insert into public.scale_notes (scale_id, position, hertz)
  select
    v_scale.id,
    (note.ordinality - 1)::integer,
    note.hertz
  from unnest(p_notes)
    with ordinality as note(hertz, ordinality);

  return v_scale;
end;
$function$;

GRANT ALL ON FUNCTION public.create_scale_with_notes(text, double precision[]) TO anon;

GRANT ALL ON FUNCTION public.create_scale_with_notes(text, double precision[]) TO authenticated;

GRANT ALL ON FUNCTION public.create_scale_with_notes(text, double precision[]) TO service_role;

CREATE FUNCTION public.update_scale_with_notes (
  p_scale_id uuid,
  p_title    text,
  p_notes    double precision[] DEFAULT ARRAY[]::double precision[]
)
  RETURNS public.scales
  LANGUAGE plpgsql
  SET search_path TO ''
  AS $function$
declare
  v_scale public.scales;
begin
  if auth.uid() is null then
    raise exception using
      errcode = '42501',
      message = 'Authentication required';
  end if;

  if p_notes is null then
    raise exception using
    errcode = '22023',
    message = 'p_notes must be a double precision array';
  end if;

  -- Lock the parent so concurrent saves of this scale are serialized.
  select *
  into v_scale
  from public.scales
  where id = p_scale_id
    and owner_id = auth.uid()
  for update;

  if not found then
    raise exception using
      errcode = 'P0002',
      message = 'Scale not found';
  end if;

  update public.scales
  set
    title = coalesce(nullif(btrim(p_title), ''), 'Untitled Scale'),
    updated_at = now()
  where id = p_scale_id
  returning * into v_scale;

  delete from public.scale_notes
  where scale_id = p_scale_id;

  insert into public.scale_notes (scale_id, position, hertz)
  select
    p_scale_id,
    (note.ordinality - 1)::integer,
    note.hertz
  from unnest(p_notes)
    with ordinality as note(hertz, ordinality);

  return v_scale;
end;
$function$;

GRANT ALL ON FUNCTION public.update_scale_with_notes(uuid, text, double precision[]) TO anon;

GRANT ALL ON FUNCTION public.update_scale_with_notes(uuid, text, double precision[]) TO authenticated;

GRANT ALL ON FUNCTION public.update_scale_with_notes(uuid, text, double precision[]) TO service_role;

ALTER TABLE public.scale_notes
  ADD CONSTRAINT scale_notes_hertz_check CHECK (hertz > 0::double precision AND hertz < 'Infinity'::double precision);

ALTER TABLE public.scales
  ADD CONSTRAINT scales_title_check CHECK (length(btrim(title)) >= 1 AND length(btrim(title)) <= 200);
