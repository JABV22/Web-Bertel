-- Security and transactional exam operations for the owner-provided schema.
-- The source tables must already exist in Supabase.
insert into
    public.roles (name)
values ('admin'),
    ('profesor'),
    ('estudiante')
on conflict (name) do nothing;

create schema if not exists private;

revoke all on schema private from public, anon, authenticated;

grant usage on schema private to authenticated;

create or replace function private.has_role(p_user_id uuid, p_role_name text)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.user_roles as user_role
    join public.roles as role on role.id = user_role.role_id
    where user_role.user_id = p_user_id and role.name = p_role_name
  );
$$;

create or replace function private.is_active_student(p_user_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles as profile
    where profile.id = p_user_id and profile.status = 'active'
  ) and private.has_role(p_user_id, 'estudiante');
$$;

grant
execute on function private.has_role (uuid, text) to authenticated;

grant
execute on function private.is_active_student (uuid) to authenticated;

alter table public.profiles enable row level security;

alter table public.roles enable row level security;

alter table public.user_roles enable row level security;

alter table public.questions enable row level security;

alter table public.question_options enable row level security;

alter table public.assessments enable row level security;

alter table public.assessment_sections enable row level security;

alter table public.assessment_questions enable row level security;

alter table public.assessment_attempts enable row level security;

alter table public.student_answers enable row level security;

alter table public.assessment_results enable row level security;

