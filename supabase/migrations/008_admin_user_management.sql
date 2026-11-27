begin;

alter table public.profiles add column if not exists assessments_require_assignment boolean not null default false;
alter table public.course_enrollments add column if not exists portal_access_enabled boolean not null default true;

create table if not exists private.bertel_registrations (
  ticket uuid primary key default gen_random_uuid(),
  email text not null unique,
  document_number text not null unique,
  role_name text not null check (role_name in ('admin', 'profesor', 'estudiante')),
  requested_by uuid not null,
  expires_at timestamptz not null default now() + interval '15 minutes'
);

create table if not exists private.bertel_assessment_access (
  user_id uuid not null references public.profiles(id) on delete cascade,
  assessment_id uuid not null references public.assessments(id) on delete cascade,
  enabled boolean not null,
  primary key (user_id, assessment_id)
);

create or replace function private.is_bertel_admin()
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    join public.user_roles ur on ur.user_id = p.id
    join public.roles r on r.id = ur.role_id
    where p.id = auth.uid() and p.status = 'active' and r.name = 'admin'
  );
$$;

create or replace function private.require_bertel_admin()
returns void language plpgsql stable security definer set search_path = ''
as $$
begin
  if not private.is_bertel_admin() then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
end;
$$;

create or replace function public.bertel_admin_prepare_user(
  p_email text, p_document text, p_role text
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  normalized_email text := lower(btrim(p_email));
  new_ticket uuid;
begin
  perform private.require_bertel_admin();
  if coalesce(normalized_email, '') !~ '^[^[:space:]@]+@[^[:space:]@]+[.][^[:space:]@]+$'
    or length(normalized_email) > 254
    or coalesce(p_document, '') !~ '^[0-9]{4,20}$'
    or p_role is null or not exists (
      select 1 from public.roles where name = p_role and name in ('admin', 'profesor', 'estudiante')
    ) then
    raise exception 'INVALID_USER_DATA' using errcode = '22023';
  end if;

  delete from private.bertel_registrations
  where expires_at <= now() and (email = normalized_email or document_number = p_document);

  if exists (select 1 from auth.users where lower(email) = normalized_email) then
    raise exception 'EMAIL_ALREADY_REGISTERED' using errcode = '23505';
  end if;
  if exists (select 1 from public.profiles where id_document_number = p_document) then
    raise exception 'DOCUMENT_ALREADY_REGISTERED' using errcode = '23505';
  end if;

  insert into private.bertel_registrations (email, document_number, role_name, requested_by)
  values (normalized_email, p_document, p_role, auth.uid())
  returning ticket into new_ticket;
  return new_ticket;
end;
$$;

create or replace function private.bertel_provision_invited_user()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare
  registration private.bertel_registrations%rowtype;
begin
  if new.raw_user_meta_data ->> 'bertel_registration_ticket' is null then return new; end if;

  delete from private.bertel_registrations
  where ticket::text = new.raw_user_meta_data ->> 'bertel_registration_ticket'
    and email = lower(new.email)
    and expires_at > now()
    and exists (
      select 1 from public.profiles p
      join public.user_roles ur on ur.user_id = p.id
      join public.roles r on r.id = ur.role_id
      where p.id = requested_by and p.status = 'active' and r.name = 'admin'
    )
  returning * into registration;

  if not found then
    raise exception 'INVALID_REGISTRATION_TICKET' using errcode = '42501';
  end if;

  -- This also works alongside profile triggers that create a default row.
  insert into public.profiles (id, document_type, id_document_number, assessments_require_assignment)
  values (new.id, 'CC', registration.document_number, true)
  on conflict (id) do update set
    document_type = excluded.document_type,
    id_document_number = excluded.id_document_number,
    assessments_require_assignment = true;

  delete from public.user_roles where user_id = new.id;
  insert into public.user_roles (user_id, role_id)
  select new.id, id from public.roles where name = registration.role_name;
  if not found then raise exception 'INVALID_ROLE' using errcode = '22023'; end if;

  return new;
end;
$$;

drop trigger if exists zz_bertel_provision_invited_user on auth.users;
create trigger zz_bertel_provision_invited_user after insert on auth.users
for each row execute function private.bertel_provision_invited_user();

create or replace function public.bertel_admin_registration_result(p_ticket uuid, p_email text)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  registered_id uuid;
begin
  perform private.require_bertel_admin();
  delete from private.bertel_registrations where ticket = p_ticket and requested_by = auth.uid();
  if found then return null; end if;

  select u.id into registered_id from auth.users u
  join public.profiles p on p.id = u.id
  where lower(u.email) = lower(btrim(p_email))
    and u.raw_user_meta_data ->> 'bertel_registration_ticket' = p_ticket::text;
  return registered_id;
end;
$$;

create or replace function public.bertel_admin_users(p_search text default '')
returns table (id uuid, email text, name text, document_number text, roles text[])
language plpgsql stable security definer set search_path = ''
as $$
begin
  perform private.require_bertel_admin();
  return query
    select p.id, u.email::text, nullif(concat_ws(' ', p.first_name, p.last_name), ''),
      p.id_document_number,
      array(select r.name::text from public.user_roles ur join public.roles r on r.id = ur.role_id
            where ur.user_id = p.id order by r.name)
    from public.profiles p join auth.users u on u.id = p.id
    where position(lower(coalesce(p_search, '')) in lower(concat_ws(' ', u.email, p.id_document_number, p.first_name, p.last_name))) > 0
      or coalesce(p_search, '') = ''
    order by p.created_at desc, p.id
    limit 50;
end;
$$;

create or replace function public.bertel_admin_set_role(p_user uuid, p_role text)
returns void language plpgsql security definer set search_path = ''
as $$
declare next_role bigint;
begin
  perform private.require_bertel_admin();
  if p_user = auth.uid() then raise exception 'CANNOT_CHANGE_OWN_ROLE' using errcode = '22023'; end if;
  select id into next_role from public.roles where name = p_role and name in ('admin', 'profesor', 'estudiante');
  if not found then raise exception 'INVALID_ROLE' using errcode = '22023'; end if;
  perform 1 from public.profiles where id = p_user for update;
  if not found then raise exception 'USER_NOT_FOUND' using errcode = 'P0002'; end if;
  delete from public.user_roles where user_id = p_user and role_id <> next_role;
  insert into public.user_roles (user_id, role_id) values (p_user, next_role) on conflict do nothing;
end;
$$;

create or replace function private.bertel_assessment_allowed(p_user uuid, p_assessment uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select coalesce(
    (select a.enabled from private.bertel_assessment_access a where a.user_id = p_user and a.assessment_id = p_assessment),
    (select not p.assessments_require_assignment from public.profiles p where p.id = p_user),
    false
  );
$$;

create or replace function public.bertel_can_access_assessment(p_assessment uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select private.bertel_assessment_allowed(auth.uid(), p_assessment);
$$;

create or replace function public.bertel_available_assessments()
returns table (id uuid) language sql stable security definer set search_path = ''
as $$
  select a.id from public.assessments a
  where auth.uid() is not null and a.status = 'published'
    and private.bertel_assessment_allowed(auth.uid(), a.id);
$$;

create or replace function public.bertel_disabled_assessments()
returns table (id uuid) language sql stable security definer set search_path = ''
as $$
  select a.assessment_id from private.bertel_assessment_access a
  where a.user_id = auth.uid() and not a.enabled;
$$;

create or replace function public.bertel_admin_user_access(p_user uuid)
returns jsonb language plpgsql stable security definer set search_path = ''
as $$
begin
  perform private.require_bertel_admin();
  if not exists (select 1 from public.profiles where id = p_user) then
    raise exception 'USER_NOT_FOUND' using errcode = 'P0002';
  end if;

  return jsonb_build_object(
    'courses', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', c.id, 'name', c.name, 'status', e.status, 'enabled', coalesce(e.portal_access_enabled and e.status <> 'abandonado', false),
        'teaches', exists (select 1 from public.course_teachers t where t.teacher_id = p_user and t.course_id = c.id)
      ) order by c.name)
      from public.courses c left join public.course_enrollments e on e.course_id = c.id and e.student_id = p_user
    ), '[]'::jsonb),
    'assessments', coalesce((
      select jsonb_agg(jsonb_build_object(
        'id', a.id, 'title', a.title, 'status', a.status,
        'enabled', private.bertel_assessment_allowed(p_user, a.id),
         'reviewEnabled', not exists (
          select 1 from private.bertel_assessment_access x
          where x.user_id = p_user and x.assessment_id = a.id and not x.enabled
        )
      ) order by a.title) from public.assessments a
    ), '[]'::jsonb)
  );
