-- DOC-05 allows multiple attempts. Keep submitted work ungraded until the
-- owner approves the estimated 0-500 scoring methodology.
create or replace function public.submit_assessment_attempt(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  attempt_row public.assessment_attempts%rowtype;
begin
  if current_user_id is null or not private.is_active_assessment_user(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  select * into attempt_row
  from public.assessment_attempts
  where id = p_attempt_id
    and (student_id = current_user_id or private.has_role(current_user_id, 'admin'))
  for update;

  if not found then
    raise exception 'ATTEMPT_NOT_FOUND' using errcode = 'P0002';
  end if;

  if attempt_row.status = 'enviado' then
    return jsonb_build_object(
      'attempt_id', attempt_row.id,
      'status', attempt_row.status,
      'score_pending', true
    );
  end if;

  if attempt_row.status = 'clasificado' then
    if not exists (
      select 1
      from public.assessment_results as result
      where result.attempt_id = attempt_row.id
    ) then
      raise exception 'ATTEMPT_RESULT_NOT_FOUND' using errcode = 'P0002';
    end if;

    return (
      select jsonb_build_object(
        'attempt_id', attempt_row.id,
        'status', attempt_row.status,
        'result', jsonb_build_object(
          'score', result.total_score,
          'correct_count', result.correct_count,
          'incorrect_count', result.incorrect_count,
          'unanswered_count', result.unanswered_count
        )
      )
      from public.assessment_results as result
      where result.attempt_id = attempt_row.id
    );
  end if;

  if attempt_row.status <> 'en_progreso' then
    raise exception 'ATTEMPT_NOT_ACTIVE' using errcode = '22023';
  end if;

  if not exists (
    select 1
    from public.assessment_questions as question
    where question.assessment_id = attempt_row.assessment_id
  ) then
    raise exception 'ASSESSMENT_HAS_NO_QUESTIONS' using errcode = '22023';
  end if;

  update public.assessment_attempts
  set status = 'enviado',
      submitted_at = coalesce(submitted_at, now())
  where id = attempt_row.id;

  return jsonb_build_object(
    'attempt_id', attempt_row.id,
    'status', 'enviado',
    'score_pending', true
  );
end;
$$;

create or replace function public.start_assessment(p_assessment_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  assessment_row public.assessments%rowtype;
  attempt_row public.assessment_attempts%rowtype;
begin
  if current_user_id is null or not private.is_active_assessment_user(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  select * into assessment_row
  from public.assessments
  where id = p_assessment_id and status = 'published'
  for share;

  if not found then
    raise exception 'ASSESSMENT_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  perform pg_advisory_xact_lock(
    hashtextextended(current_user_id::text || p_assessment_id::text, 0)
  );

  select * into attempt_row
  from public.assessment_attempts
  where assessment_id = p_assessment_id
    and student_id = current_user_id
    and status = 'en_progreso'
    and (expires_at is null or expires_at > now())
  order by started_at desc
  limit 1
  for update;

  if found then
    return jsonb_build_object(
      'attempt_id', attempt_row.id,
      'status', attempt_row.status,
      'started_at', attempt_row.started_at,
      'expires_at', attempt_row.expires_at
    );
  end if;

  select * into attempt_row
  from public.assessment_attempts
  where assessment_id = p_assessment_id
    and student_id = current_user_id
    and status = 'en_progreso'
    and expires_at <= now()
  order by started_at desc
  limit 1
  for update;

  if found then
    perform public.submit_assessment_attempt(attempt_row.id);
  end if;

  insert into public.assessment_attempts (
    assessment_id, student_id, expires_at
  )
  values (
    assessment_row.id,
    current_user_id,
    now() + make_interval(mins => assessment_row.duration_minutes)
  )
  returning * into attempt_row;

  return jsonb_build_object(
    'attempt_id', attempt_row.id,
    'status', attempt_row.status,
    'started_at', attempt_row.started_at,
    'expires_at', attempt_row.expires_at
  );
end;
$$;

revoke all on function public.submit_assessment_attempt(uuid) from public, anon;
revoke all on function public.start_assessment(uuid) from public, anon;
grant execute on function public.submit_assessment_attempt(uuid) to authenticated;
grant execute on function public.start_assessment(uuid) to authenticated;
