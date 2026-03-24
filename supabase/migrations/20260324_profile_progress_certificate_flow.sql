ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS completed_lessons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS completed_exercises jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS unlocked_lessons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS activity_map jsonb NOT NULL DEFAULT '{}'::jsonb,
  ADD COLUMN IF NOT EXISTS last_coding_date text,
  ADD COLUMN IF NOT EXISTS previous_streak integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS streak_broken_date text,
  ADD COLUMN IF NOT EXISTS last_star_date text,
  ADD COLUMN IF NOT EXISTS time_spent integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS profile_complete boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS bio text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS avatar_url text NOT NULL DEFAULT '',
  ADD COLUMN IF NOT EXISTS skills jsonb NOT NULL DEFAULT '[]'::jsonb;

CREATE UNIQUE INDEX IF NOT EXISTS certificates_user_id_key ON public.certificates (user_id);

CREATE OR REPLACE FUNCTION public.issue_certificate(requested_rank text DEFAULT NULL)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  rank_level text,
  issued_at timestamp with time zone,
  metadata jsonb
) AS $$
DECLARE
  current_user_id uuid := auth.uid();
  current_xp integer := 0;
  current_name text := 'Python Student';
  effective_rank text := COALESCE(NULLIF(trim(requested_rank), ''), 'Beginner');
BEGIN
  IF current_user_id IS NULL THEN
    RAISE EXCEPTION 'Authentication required';
  END IF;

  SELECT
    COALESCE(xp, 0),
    COALESCE(NULLIF(trim(display_name), ''), split_part(COALESCE(email, ''), '@', 1), 'Python Student')
  INTO current_xp, current_name
  FROM public.profiles
  WHERE profiles.id = current_user_id;

  IF current_xp < 100 THEN
    RAISE EXCEPTION 'You need at least 100 XP to unlock a certificate';
  END IF;

  RETURN QUERY
  INSERT INTO public.certificates (user_id, rank_level, metadata)
  VALUES (
    current_user_id,
    effective_rank,
    jsonb_build_object(
      'display_name', current_name,
      'xp', current_xp
    )
  )
  ON CONFLICT (user_id) DO UPDATE
    SET rank_level = EXCLUDED.rank_level,
        metadata = public.certificates.metadata || EXCLUDED.metadata,
        issued_at = COALESCE(public.certificates.issued_at, timezone('utc'::text, now()))
  RETURNING certificates.id, certificates.user_id, certificates.rank_level, certificates.issued_at, certificates.metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.issue_certificate(text) TO authenticated;
