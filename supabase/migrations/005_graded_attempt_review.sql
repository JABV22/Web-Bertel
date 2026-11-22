begin;

create or replace function public.get_graded_attempt_review(p_attempt_id uuid)
returns table (
  question_id uuid,
  selected_option_id uuid,
  correct_option_id uuid,
  is_correct boolean
)
language plpgsql
stable
security definer
set search_path = ''
as $$
declare
  viewer_id uuid := auth.uid();
  graded_attempt public.assessment_attempts%rowtype;
begin
  select attempt.* into graded_attempt
  from public.assessment_attempts as attempt
  where attempt.id = p_attempt_id and attempt.status = 'clasificado';

  if not found or viewer_id is null or not exists (
    select 1 from public.profiles as profile
    where profile.id = viewer_id and profile.status = 'active'
  ) or not (
    graded_attempt.student_id = viewer_id
    or private.has_role(viewer_id, 'admin')
    or (private.has_role(viewer_id, 'profesor') and exists (
      select 1 from public.course_teachers as teacher
      join public.course_enrollments as enrollment on enrollment.course_id = teacher.course_id
      where teacher.teacher_id = viewer_id
        and enrollment.student_id = graded_attempt.student_id
        and enrollment.status in ('matriculado', 'semimatriculado')
    ))
  ) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  return query
  select aq.question_id, saved.selected_option_id, key.correct_option_id, saved.is_correct
  from public.assessment_questions as aq
  left join private.answer_keys as key on key.question_id = aq.question_id
  left join lateral (
    select answer.selected_option_id, answer.is_correct
    from public.student_answers as answer
    where answer.attempt_id = graded_attempt.id and answer.question_id = aq.question_id
    order by answer.answered_at desc nulls last, answer.id desc
    limit 1
  ) as saved on true
  where aq.assessment_id = graded_attempt.assessment_id
  order by aq.question_order;
end;
$$;

revoke all on function public.get_graded_attempt_review(uuid) from public, anon;
grant execute on function public.get_graded_attempt_review(uuid) to authenticated;

notify pgrst, 'reload schema';

commit;
