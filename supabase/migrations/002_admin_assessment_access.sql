create or replace function private.is_active_assessment_user(p_user_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select p_user_id = auth.uid()
    and exists (
      select 1 from public.profiles as profile
      where profile.id = p_user_id and profile.status = 'active'
    )
    and (
      private.has_role(p_user_id, 'estudiante')
      or private.has_role(p_user_id, 'admin')
    );
$$;

grant execute on function private.is_active_assessment_user(uuid) to authenticated;

create or replace function public.get_attempt_answers(p_attempt_id uuid)
returns table(question_id uuid, selected_option_id uuid, answered_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null or not private.is_active_assessment_user(auth.uid())
    or not exists (
      select 1 from public.assessment_attempts as attempt
      where attempt.id = p_attempt_id
        and (attempt.student_id = auth.uid() or private.has_role(auth.uid(), 'admin'))
        and attempt.status = 'en_progreso'
    ) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  return query
  select distinct on (answer.question_id)
    answer.question_id, answer.selected_option_id, answer.answered_at
  from public.student_answers as answer
  where answer.attempt_id = p_attempt_id
  order by answer.question_id, answer.answered_at desc, answer.id desc;
end;
$$;

create or replace function public.submit_assessment_attempt(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  attempt_row public.assessment_attempts%rowtype;
  question_total integer;
  correct_total integer;
  answered_total integer;
  percentage_score numeric;
begin
  if current_user_id is null or not private.is_active_assessment_user(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select * into attempt_row from public.assessment_attempts
  where id = p_attempt_id
    and (student_id = current_user_id or private.has_role(current_user_id, 'admin'))
  for update;
  if not found then raise exception 'ATTEMPT_NOT_FOUND' using errcode = 'P0002'; end if;
  if attempt_row.status in ('enviado', 'clasificado') then
    return (
      select jsonb_build_object('attempt_id', attempt_row.id, 'status', attempt_row.status,
        'result', jsonb_build_object('score', result.total_score,
          'correct_count', result.correct_count, 'incorrect_count', result.incorrect_count,
          'unanswered_count', result.unanswered_count))
      from public.assessment_results as result where result.attempt_id = attempt_row.id
    );
  end if;
  if attempt_row.status <> 'en_progreso' then
    raise exception 'ATTEMPT_NOT_ACTIVE' using errcode = '22023';
  end if;
  select count(*)::integer,
    count(*) filter (where selected.selected_option_id is not null
      and answer_key.correct_option_id = selected.selected_option_id)::integer,
    count(*) filter (where selected.selected_option_id is not null)::integer
  into question_total, correct_total, answered_total
  from public.assessment_questions as aq
  left join lateral (
    select student_answer.selected_option_id from public.student_answers as student_answer
    where student_answer.attempt_id = attempt_row.id and student_answer.question_id = aq.question_id
    order by student_answer.answered_at desc, student_answer.id desc limit 1
  ) as selected on true
  left join private.answer_keys as answer_key on answer_key.question_id = aq.question_id
  where aq.assessment_id = attempt_row.assessment_id;
  if question_total = 0 then raise exception 'ASSESSMENT_HAS_NO_QUESTIONS' using errcode = '22023'; end if;
  percentage_score := round((correct_total::numeric * 100) / question_total, 2);
  update public.student_answers as student_answer
  set is_correct = (answer_key.correct_option_id = student_answer.selected_option_id)
  from private.answer_keys as answer_key
  where student_answer.attempt_id = attempt_row.id
    and answer_key.question_id = student_answer.question_id
    and student_answer.selected_option_id is not null;
  update public.assessment_attempts set status = 'clasificado', submitted_at = coalesce(submitted_at, now()),
    score = percentage_score where id = attempt_row.id;
  insert into public.assessment_results (attempt_id, total_score, correct_count, incorrect_count, unanswered_count)
  values (attempt_row.id, percentage_score, correct_total, answered_total - correct_total,
    question_total - answered_total)
  on conflict (attempt_id) do nothing;
  return jsonb_build_object('attempt_id', attempt_row.id, 'status', 'clasificado',
    'result', jsonb_build_object('score', percentage_score, 'correct_count', correct_total,
      'incorrect_count', answered_total - correct_total, 'unanswered_count', question_total - answered_total));
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
  select * into assessment_row from public.assessments
  where id = p_assessment_id and status = 'published' for share;
  if not found then raise exception 'ASSESSMENT_NOT_AVAILABLE' using errcode = 'P0002'; end if;
  perform pg_advisory_xact_lock(hashtextextended(current_user_id::text || p_assessment_id::text, 0));
  select * into attempt_row from public.assessment_attempts
  where assessment_id = p_assessment_id and student_id = current_user_id
  order by started_at desc limit 1 for update;
  if found then
    if attempt_row.status = 'en_progreso' and attempt_row.expires_at > now() then
      return jsonb_build_object('attempt_id', attempt_row.id, 'status', attempt_row.status,
        'started_at', attempt_row.started_at, 'expires_at', attempt_row.expires_at);
    end if;
    if attempt_row.status = 'en_progreso' then
      perform public.submit_assessment_attempt(attempt_row.id);
      return jsonb_build_object('attempt_id', attempt_row.id, 'status', 'clasificado');
    end if;
    return jsonb_build_object('attempt_id', attempt_row.id, 'status', attempt_row.status,
      'started_at', attempt_row.started_at, 'expires_at', attempt_row.expires_at);
  end if;
  insert into public.assessment_attempts (assessment_id, student_id, expires_at)
  values (assessment_row.id, current_user_id,
    now() + make_interval(mins => assessment_row.duration_minutes)) returning * into attempt_row;
  return jsonb_build_object('attempt_id', attempt_row.id, 'status', attempt_row.status,
    'started_at', attempt_row.started_at, 'expires_at', attempt_row.expires_at);
end;
$$;

create or replace function public.save_assessment_answer(
  p_attempt_id uuid, p_question_id uuid, p_selected_option_id uuid
)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  attempt_row public.assessment_attempts%rowtype;
  answer_row public.student_answers%rowtype;
begin
  if current_user_id is null or not private.is_active_assessment_user(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select * into attempt_row from public.assessment_attempts
  where id = p_attempt_id
    and (student_id = current_user_id or private.has_role(current_user_id, 'admin'))
  for update;
  if not found or attempt_row.status <> 'en_progreso' then
    raise exception 'ATTEMPT_NOT_ACTIVE' using errcode = '22023';
  end if;
  if attempt_row.expires_at <= now() then
    raise exception 'ATTEMPT_EXPIRED' using errcode = '22023';
  end if;
  if not exists (
    select 1 from public.assessment_questions as aq
    where aq.assessment_id = attempt_row.assessment_id and aq.question_id = p_question_id
  ) then raise exception 'QUESTION_NOT_IN_ASSESSMENT' using errcode = '22023'; end if;
  if p_selected_option_id is not null and not exists (
    select 1 from public.question_options as question_option
    where question_option.id = p_selected_option_id and question_option.question_id = p_question_id
  ) then raise exception 'OPTION_NOT_IN_QUESTION' using errcode = '22023'; end if;
  perform pg_advisory_xact_lock(hashtextextended(p_attempt_id::text || p_question_id::text, 0));
  select * into answer_row from public.student_answers
  where attempt_id = p_attempt_id and question_id = p_question_id
  order by answered_at desc, id desc limit 1 for update;
  if found then
    update public.student_answers set selected_option_id = p_selected_option_id,
      is_correct = null, answered_at = now() where id = answer_row.id;
  else
    insert into public.student_answers (attempt_id, question_id, selected_option_id, is_correct)
    values (p_attempt_id, p_question_id, p_selected_option_id, null);
  end if;
  return jsonb_build_object('question_id', p_question_id,
    'selected_option_id', p_selected_option_id, 'saved', true);
end;
$$;
