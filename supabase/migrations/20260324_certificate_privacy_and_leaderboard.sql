DROP POLICY IF EXISTS "Allow public verification of certificates" ON public.certificates;

CREATE POLICY "Allow owners to read their own certificates"
ON public.certificates
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

CREATE OR REPLACE FUNCTION public.verify_certificate(certificate_uuid uuid)
RETURNS TABLE (
  id uuid,
  user_id uuid,
  rank_level text,
  issued_at timestamp with time zone,
  metadata jsonb
) AS $$
BEGIN
  RETURN QUERY
  SELECT c.id, c.user_id, c.rank_level, c.issued_at, c.metadata
  FROM public.certificates AS c
  WHERE c.id = certificate_uuid;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.verify_certificate(uuid) TO anon, authenticated;

CREATE OR REPLACE FUNCTION public.issue_certificate()
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
  computed_rank text := 'Beginner';
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

  computed_rank := CASE
    WHEN current_xp >= 3000 THEN 'Advanced'
    WHEN current_xp >= 1000 THEN 'Intermediate'
    ELSE 'Beginner'
  END;

  RETURN QUERY
  INSERT INTO public.certificates (user_id, rank_level, metadata)
  VALUES (
    current_user_id,
    computed_rank,
    jsonb_build_object(
      'display_name', current_name,
      'xp', current_xp
    )
  )
  ON CONFLICT (user_id) DO UPDATE
    SET rank_level = EXCLUDED.rank_level,
        metadata = public.certificates.metadata || EXCLUDED.metadata
  RETURNING certificates.id, certificates.user_id, certificates.rank_level, certificates.issued_at, certificates.metadata;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.issue_certificate() TO authenticated;

CREATE OR REPLACE FUNCTION public.get_leaderboard()
RETURNS TABLE (
  user_id uuid,
  display_name text,
  avatar_url text,
  xp integer,
  solved_count integer,
  streak integer,
  wallet numeric
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    p.id,
    COALESCE(NULLIF(trim(p.display_name), ''), 'Python Learner') AS display_name,
    COALESCE(p.avatar_url, '') AS avatar_url,
    COALESCE(p.xp, 0) AS xp,
    jsonb_array_length(COALESCE(p.solved_problems, '[]'::jsonb)) AS solved_count,
    COALESCE(p.streak, 0) AS streak,
    COALESCE(p.wallet, 0) AS wallet
  FROM public.profiles AS p
  WHERE COALESCE(p.profile_complete, false) = true
  ORDER BY COALESCE(p.xp, 0) DESC, COALESCE(p.streak, 0) DESC, COALESCE(p.wallet, 0) DESC
  LIMIT 100;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

GRANT EXECUTE ON FUNCTION public.get_leaderboard() TO anon, authenticated;