create policy profiles_read_self_or_admin on public.profiles for
select to authenticated using (
        id = (
            select auth.uid ()
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
    );

create policy user_roles_read_self_or_admin on public.user_roles for
select to authenticated using (
        user_id = (
            select auth.uid ()
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
    );

create policy user_roles_admin_manage on public.user_roles for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy roles_read_authenticated on public.roles for
select to authenticated using (true);

alter table public.academic_periods enable row level security;

alter table public.subjects enable row level security;

alter table public.programs enable row level security;

alter table public.courses enable row level security;

alter table public.student_groups enable row level security;

alter table public.course_enrollments enable row level security;

alter table public.course_teachers enable row level security;

alter table public.question_assets enable row level security;

alter table public.competencies enable row level security;

alter table public.topics enable row level security;

alter table public.subtopics enable row level security;

alter table public.question_topics enable row level security;

create policy assessments_read_own_attempt on public.assessments for
select to authenticated using (
        exists (
            select 1
            from public.assessment_attempts as attempt
            where
                attempt.assessment_id = assessments.id
                and attempt.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy sections_read_own_attempt on public.assessment_sections for
select to authenticated using (
        exists (
            select 1
            from public.assessment_attempts as attempt
            where
                attempt.assessment_id = assessment_sections.assessment_id
                and attempt.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy assessment_questions_read_own_attempt on public.assessment_questions for
select to authenticated using (
        exists (
            select 1
            from public.assessment_attempts as attempt
            where
                attempt.assessment_id = assessment_questions.assessment_id
                and attempt.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy questions_read_own_attempt on public.questions for
select to authenticated using (
        exists (
            select 1
            from public.assessment_questions as aq
                join public.assessment_attempts as attempt on attempt.assessment_id = aq.assessment_id
            where
                aq.question_id = questions.id
                and attempt.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy options_read_own_attempt on public.question_options for
select to authenticated using (
        exists (
            select 1
            from public.assessment_questions as aq
                join public.assessment_attempts as attempt on attempt.assessment_id = aq.assessment_id
            where
                aq.question_id = question_options.question_id
                and attempt.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy question_assets_read_own_attempt on public.question_assets for
select to authenticated using (
        exists (
            select 1
            from public.assessment_questions as aq
                join public.assessment_attempts as attempt on attempt.assessment_id = aq.assessment_id
            where
                aq.question_id = question_assets.question_id
                and attempt.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy question_topics_read_own_attempt on public.question_topics for
select to authenticated using (
        exists (
            select 1
            from public.assessment_questions as aq
                join public.assessment_attempts as attempt on attempt.assessment_id = aq.assessment_id
            where
                aq.question_id = question_topics.question_id
                and attempt.student_id = (
                    select auth.uid ()
                )
        )
    );

create or replace function public.set_question_answer_key(
    p_question_id uuid, p_correct_option_id uuid
)
returns void language plpgsql security definer set search_path = ''
as $$
begin
    if auth.uid() is null or not private.has_role(auth.uid(), 'admin') then
        raise exception 'NOT_AUTHORIZED' using errcode = '42501';
    end if;
    if not exists (select 1 from public.question_options as question_option
        where question_option.id = p_correct_option_id
            and question_option.question_id = p_question_id) then
        raise exception 'OPTION_NOT_IN_QUESTION' using errcode = '22023';
    end if;
    if exists (select 1 from public.assessment_questions as aq
        join public.assessment_attempts as attempt on attempt.assessment_id = aq.assessment_id
        where aq.question_id = p_question_id) then
        raise exception 'QUESTION_KEY_LOCKED_BY_ATTEMPT' using errcode = '22023';
    end if;
    insert into private.answer_keys (question_id, correct_option_id)
    values (p_question_id, p_correct_option_id)
    on conflict (question_id) do update set correct_option_id = excluded.correct_option_id;
end;
$$;

revoke all on function public.set_question_answer_key (uuid, uuid)
from public, anon;

grant
execute on function public.set_question_answer_key (uuid, uuid) to authenticated;

create or replace function private.validate_assessment_content()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
    target_assessment_id uuid;
begin
    if tg_table_name = 'assessments' then
        if new.status <> 'published' then return new; end if;
        target_assessment_id := new.id;
    else
        target_assessment_id := new.assessment_id;
    end if;
    if not exists (select 1 from public.assessment_questions as aq
        where aq.assessment_id = target_assessment_id) then
        raise exception 'ASSESSMENT_HAS_NO_QUESTIONS' using errcode = '22023';
    end if;
    if exists (
        select 1 from public.assessment_questions as aq
        left join private.answer_keys as answer_key on answer_key.question_id = aq.question_id
        where aq.assessment_id = target_assessment_id
            and (answer_key.question_id is null or not exists (
                select 1 from public.question_options as question_option
                where question_option.id = answer_key.correct_option_id
                    and question_option.question_id = aq.question_id
            ))
    ) then raise exception 'ASSESSMENT_HAS_INVALID_ANSWER_KEYS' using errcode = '22023'; end if;
    return new;
end;
$$;

create trigger assessment_publish_requires_valid_questions
before insert or update of status on public.assessments
for each row when (new.status = 'published')
execute function private.validate_assessment_content();

create trigger assessment_attempt_requires_valid_questions
before insert on public.assessment_attempts
for each row execute function private.validate_assessment_content();

create or replace function private.prevent_question_change_after_attempt()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
    target_question_id uuid;
begin
    if tg_table_name = 'assessment_questions' then
        if tg_op <> 'INSERT' and exists (select 1 from public.assessment_attempts as attempt
            where attempt.assessment_id = old.assessment_id) then
            raise exception 'ASSESSMENT_CONTENT_LOCKED_BY_ATTEMPT' using errcode = '22023';
        end if;
        if tg_op <> 'DELETE' and exists (select 1 from public.assessment_attempts as attempt
            where attempt.assessment_id = new.assessment_id) then
            raise exception 'ASSESSMENT_CONTENT_LOCKED_BY_ATTEMPT' using errcode = '22023';
        end if;
    else
        if tg_op = 'DELETE' then
            target_question_id := case when tg_table_name = 'questions' then old.id else old.question_id end;
        else
            target_question_id := case when tg_table_name = 'questions' then new.id else new.question_id end;
        end if;
        if exists (select 1 from public.assessment_questions as aq
            join public.assessment_attempts as attempt on attempt.assessment_id = aq.assessment_id
            where aq.question_id = target_question_id) then
            raise exception 'QUESTION_CONTENT_LOCKED_BY_ATTEMPT' using errcode = '22023';
        end if;
    end if;
    if tg_op = 'DELETE' then return old; end if;
    return new;
end;
$$;

create trigger assessment_questions_lock_after_attempt
before insert or update or delete on public.assessment_questions
for each row execute function private.prevent_question_change_after_attempt();

create trigger question_text_lock_after_attempt
before update or delete on public.questions
for each row execute function private.prevent_question_change_after_attempt();

create trigger question_options_lock_after_attempt
before insert or update or delete on public.question_options
for each row execute function private.prevent_question_change_after_attempt();

grant
select
    on public.academic_periods,
    public.subjects,
    public.programs,
    public.courses,
    public.student_groups,
    public.course_enrollments,
    public.course_teachers,
    public.question_assets,
    public.competencies,
    public.topics,
    public.subtopics,
    public.question_topics to authenticated;

grant insert,
update,
delete on public.profiles,
public.academic_periods,
public.subjects,
public.programs,
public.courses,
public.student_groups,
public.course_enrollments,
public.course_teachers,
public.question_assets,
public.competencies,
public.topics,
public.subtopics,
public.question_topics to authenticated;

create policy profiles_admin_manage on public.profiles for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy academic_periods_read_authenticated on public.academic_periods for
select to authenticated using (true);

create policy subjects_read_authenticated on public.subjects for
select to authenticated using (true);

create policy programs_read_authenticated on public.programs for
select to authenticated using (true);

create policy academic_periods_admin_manage on public.academic_periods for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy subjects_admin_manage on public.subjects for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy programs_admin_manage on public.programs for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy courses_read_associated_users on public.courses for
select to authenticated using (
        private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
        or exists (
            select 1
            from public.course_teachers as ct
            where
                ct.course_id = courses.id
                and ct.teacher_id = (
                    select auth.uid ()
                )
        )
        or exists (
            select 1
            from public.course_enrollments as enrollment
            where
                enrollment.course_id = courses.id
                and enrollment.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy courses_admin_manage on public.courses for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy groups_read_associated_users on public.student_groups for
select to authenticated using (
        private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
        or exists (
            select 1
            from public.course_teachers as ct
            where
                ct.course_id = student_groups.course_id
                and ct.teacher_id = (
                    select auth.uid ()
                )
        )
        or exists (
            select 1
            from public.course_enrollments as enrollment
            where
                enrollment.group_id = student_groups.id
                and enrollment.student_id = (
                    select auth.uid ()
                )
        )
    );

create policy groups_admin_manage on public.student_groups for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy enrollments_read_owner_or_assigned_teacher on public.course_enrollments for
select to authenticated using (
        student_id = (
            select auth.uid ()
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
        or exists (
            select 1
            from public.course_teachers as ct
            where
                ct.course_id = course_enrollments.course_id
                and ct.teacher_id = (
                    select auth.uid ()
                )
        )
    );

create policy enrollments_admin_manage on public.course_enrollments for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy course_teachers_read_self_or_admin on public.course_teachers for
select to authenticated using (
        teacher_id = (
            select auth.uid ()
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
    );

create policy course_teachers_admin_manage on public.course_teachers for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy question_assets_read_assessment_or_staff on public.question_assets for
select to authenticated using (
        private.has_role (
            (
                select auth.uid ()
            ), 'profesor'
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
        or exists (
            select 1
            from public.assessment_questions as aq
                join public.assessments as assessment on assessment.id = aq.assessment_id
            where
                aq.question_id = question_assets.question_id
                and assessment.status = 'published'
                and private.is_active_student (
                    (
                        select auth.uid ()
                    )
                )
        )
    );

create policy question_assets_admin_manage on public.question_assets for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy competencies_read_authenticated on public.competencies for
select to authenticated using (true);

create policy topics_read_authenticated on public.topics for
select to authenticated using (true);

create policy subtopics_read_authenticated on public.subtopics for
select to authenticated using (true);

create policy question_topics_read_authenticated on public.question_topics for
select to authenticated using (
        private.has_role (
            (
                select auth.uid ()
            ), 'profesor'
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
        or exists (
            select 1
            from public.assessment_questions as aq
                join public.assessments as assessment on assessment.id = aq.assessment_id
            where
                aq.question_id = question_topics.question_id
                and assessment.status = 'published'
                and private.is_active_student (
                    (
                        select auth.uid ()
                    )
                )
        )
    );

create policy competencies_admin_manage on public.competencies for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy topics_admin_manage on public.topics for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy subtopics_admin_manage on public.subtopics for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy question_topics_admin_manage on public.question_topics for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy assessments_read_available_or_staff on public.assessments for
select to authenticated using (
        (
            status = 'published'
            and private.is_active_student (
                (
                    select auth.uid ()
                )
            )
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'profesor'
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
    );

create policy assessments_admin_manage on public.assessments for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy assessment_sections_read_available_or_staff on public.assessment_sections for
select to authenticated using (
        exists (
            select 1
            from public.assessments as assessment
            where
                assessment.id = assessment_sections.assessment_id
                and (
                    (
                        assessment.status = 'published'
                        and private.is_active_student (
                            (
                                select auth.uid ()
                            )
                        )
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'profesor'
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'admin'
                    )
                )
        )
    );

create policy assessment_sections_admin_manage on public.assessment_sections for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy assessment_questions_read_available_or_staff on public.assessment_questions for
select to authenticated using (
        exists (
            select 1
            from public.assessments as assessment
            where
                assessment.id = assessment_questions.assessment_id
                and (
                    (
                        assessment.status = 'published'
                        and private.is_active_student (
                            (
                                select auth.uid ()
                            )
                        )
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'profesor'
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'admin'
                    )
                )
        )
    );

create policy assessment_questions_admin_manage on public.assessment_questions for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy questions_read_assessment_or_staff on public.questions for
select to authenticated using (
        private.has_role (
            (
                select auth.uid ()
            ), 'profesor'
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
        or exists (
            select 1
            from public.assessment_questions as aq
                join public.assessments as assessment on assessment.id = aq.assessment_id
            where
                aq.question_id = questions.id
                and assessment.status = 'published'
                and private.is_active_student (
                    (
                        select auth.uid ()
                    )
                )
        )
    );

create policy questions_admin_manage on public.questions for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy options_read_assessment_or_staff on public.question_options for
select to authenticated using (
        private.has_role (
            (
                select auth.uid ()
            ), 'profesor'
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
        or exists (
            select 1
            from public.assessment_questions as aq
                join public.assessments as assessment on assessment.id = aq.assessment_id
            where
                aq.question_id = question_options.question_id
                and assessment.status = 'published'
                and private.is_active_student (
                    (
                        select auth.uid ()
                    )
                )
        )
    );

create policy options_admin_manage on public.question_options for all to authenticated using (
    private.has_role (
        (
            select auth.uid ()
        ),
        'admin'
    )
)
with
    check (
        private.has_role (
            (
                select auth.uid ()
            ),
            'admin'
        )
    );

create policy attempts_read_owner_or_staff on public.assessment_attempts for
select to authenticated using (
        student_id = (
            select auth.uid ()
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'profesor'
        )
        or private.has_role (
            (
                select auth.uid ()
            ), 'admin'
        )
    );

create policy answers_read_owner_or_staff on public.student_answers for
drop policy attempts_read_owner_or_staff on public.assessment_attempts;
create policy attempts_read_owner_or_staff on public.assessment_attempts for select to authenticated
using (
    student_id = (select auth.uid())
    or private.has_role((select auth.uid()), 'admin')
    or (private.has_role((select auth.uid()), 'profesor') and exists (
        select 1 from public.course_teachers as ct
        join public.course_enrollments as enrollment on enrollment.course_id = ct.course_id
        where ct.teacher_id = (select auth.uid())
            and enrollment.student_id = assessment_attempts.student_id
            and enrollment.status in ('matriculado', 'semimatriculado')
    ))
);

create policy answers_read_owner_or_staff on public.student_answers for
select to authenticated using (
        exists (
            select 1
            from public.assessment_attempts as attempt
            where
                attempt.id = student_answers.attempt_id
                and (
                    attempt.student_id = (
                        select auth.uid ()
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'profesor'
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'admin'
                    )
                )
        )
    );

create policy results_read_owner_or_staff on public.assessment_results for
select to authenticated using (
        exists (
            select 1
            from public.assessment_attempts as attempt
            where
                attempt.id = assessment_results.attempt_id
                and (
                    attempt.student_id = (
                        select auth.uid ()
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'profesor'
                    )
                    or private.has_role (
                        (
                            select auth.uid ()
                        ), 'admin'
                    )
                )
        )
    );

grant
select
    on public.profiles,
    public.roles,
    public.user_roles,
    public.questions,
    public.question_options,
    public.assessments,
    public.assessment_sections,
    public.assessment_questions,
    public.assessment_attempts,
    public.student_answers,
    public.assessment_results to authenticated;

grant insert,
update,
delete on public.assessments,
public.assessment_sections,
public.assessment_questions,
public.questions,
public.question_options to authenticated;

revoke insert,
update,
delete on public.user_roles,
public.assessment_attempts,
public.student_answers,
public.assessment_results
from anon, authenticated;

revoke all on private.answer_keys from anon, authenticated;

revoke select on public.student_answers from anon, authenticated;

create or replace function public.get_attempt_answers(p_attempt_id uuid)
returns table(question_id uuid, selected_option_id uuid, answered_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
begin
    if auth.uid() is null or not private.is_active_student(auth.uid())
        or not exists (select 1 from public.assessment_attempts as attempt
            where attempt.id = p_attempt_id and attempt.student_id = auth.uid()
                and attempt.status = 'en_progreso') then
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

create or replace function public.get_attempt_review(p_attempt_id uuid)
returns table(question_id uuid, selected_option_id uuid, is_correct boolean)
language plpgsql security definer set search_path = ''
as $$
declare
    attempt_row public.assessment_attempts%rowtype;
begin
    select * into attempt_row from public.assessment_attempts
    where id = p_attempt_id and status = 'clasificado';
    if not found or not (
        attempt_row.student_id = auth.uid()
        or private.has_role(auth.uid(), 'admin')
        or (private.has_role(auth.uid(), 'profesor') and exists (
            select 1 from public.course_teachers as ct
            join public.course_enrollments as enrollment on enrollment.course_id = ct.course_id
            where ct.teacher_id = auth.uid()
              and enrollment.student_id = attempt_row.student_id
              and enrollment.status in ('matriculado', 'semimatriculado')
        ))
    ) then raise exception 'NOT_AUTHORIZED' using errcode = '42501'; end if;
    return query
    select aq.question_id, selected.selected_option_id, selected.is_correct
    from public.assessment_questions as aq
    left join lateral (
        select answer.selected_option_id, answer.is_correct
        from public.student_answers as answer
        where answer.attempt_id = p_attempt_id and answer.question_id = aq.question_id
        order by answer.answered_at desc, answer.id desc limit 1
    ) as selected on true
    where aq.assessment_id = attempt_row.assessment_id
    order by aq.question_order;
end;
$$;

revoke all on function public.get_attempt_answers (uuid)
from public, anon;

revoke all on function public.get_attempt_review (uuid)
from public, anon;

grant
execute on function public.get_attempt_answers (uuid) to authenticated;

grant
execute on function public.get_attempt_review (uuid) to authenticated;

grant insert, update, delete on public.user_roles to authenticated;
create or replace function private.has_role(p_user_id uuid, p_role_name text)
returns boolean language sql stable security definer set search_path = ''
as $$
    select p_user_id = auth.uid() and exists (
        select 1 from public.user_roles as user_role
        join public.roles as role on role.id = user_role.role_id
        where user_role.user_id = p_user_id and role.name = p_role_name
    );
$$;
create or replace function private.is_active_student(p_user_id uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
    select p_user_id = auth.uid()
        and exists (select 1 from public.profiles as profile
            where profile.id = p_user_id and profile.status = 'active')
        and private.has_role(p_user_id, 'estudiante');
$$;
grant usage, select on all sequences in schema public to authenticated;

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
  if current_user_id is null or not private.is_active_student(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select * into attempt_row from public.assessment_attempts
  where id = p_attempt_id and student_id = current_user_id for update;
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
    if current_user_id is null or not private.is_active_student(current_user_id) then
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
  if current_user_id is null or not private.is_active_student(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select * into attempt_row from public.assessment_attempts
  where id = p_attempt_id and student_id = current_user_id for update;
  if not found or attempt_row.status <> 'en_progreso' then
    raise exception 'ATTEMPT_NOT_ACTIVE' using errcode = '22023';
  end if;
  if attempt_row.expires_at <= now() then
    raise exception 'ATTEMPT_EXPIRED' using errcode = '22023';
  end if;
  if not exists (select 1 from public.assessment_questions as aq
    where aq.assessment_id = attempt_row.assessment_id and aq.question_id = p_question_id) then
    raise exception 'QUESTION_NOT_IN_ASSESSMENT' using errcode = '22023';
  end if;
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

revoke all on function public.start_assessment (uuid)
from public, anon;

revoke all on function public.save_assessment_answer (uuid, uuid, uuid)
from public, anon;

revoke all on function public.submit_assessment_attempt (uuid)
from public, anon;

grant
execute on function public.start_assessment (uuid) to authenticated;

grant
execute on function public.save_assessment_answer (uuid, uuid, uuid) to authenticated;

grant
execute on function public.submit_assessment_attempt (uuid) to authenticated;