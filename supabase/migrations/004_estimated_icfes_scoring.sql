-- Estimate the Saber 11-style 0-500 score from area-level accuracy.
-- assessment_sections.weight is an optional relative area weight.
-- If omitted, use the methodology's standard relative weights: 3 for the
-- four core areas and 1 for English. Partial exams normalize by evaluated
-- areas only; the final score is rounded once, at the end.
create or replace function public.submit_assessment_attempt(p_attempt_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  attempt_row public.assessment_attempts%rowtype;
  question_total integer;
  answered_total integer;
  correct_total integer;
  invalid_key_total integer;
  missing_weight_total integer;
  unassigned_question_total integer;
  weight_total numeric;
  weighted_area_total numeric;
  estimated_score numeric(7, 2);
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

  if attempt_row.status not in ('en_progreso', 'enviado') then
    raise exception 'ATTEMPT_NOT_ACTIVE' using errcode = '22023';
  end if;

  if attempt_row.status = 'en_progreso' and not exists (
    select 1
    from public.assessment_questions as question
    where question.assessment_id = attempt_row.assessment_id
  ) then
    raise exception 'ASSESSMENT_HAS_NO_QUESTIONS' using errcode = '22023';
  end if;

  select count(*)::integer into question_total
  from public.assessment_questions as question
  where question.assessment_id = attempt_row.assessment_id;

  if question_total = 0 then
    raise exception 'ASSESSMENT_HAS_NO_QUESTIONS' using errcode = '22023';
  end if;

  select count(*)::integer into unassigned_question_total
  from public.assessment_questions as question
  left join public.assessment_sections as section
    on section.id = question.section_id
   and section.assessment_id = question.assessment_id
  where question.assessment_id = attempt_row.assessment_id
    and section.id is null;

  if unassigned_question_total > 0 then
    raise exception 'ASSESSMENT_QUESTION_SECTION_REQUIRED' using errcode = '22023';
  end if;

  with question_scores as (
    select
      section.id as section_id,
      section.title,
      section.weight,
      count(*)::numeric as area_question_total,
      count(*) filter (
        where selected.selected_option_id is not null
      )::integer as area_answered_total,
      count(*) filter (
        where selected.selected_option_id is not null
          and answer_key.correct_option_id = selected.selected_option_id
      )::integer as area_correct_total,
      count(*) filter (
        where answer_key.question_id is null
      )::integer as area_invalid_key_total
    from public.assessment_questions as question
    join public.assessment_sections as section
      on section.id = question.section_id
     and section.assessment_id = question.assessment_id
    left join lateral (
      select answer.selected_option_id
      from public.student_answers as answer
      where answer.attempt_id = p_attempt_id
        and answer.question_id = question.question_id
      order by answer.answered_at desc, answer.id desc
      limit 1
    ) as selected on true
    left join private.answer_keys as answer_key
      on answer_key.question_id = question.question_id
    where question.assessment_id = attempt_row.assessment_id
    group by section.id, section.title, section.weight
  ),
  weighted_sections as (
    select
      area_question_total,
      area_answered_total,
      area_correct_total,
      area_invalid_key_total,
      coalesce(
        weight,
        case
          when position('matematic' in translate(lower(btrim(title)), 'áéíóúüñ', 'aeiouun')) > 0
            then 3::numeric / 13
          when position('lectura' in translate(lower(btrim(title)), 'áéíóúüñ', 'aeiouun')) > 0
            or position('critical reading' in lower(btrim(title))) > 0
            then 3::numeric / 13
          when position('ciencias naturales' in translate(lower(btrim(title)), 'áéíóúüñ', 'aeiouun')) > 0
            or position('natural science' in lower(btrim(title))) > 0
            then 3::numeric / 13
          when position('social' in translate(lower(btrim(title)), 'áéíóúüñ', 'aeiouun')) > 0
            or position('civic' in lower(btrim(title))) > 0
            then 3::numeric / 13
          when position('ingles' in translate(lower(btrim(title)), 'áéíóúüñ', 'aeiouun')) > 0
            or position('english' in lower(btrim(title))) > 0
            then 1::numeric / 13
          else null
        end
      ) as scoring_weight
    from question_scores
  )
  select
    coalesce(sum(area_answered_total), 0)::integer,
    coalesce(sum(area_correct_total), 0)::integer,
    coalesce(sum(area_invalid_key_total), 0)::integer,
    count(*) filter (where scoring_weight is null)::integer,
    coalesce(sum(scoring_weight), 0),
    coalesce(
      sum(
        (area_correct_total::numeric / nullif(area_question_total, 0))
        * 100
        * scoring_weight
      ),
      0
    )
  into
    answered_total,
    correct_total,
    invalid_key_total,
    missing_weight_total,
    weight_total,
    weighted_area_total
  from weighted_sections;

  if invalid_key_total > 0 then
    raise exception 'ASSESSMENT_HAS_INVALID_ANSWER_KEYS' using errcode = '22023';
  end if;

  if missing_weight_total > 0 then
    raise exception 'ASSESSMENT_SECTION_WEIGHT_REQUIRED' using errcode = '22023';
  end if;

  if weight_total <= 0 then
    raise exception 'ASSESSMENT_HAS_NO_SCORABLE_AREAS' using errcode = '22023';
  end if;

  estimated_score := round((weighted_area_total / weight_total) * 5, 0);

  update public.student_answers as answer
  set is_correct = (answer_key.correct_option_id = answer.selected_option_id)
  from private.answer_keys as answer_key
  where answer.attempt_id = p_attempt_id
    and answer.question_id = answer_key.question_id
    and answer.selected_option_id is not null;

  update public.assessment_attempts
  set status = 'clasificado',
      submitted_at = coalesce(submitted_at, now()),
      score = estimated_score
  where id = attempt_row.id;

  insert into public.assessment_results (
    attempt_id,
    total_score,
    correct_count,
    incorrect_count,
    unanswered_count
  )
  values (
    attempt_row.id,
    estimated_score,
    correct_total,
    answered_total - correct_total,
    question_total - answered_total
  )
  on conflict (attempt_id) do nothing;

  return jsonb_build_object(
    'attempt_id', attempt_row.id,
    'status', 'clasificado',
    'result', jsonb_build_object(
      'score', estimated_score,
      'correct_count', correct_total,
      'incorrect_count', answered_total - correct_total,
      'unanswered_count', question_total - answered_total
    )
  );
end;
$$;

revoke all on function public.submit_assessment_attempt(uuid) from public, anon;
grant execute on function public.submit_assessment_attempt(uuid) to authenticated;
