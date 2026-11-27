BEGIN;

CREATE TABLE IF NOT EXISTS private.bertel_targeted_publications (
  assessment_id uuid PRIMARY KEY REFERENCES public.assessments(id) ON DELETE CASCADE
);
ALTER TABLE private.bertel_targeted_publications ENABLE ROW LEVEL SECURITY;
REVOKE ALL ON private.bertel_targeted_publications FROM PUBLIC, anon, authenticated;

CREATE OR REPLACE FUNCTION private.bertel_has_publication_scope(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT public.bertel_es_simulacro_controlado(p_id) OR EXISTS (
    SELECT 1 FROM private.bertel_targeted_publications WHERE assessment_id=p_id
  );
$$;

CREATE OR REPLACE FUNCTION private.bertel_assessment_allowed(p_user uuid,p_assessment uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT CASE
    WHEN private.bertel_has_publication_scope(p_assessment) THEN
      (p_user=auth.uid() AND private.is_bertel_admin()) OR EXISTS (
        SELECT 1 FROM private.bertel_assessment_access g
        JOIN public.assessments a ON a.id=g.assessment_id AND a.status='published'
        JOIN public.profiles p ON p.id=g.user_id AND p.status='active'
        JOIN public.user_roles ur ON ur.user_id=p.id
        JOIN public.roles r ON r.id=ur.role_id AND r.name='estudiante'
        WHERE g.user_id=p_user AND g.assessment_id=p_assessment AND g.enabled
      )
    ELSE COALESCE(
      (SELECT a.enabled FROM private.bertel_assessment_access a WHERE a.user_id=p_user AND a.assessment_id=p_assessment),
      (SELECT NOT p.assessments_require_assignment FROM public.profiles p WHERE p.id=p_user),
      false)
  END;
$$;

CREATE OR REPLACE FUNCTION private.bertel_can_review_published(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT private.bertel_is_active_teacher(auth.uid()) AND EXISTS (
    SELECT 1 FROM private.bertel_teacher_preview g
    JOIN public.assessments a ON a.id=g.assessment_id
    WHERE g.teacher_id=auth.uid() AND g.assessment_id=p_id AND g.enabled
      AND (NOT private.bertel_has_publication_scope(p_id) OR a.status='published')
  );
$$;

CREATE OR REPLACE FUNCTION private.bertel_publication_visible(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT NOT private.bertel_has_publication_scope(p_id) OR private.is_bertel_admin()
    OR private.bertel_assessment_allowed(auth.uid(),p_id) OR private.bertel_can_review_published(p_id);
$$;

CREATE OR REPLACE FUNCTION private.bertel_question_publication_visible(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT private.is_bertel_admin() OR NOT EXISTS (
    SELECT 1 FROM public.assessment_questions aq WHERE aq.question_id=p_id
      AND private.bertel_has_publication_scope(aq.assessment_id)
  ) OR EXISTS (
    SELECT 1 FROM public.assessment_questions aq WHERE aq.question_id=p_id
      AND private.bertel_has_publication_scope(aq.assessment_id)
      AND private.bertel_publication_visible(aq.assessment_id)
  );
$$;

CREATE OR REPLACE FUNCTION private.bertel_scoped_question_granted(p_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.assessment_questions aq WHERE aq.question_id=p_id
      AND private.bertel_has_publication_scope(aq.assessment_id)
      AND private.bertel_publication_visible(aq.assessment_id)
  );
$$;

DO $policies$
DECLARE t text; col text; expression text; scoped text;
BEGIN
  FOREACH t IN ARRAY ARRAY['assessments','assessment_sections','assessment_questions','course_assessments',
     'assessment_attempts','questions','question_options','question_assets','question_topics'] LOOP
    IF t IN ('questions','question_options','question_assets','question_topics') THEN
      col:=CASE WHEN t='questions' THEN 'id' ELSE 'question_id' END;
      expression:=format('private.bertel_question_publication_visible(%I)',col);
      scoped:=format('private.bertel_scoped_question_granted(%I)',col);
    ELSE
      col:=CASE WHEN t='assessments' THEN 'id' ELSE 'assessment_id' END;
      expression:=format('private.bertel_publication_visible(%I)',col);
      scoped:=format('private.bertel_has_publication_scope(%I) AND %s',col,expression);
    END IF;
    EXECUTE format('DROP POLICY IF EXISTS bertel_simulacros_admin_limite ON public.%I',t);
    EXECUTE format('CREATE POLICY bertel_simulacros_admin_limite ON public.%I AS RESTRICTIVE FOR SELECT TO anon,authenticated USING (%s)',t,expression);
    -- Existing attempt policies still enforce ownership and supervised enrollments.
    IF t <> 'assessment_attempts' THEN
      EXECUTE format('DROP POLICY IF EXISTS bertel_publication_grant ON public.%I',t);
      EXECUTE format('CREATE POLICY bertel_publication_grant ON public.%I FOR SELECT TO authenticated USING (%s)',t,scoped);
    END IF;
  END LOOP;
END;
$policies$;

DO $catalog$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_catalog.pg_policies WHERE schemaname='public'
      AND tablename='assessments' AND policyname='bertel_assessments_course_limit'
  ) THEN
    EXECUTE $policy$ALTER POLICY bertel_assessments_course_limit ON public.assessments USING (
      CASE WHEN private.bertel_has_publication_scope(id)
        THEN private.bertel_publication_visible(id)
        ELSE public.bertel_can_view_assessment(id)
      END
    )$policy$;
  END IF;
END;
$catalog$;


CREATE OR REPLACE FUNCTION private.bertel_storage_publication_visible(p_name text)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $$
  SELECT private.is_bertel_admin() OR EXISTS (
    SELECT 1 FROM public.question_assets a
    WHERE split_part(a.asset_url,'?',1) LIKE 'https://%.supabase.co/storage/v1/object/%/SIMULACROS/%'
      AND replace(split_part(split_part(a.asset_url,'?',1),'/SIMULACROS/',2),'%20',' ')=p_name
      AND private.bertel_scoped_question_granted(a.question_id)
  );
$$;

DROP POLICY IF EXISTS bertel_simulacros_storage_admin_limite ON storage.objects;
CREATE POLICY bertel_simulacros_storage_admin_limite ON storage.objects AS RESTRICTIVE
 FOR SELECT TO anon,authenticated USING (
  bucket_id <> 'SIMULACROS' OR split_part(name,'/',1) NOT IN ('SIMULACRO 3','SIMULACRO 4','SIMULACRO 5')
  OR private.bertel_storage_publication_visible(name)
 );
DROP POLICY IF EXISTS bertel_publication_storage_grant ON storage.objects;
CREATE POLICY bertel_publication_storage_grant ON storage.objects FOR SELECT TO authenticated
 USING (bucket_id='SIMULACROS' AND private.bertel_storage_publication_visible(name));

REVOKE ALL ON FUNCTION private.bertel_has_publication_scope(uuid), private.bertel_publication_visible(uuid),
 private.bertel_question_publication_visible(uuid), private.bertel_scoped_question_granted(uuid),
 private.bertel_storage_publication_visible(text), private.bertel_can_review_published(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION private.bertel_has_publication_scope(uuid), private.bertel_publication_visible(uuid),
 private.bertel_question_publication_visible(uuid), private.bertel_scoped_question_granted(uuid),
 private.bertel_storage_publication_visible(text) TO anon,authenticated;

create or replace function private.bertel_validate_and_publish(p_assessment uuid)
returns void language plpgsql security definer set search_path = ''
as $$
begin
  perform private.require_bertel_admin();
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
        and split_part(asset.asset_url, '?', 1) similar to 'https://%.supabase.co/storage/v1/object/(authenticated|public)/SIMULACROS/%'
        and object.name = replace(split_part(split_part(asset.asset_url, '?', 1), '/SIMULACROS/', 2), '%20', ' ')
    )
  ) then raise exception 'MISSING_QUESTION_IMAGES' using errcode = '22023'; end if;

  update public.assessments set status = 'published' where id = p_assessment;
end;
$$;

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
  where a.teacher_id = target and a.enabled and (not private.bertel_has_publication_scope(a.assessment_id) or exists (select 1 from public.assessments s where s.id=a.assessment_id and s.status='published')) and
    (private.is_bertel_admin() or private.bertel_is_active_teacher(auth.uid()));
end;
$$;

create or replace function public.bertel_preview_answer_keys(p_assessment uuid)
returns table (question_id uuid, correct_option_id uuid)
language plpgsql stable security definer set search_path = ''
as $$
begin
  if not private.is_bertel_admin() and not private.bertel_can_review_published(p_assessment) then
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

CREATE OR REPLACE FUNCTION public.get_graded_attempt_review(p_attempt_id uuid)
RETURNS TABLE(question_id uuid,selected_option_id uuid,correct_option_id uuid,is_correct boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $fn$
BEGIN
 IF NOT public.bertel_simulacros_admin_activo() AND EXISTS (
  SELECT 1 FROM public.assessment_attempts a
  WHERE a.id=p_attempt_id AND NOT private.bertel_publication_visible(a.assessment_id)
 ) THEN
  RAISE EXCEPTION 'NOT_AUTHORIZED' USING ERRCODE='42501';
 END IF;
 RETURN QUERY SELECT * FROM private.bertel_graded_review_before_simulacros(p_attempt_id);
END;
$fn$;

CREATE OR REPLACE FUNCTION public.bertel_publication_recipients()
RETURNS TABLE(id uuid, name text, email text, roles text[])
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $$
BEGIN
  PERFORM private.require_bertel_admin();
  RETURN QUERY SELECT p.id, nullif(btrim(concat_ws(' ',p.first_name,p.last_name)),''),u.email::text,
    array_agg(DISTINCT r.name::text ORDER BY r.name::text)
  FROM public.profiles p JOIN auth.users u ON u.id=p.id
  JOIN public.user_roles ur ON ur.user_id=p.id JOIN public.roles r ON r.id=ur.role_id
  WHERE p.status='active' AND r.name IN ('estudiante','profesor')
  GROUP BY p.id,p.first_name,p.last_name,u.email ORDER BY 2 NULLS LAST,3,p.id;
END;
$$;

CREATE OR REPLACE FUNCTION public.bertel_publish_for_users(p_assessment uuid,p_students uuid[],p_teachers uuid[])
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  PERFORM private.require_bertel_admin();
  IF COALESCE(cardinality(p_students),0)+COALESCE(cardinality(p_teachers),0)=0 THEN
    RAISE EXCEPTION 'PUBLICATION_RECIPIENTS_REQUIRED' USING ERRCODE='22023';
  END IF;
  IF EXISTS (
    SELECT 1 FROM (
      SELECT unnest(p_students) id,'estudiante' role_name
      UNION ALL SELECT unnest(p_teachers),'profesor'
    ) x WHERE NOT EXISTS (
      SELECT 1 FROM public.profiles p JOIN public.user_roles ur ON ur.user_id=p.id
      JOIN public.roles r ON r.id=ur.role_id
      WHERE p.id=x.id AND p.status='active' AND r.name=x.role_name
    )
  ) THEN RAISE EXCEPTION 'INVALID_PUBLICATION_RECIPIENTS' USING ERRCODE='22023'; END IF;

  PERFORM private.bertel_validate_and_publish(p_assessment);
  INSERT INTO private.bertel_targeted_publications VALUES (p_assessment) ON CONFLICT DO NOTHING;
  UPDATE private.bertel_assessment_access SET enabled=false WHERE assessment_id=p_assessment AND enabled;
  UPDATE private.bertel_teacher_preview SET enabled=false WHERE assessment_id=p_assessment AND enabled;
  INSERT INTO private.bertel_assessment_access(user_id,assessment_id,enabled)
    SELECT DISTINCT id,p_assessment,true FROM unnest(p_students) ids(id)
    ON CONFLICT (user_id,assessment_id) DO UPDATE SET enabled=true;
  INSERT INTO private.bertel_teacher_preview(teacher_id,assessment_id,enabled)
    SELECT DISTINCT id,p_assessment,true FROM unnest(p_teachers) ids(id)
    ON CONFLICT (teacher_id,assessment_id) DO UPDATE SET enabled=true;
END;
$$;

CREATE OR REPLACE FUNCTION public.publish_validated_assessment(p_assessment uuid)
RETURNS void LANGUAGE plpgsql SECURITY DEFINER SET search_path='' AS $$
BEGIN
  PERFORM private.require_bertel_admin();
  RAISE EXCEPTION 'PUBLICATION_RECIPIENTS_REQUIRED' USING ERRCODE='22023';
END;
$$;
REVOKE ALL ON FUNCTION private.bertel_validate_and_publish(uuid), public.bertel_publication_recipients(),
 public.bertel_publish_for_users(uuid,uuid[],uuid[]) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.bertel_publication_recipients(),public.bertel_publish_for_users(uuid,uuid[],uuid[]) TO authenticated;
NOTIFY pgrst,'reload schema';
COMMIT;