end;
$$;

create or replace function public.bertel_admin_set_course(p_user uuid, p_course uuid, p_action text)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  perform private.require_bertel_admin();
  perform 1 from public.profiles where id = p_user for update;
  if not found then raise exception 'USER_NOT_FOUND' using errcode = 'P0002'; end if;

  if p_action in ('assign_teacher', 'remove_teacher') then
    if p_action = 'remove_teacher' then
      delete from public.course_teachers where teacher_id = p_user and course_id = p_course;
      return;
    end if;
    if not exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
      where ur.user_id = p_user and r.name = 'profesor') then
      raise exception 'TEACHER_ROLE_REQUIRED' using errcode = '22023';
    end if;
    insert into public.course_teachers (teacher_id, course_id) values (p_user, p_course) on conflict do nothing;
    return;
  end if;

  if p_action = 'disable' then
    update public.course_enrollments set portal_access_enabled = false
    where student_id = p_user and course_id = p_course;
    return;
  end if;
  if p_action is null or p_action not in ('enable', 'enroll') then
    raise exception 'INVALID_COURSE_ACTION' using errcode = '22023';
  end if;
  if not exists (select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
    where ur.user_id = p_user and r.name = 'estudiante') then
    raise exception 'STUDENT_ROLE_REQUIRED' using errcode = '22023';
  end if;

  insert into public.course_enrollments (student_id, course_id, status, portal_access_enabled)
  values (p_user, p_course, case when p_action = 'enroll' then 'matriculado' else 'semimatriculado' end, true)
  on conflict (student_id, course_id) do update
    set portal_access_enabled = true,
      status = case
        when p_action = 'enroll' then 'matriculado'
        when public.course_enrollments.status = 'abandonado' then 'semimatriculado'
        else public.course_enrollments.status
      end;
