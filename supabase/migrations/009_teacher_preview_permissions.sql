begin;

-- Independent of the student's ability to start a simulacro.
create table if not exists private.bertel_teacher_preview (
  teacher_id uuid not null references public.profiles(id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  enabled boolean not null default true,
  primary key (teacher_id, assessment_id)
);
revoke all on table private.bertel_teacher_preview from public, anon, authenticated;

-- Preserve explicit grants that already existed for teachers.
insert into private.bertel_teacher_preview (teacher_id, assessment_id)
select a.user_id, a.assessment_id
from private.bertel_assessment_access a
where a.enabled and exists (
  select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
  where ur.user_id = a.user_id and r.name = 'profesor'
)
on conflict do nothing;

create or replace function private.bertel_is_active_teacher(p_user uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    join public.user_roles ur on ur.user_id = p.id
    join public.roles r on r.id = ur.role_id
    where p.id = p_user and p.status = 'active' and r.name = 'profesor'
  );
$$;
revoke all on function private.bertel_is_active_teacher(uuid) from public, anon, authenticated;

create or replace function public.bertel_teacher_preview_permissions(p_teacher uuid default null)
returns table (id uuid) language plpgsql stable security definer set search_path = ''
as $$
declare target uuid := coalesce(p_teacher, auth.uid());
begin
  if auth.uid() is null or (target <> auth.uid() and not private.is_bertel_admin()) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  return query
  select a.assessment_id
  from private.bertel_teacher_preview a
  where a.teacher_id = target and a.enabled and
    (private.is_bertel_admin() or private.bertel_is_active_teacher(auth.uid()));
end;
$$;

create or replace function public.bertel_admin_set_teacher_preview(p_teacher uuid, p_assessment uuid, p_enabled boolean)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  perform private.require_bertel_admin();

  if p_enabled is null then
    raise exception 'INVALID_PREVIEW_ACTION' using errcode = '22023';
  end if;
  if p_enabled and not private.bertel_is_active_teacher(p_teacher) then
    raise exception 'TEACHER_ROLE_REQUIRED' using errcode = '22023';
  end if;

  insert into private.bertel_teacher_preview (teacher_id, assessment_id, enabled)
  values (p_teacher, p_assessment, p_enabled)
  on conflict (teacher_id, assessment_id) do update set enabled = excluded.enabled;
end;
$$;

create or replace function public.bertel_preview_answer_keys(p_assessment uuid)
returns table (question_id uuid, correct_option_id uuid)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not private.is_bertel_admin() and not (
    private.bertel_is_active_teacher(auth.uid()) and exists (
      select 1 from private.bertel_teacher_preview grant_row
      where grant_row.teacher_id = auth.uid() and grant_row.assessment_id = p_assessment and grant_row.enabled
    )
  ) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  return query
  select aq.question_id, opt.id
  from public.assessment_questions aq
  join private.answer_keys key on key.question_id = aq.question_id
  join public.question_options opt on opt.id = key.correct_option_id and opt.question_id = aq.question_id
  where aq.assessment_id = p_assessment
  order by aq.question_order;
end;
$$;

-- Teacher preview restrictions also apply to direct question queries. Existing
-- graded reviews and student access continue to follow the rules of 008.
create or replace function private.bertel_can_read_assessment_questions(p_assessment uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and (
    private.is_bertel_admin()
    or (
      private.bertel_is_active_teacher(auth.uid())
      and (
        exists (
          select 1 from private.bertel_teacher_preview a
          where a.teacher_id = auth.uid() and a.assessment_id = p_assessment and a.enabled
        )
        or exists (
          select 1 from public.assessment_attempts a
          where a.assessment_id = p_assessment and a.status = 'clasificado'
            and private.bertel_can_read_attempt(a.student_id, a.assessment_id)
        )
      )
    )
    or (
      private.bertel_is_assessment_user(auth.uid())
      and (
        private.bertel_assessment_allowed(auth.uid(), p_assessment)
        or exists (
          select 1 from public.assessment_attempts a
          where a.assessment_id = p_assessment and a.student_id = auth.uid()
            and a.status in ('enviado', 'clasificado')
        )
      )
    )
  );
$$;

revoke all on function public.bertel_teacher_preview_permissions(uuid),
  public.bertel_admin_set_teacher_preview(uuid, uuid, boolean), public.bertel_preview_answer_keys(uuid)
  from public, anon;
grant execute on function public.bertel_teacher_preview_permissions(uuid),
  public.bertel_admin_set_teacher_preview(uuid, uuid, boolean), public.bertel_preview_answer_keys(uuid)
  to authenticated;

notify pgrst, 'reload schema';
commit;
