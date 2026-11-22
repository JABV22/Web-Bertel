begin;

-- Match the object to a question_assets row visible under the caller's existing RLS.
drop policy if exists bertel_read_linked_question_images on storage.objects;
create policy bertel_read_linked_question_images on storage.objects
for select to authenticated
using (
  bucket_id = 'SIMULACROS'
  and exists (
    select 1 from public.question_assets as asset
    where split_part(asset.asset_url, '?', 1) like 'https://%.supabase.co/storage/v1/object/authenticated/SIMULACROS/%'
      and replace(split_part(split_part(asset.asset_url, '?', 1), '/SIMULACROS/', 2), '%20', ' ') = storage.objects.name
  )
);

create or replace function public.create_assessment_draft(
  p_source uuid, p_title text, p_duration integer, p_description text
)
returns uuid language plpgsql security definer set search_path = ''
as $$
declare
  draft_id uuid := gen_random_uuid();
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
    or not private.has_role(auth.uid(), 'admin') then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
  if p_title is null or char_length(btrim(p_title)) not between 1 and 200
    or p_duration is null or p_duration not between 1 and 480
    or char_length(p_description) > 2000 then
    raise exception 'INVALID_DRAFT' using errcode = '22023';
  end if;
  if not exists (select 1 from public.assessment_questions where assessment_id = p_source) then
    raise exception 'EMPTY_SOURCE' using errcode = '22023';
  end if;

  insert into public.assessments (id, title, description, duration_minutes, status)
  values (draft_id, btrim(p_title), nullif(btrim(p_description), ''), p_duration, 'draft');

  insert into public.assessment_sections (assessment_id, title, section_order)
  select draft_id, title, section_order from public.assessment_sections where assessment_id = p_source;

  insert into public.assessment_questions (assessment_id, question_id, section_id, question_order)
  select draft_id, aq.question_id, new_section.id, aq.question_order
  from public.assessment_questions as aq
  left join public.assessment_sections as old_section on old_section.id = aq.section_id
  left join public.assessment_sections as new_section
    on new_section.assessment_id = draft_id and new_section.section_order = old_section.section_order
  where aq.assessment_id = p_source;

  return draft_id;
end;
$$;

create or replace function public.publish_validated_assessment(p_assessment uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  if not exists (select 1 from public.profiles where id = auth.uid() and status = 'active')
    or not private.has_role(auth.uid(), 'admin') then
    raise exception 'NOT_AUTHORIZED' using errcode = '42501';
  end if;
  perform 1 from public.assessments where id = p_assessment and status = 'draft' for update;
  if not found then raise exception 'NOT_A_DRAFT' using errcode = '22023'; end if;

  if not exists (select 1 from public.assessment_questions where assessment_id = p_assessment) then
    raise exception 'ASSESSMENT_HAS_NO_QUESTIONS' using errcode = '22023';
  end if;
  if exists (
    select 1 from public.assessment_questions as aq
    join public.questions as q on q.id = aq.question_id
    where aq.assessment_id = p_assessment and (
      nullif(btrim(q.statement), '') is null
      or (select count(*) from public.question_options where question_id = q.id) < 2
    )
  ) then raise exception 'INVALID_QUESTIONS' using errcode = '22023'; end if;
  if exists (
    select 1 from public.assessment_questions as aq
    left join private.answer_keys as key on key.question_id = aq.question_id
    left join public.question_options as opt
      on opt.id = key.correct_option_id and opt.question_id = aq.question_id
    where aq.assessment_id = p_assessment and opt.id is null
  ) then raise exception 'ASSESSMENT_HAS_INVALID_ANSWER_KEYS' using errcode = '22023'; end if;

  if exists (
    select 1 from public.assessment_questions as aq
    join public.questions as q on q.id = aq.question_id
    where aq.assessment_id = p_assessment
      and q.statement ilike '%imagen individual%'
      and not exists (select 1 from public.question_assets where question_id = q.id)
  ) or exists (
    select 1 from public.assessment_questions as aq
    join public.question_assets as asset on asset.question_id = aq.question_id
    where aq.assessment_id = p_assessment and not exists (
      select 1 from storage.objects as object
      where object.bucket_id = 'SIMULACROS'
        and split_part(asset.asset_url, '?', 1) like 'https://%.supabase.co/storage/v1/object/authenticated/SIMULACROS/%'
        and object.name = replace(split_part(split_part(asset.asset_url, '?', 1), '/SIMULACROS/', 2), '%20', ' ')
    )
  ) then raise exception 'MISSING_QUESTION_IMAGES' using errcode = '22023'; end if;

  update public.assessments set status = 'published' where id = p_assessment;
end;
$$;

revoke all on function public.create_assessment_draft(uuid, text, integer, text) from public, anon;
revoke all on function public.publish_validated_assessment(uuid) from public, anon;
grant execute on function public.create_assessment_draft(uuid, text, integer, text) to authenticated;
grant execute on function public.publish_validated_assessment(uuid) to authenticated;
notify pgrst, 'reload schema';

commit;