end;
$$;

create or replace function public.bertel_admin_set_assessment(p_user uuid, p_assessment uuid, p_enabled boolean)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  perform private.require_bertel_admin();
  perform pg_advisory_xact_lock(hashtextextended(p_user::text || p_assessment::text, 0));
  insert into private.bertel_assessment_access (user_id, assessment_id, enabled)
  values (p_user, p_assessment, p_enabled)
  on conflict (user_id, assessment_id) do update set enabled = excluded.enabled;
end;
$$;

-- Install the existing exam behavior if the target is missing its RPCs.
create or replace function private.bertel_is_assessment_user(p_user uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select exists (
    select 1 from public.profiles p
    join public.user_roles ur on ur.user_id = p.id
    join public.roles r on r.id = ur.role_id
    where p.id = p_user and p.status = 'active' and r.name in ('admin', 'estudiante')
  );
$$;

revoke all on function private.bertel_is_assessment_user(uuid) from public, anon, authenticated;

do $install$
begin
  if to_regprocedure('public.submit_assessment_attempt(uuid)') is null then
    execute $definition$
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
  if current_user_id is null or not private.bertel_is_assessment_user(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  select * into attempt_row
  from public.assessment_attempts
  where id = p_attempt_id
    and (student_id = current_user_id or private.is_bertel_admin())
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
    $definition$;
  end if;

  if to_regprocedure('public.save_assessment_answer(uuid,uuid,uuid)') is null then
    execute $definition$
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
  if current_user_id is null or not private.bertel_is_assessment_user(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
  select * into attempt_row from public.assessment_attempts
  where id = p_attempt_id
    and (student_id = current_user_id or private.is_bertel_admin())
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
    $definition$;
  end if;

  if to_regprocedure('public.get_attempt_answers(uuid)') is null then
    execute $definition$
create or replace function public.get_attempt_answers(p_attempt_id uuid)
returns table(question_id uuid, selected_option_id uuid, answered_at timestamptz)
language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null or not private.bertel_is_assessment_user(auth.uid())
    or not exists (
      select 1 from public.assessment_attempts as attempt
      where attempt.id = p_attempt_id
        and (attempt.student_id = auth.uid() or private.is_bertel_admin())
        and attempt.status = 'en_progreso'
        and (attempt.student_id <> auth.uid() or private.bertel_assessment_allowed(auth.uid(), attempt.assessment_id))
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
    $definition$;
  end if;

  if to_regprocedure('private.bertel_start_assessment_legacy(uuid)') is null then
    if to_regprocedure('public.start_assessment(uuid)') is not null then
      alter function public.start_assessment(uuid) rename to bertel_start_assessment_legacy;
      alter function public.bertel_start_assessment_legacy(uuid) set schema private;
    else
      execute $definition$
create or replace function private.bertel_start_assessment_legacy(p_assessment_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
declare
  current_user_id uuid := auth.uid();
  assessment_row public.assessments%rowtype;
  attempt_row public.assessment_attempts%rowtype;
begin
  if current_user_id is null or not private.bertel_is_assessment_user(current_user_id) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  select * into assessment_row
  from public.assessments
  where id = p_assessment_id and status = 'published'
  for share;

  if not found then
    raise exception 'ASSESSMENT_NOT_AVAILABLE' using errcode = 'P0002';
  end if;

  if not exists (
    select 1 from public.assessment_questions q where q.assessment_id = p_assessment_id
  ) then raise exception 'ASSESSMENT_HAS_NO_QUESTIONS' using errcode = '22023'; end if;

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
      $definition$;
    end if;
  end if;
end;
$install$;

revoke all on function public.submit_assessment_attempt(uuid),
  public.save_assessment_answer(uuid, uuid, uuid), public.get_attempt_answers(uuid) from public, anon;
grant execute on function public.submit_assessment_attempt(uuid),
  public.save_assessment_answer(uuid, uuid, uuid), public.get_attempt_answers(uuid) to authenticated;

revoke all on function private.bertel_start_assessment_legacy(uuid) from public, anon, authenticated;

create or replace function public.start_assessment(p_assessment_id uuid)
returns jsonb language plpgsql security definer set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'NOT_AUTHORIZED' using errcode = '42501'; end if;
  perform pg_advisory_xact_lock(hashtextextended(auth.uid()::text || p_assessment_id::text, 0));
  if not private.bertel_assessment_allowed(auth.uid(), p_assessment_id) then
    raise exception 'ASSESSMENT_ACCESS_DISABLED' using errcode = '42501';
  end if;
  return private.bertel_start_assessment_legacy(p_assessment_id);
end;
$$;

create or replace function private.bertel_guard_assessment_write()
returns trigger language plpgsql security definer set search_path = ''
as $$
declare learner uuid; assessment uuid;
begin
  if auth.uid() is null then return new; end if;
  if tg_table_name = 'student_answers' then
    select a.student_id, a.assessment_id into learner, assessment
    from public.assessment_attempts a where a.id = new.attempt_id;
  else
    if old.status <> 'en_progreso' or new.status = old.status then return new; end if;
    learner := old.student_id;
    assessment := old.assessment_id;
  end if;

  if learner = auth.uid() and not private.bertel_assessment_allowed(learner, assessment) then
    raise exception 'ASSESSMENT_ACCESS_DISABLED' using errcode = '42501';
  end if;
  return new;
end;
$$;

drop trigger if exists bertel_check_answer_access on public.student_answers;
create trigger bertel_check_answer_access before insert or update of selected_option_id on public.student_answers
for each row execute function private.bertel_guard_assessment_write();

drop trigger if exists bertel_check_submission_access on public.assessment_attempts;
create trigger bertel_check_submission_access before update of status on public.assessment_attempts
for each row execute function private.bertel_guard_assessment_write();

-- Filter content for disabled assessments without blocking access to graded history.
create or replace function private.bertel_can_read_assessment_questions(p_assessment uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select auth.uid() is not null and (
    private.bertel_assessment_allowed(auth.uid(), p_assessment)
    or exists (
      select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
      where ur.user_id = auth.uid() and (
        r.name = 'admin' or (r.name = 'profesor' and not exists (
          select 1 from private.bertel_assessment_access x
          where x.user_id = auth.uid() and x.assessment_id = p_assessment and not x.enabled
        ))
      )
    )
    or exists (
      select 1 from public.assessment_attempts a
      where a.assessment_id = p_assessment and a.student_id = auth.uid() and a.status in ('enviado', 'clasificado')
    )
  );
$$;

revoke all on function private.bertel_can_read_assessment_questions(uuid) from public, anon;
grant execute on function private.bertel_can_read_assessment_questions(uuid) to authenticated;

drop policy if exists bertel_filter_assessment_questions on public.assessment_questions;
create policy bertel_filter_assessment_questions on public.assessment_questions as restrictive
for select to authenticated using (private.bertel_can_read_assessment_questions(assessment_id));

create or replace function private.bertel_can_read_attempt(p_student uuid, p_assessment uuid)
returns boolean language sql stable security definer set search_path = ''
as $$
  select auth.uid() = p_student or private.is_bertel_admin() or (
    exists (
      select 1 from public.user_roles ur join public.roles r on r.id = ur.role_id
      where ur.user_id = auth.uid() and r.name = 'profesor'
    )
    and not exists (
      select 1 from private.bertel_assessment_access x
      where x.user_id = auth.uid() and x.assessment_id = p_assessment and not x.enabled
    )
    and exists (
      select 1 from public.course_teachers t join public.course_enrollments e on e.course_id = t.course_id
      where t.teacher_id = auth.uid() and e.student_id = p_student
        and e.portal_access_enabled and e.status in ('matriculado', 'semimatriculado')
    )
  );
$$;

revoke all on function private.bertel_can_read_attempt(uuid, uuid) from public, anon;
grant execute on function private.bertel_can_read_attempt(uuid, uuid) to authenticated;

drop policy if exists bertel_filter_attempts on public.assessment_attempts;
create policy bertel_filter_attempts on public.assessment_attempts as restrictive
for select to authenticated using (private.bertel_can_read_attempt(student_id, assessment_id));

revoke all on table private.bertel_registrations, private.bertel_assessment_access from public, anon, authenticated;
revoke all on function private.is_bertel_admin(), private.require_bertel_admin(),
  private.bertel_assessment_allowed(uuid, uuid), private.bertel_provision_invited_user(),
  private.bertel_guard_assessment_write() from public, anon, authenticated;

revoke all on function public.bertel_admin_prepare_user(text, text, text),
  public.bertel_admin_registration_result(uuid, text), public.bertel_admin_users(text),
  public.bertel_admin_set_role(uuid, text), public.bertel_admin_user_access(uuid),
  public.bertel_admin_set_course(uuid, uuid, text), public.bertel_admin_set_assessment(uuid, uuid, boolean),
  public.bertel_available_assessments(), public.bertel_can_access_assessment(uuid),
  public.bertel_disabled_assessments(),
  public.start_assessment(uuid) from public, anon;

grant execute on function public.bertel_admin_prepare_user(text, text, text),
  public.bertel_admin_registration_result(uuid, text), public.bertel_admin_users(text),
  public.bertel_admin_set_role(uuid, text), public.bertel_admin_user_access(uuid),
  public.bertel_admin_set_course(uuid, uuid, text), public.bertel_admin_set_assessment(uuid, uuid, boolean),
  public.bertel_available_assessments(), public.bertel_can_access_assessment(uuid),
  public.bertel_disabled_assessments(),
  public.start_assessment(uuid) to authenticated;

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
  is_admin boolean;
  is_teacher boolean;
begin
  select attempt.* into graded_attempt
  from public.assessment_attempts as attempt
  where attempt.id = p_attempt_id and attempt.status = 'clasificado';

  if not found or viewer_id is null or not exists (
    select 1 from public.profiles as profile
    where profile.id = viewer_id and profile.status = 'active'
  ) then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;

  if graded_attempt.student_id <> viewer_id then
    select
      coalesce(bool_or(role.name = 'admin'), false),
      coalesce(bool_or(role.name = 'profesor'), false)
      into is_admin, is_teacher
    from public.user_roles as assignment
    join public.roles as role on role.id = assignment.role_id
    where assignment.user_id = viewer_id;

    if not is_admin and not (
      is_teacher and not exists (
        select 1 from private.bertel_assessment_access a
        where a.user_id = viewer_id and a.assessment_id = graded_attempt.assessment_id and not a.enabled
      ) and exists (
      select 1 from public.course_teachers as teacher
      join public.course_enrollments as enrollment on enrollment.course_id = teacher.course_id
      where teacher.teacher_id = viewer_id
        and enrollment.student_id = graded_attempt.student_id
        and enrollment.status in ('matriculado', 'semimatriculado')
        and enrollment.portal_access_enabled
    )) then
      raise exception 'NOT_AUTHORIZED' using errcode = '42501';
    end if;
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
