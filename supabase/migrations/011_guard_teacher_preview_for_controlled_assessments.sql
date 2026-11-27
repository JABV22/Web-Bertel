BEGIN;
DO $guard$
BEGIN
 IF to_regprocedure('public.bertel_preview_answer_keys(uuid)') IS NULL THEN RETURN; END IF;
 EXECUTE $definition$
 CREATE OR REPLACE FUNCTION public.bertel_preview_answer_keys(p_assessment uuid)
 RETURNS TABLE(question_id uuid, correct_option_id uuid)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $fn$
 BEGIN
  IF NOT private.is_bertel_admin() AND (
    public.bertel_es_simulacro_controlado(p_assessment) OR NOT (
      private.bertel_is_active_teacher(auth.uid()) AND EXISTS (
        SELECT 1 FROM private.bertel_teacher_preview p
        WHERE p.teacher_id=auth.uid() AND p.assessment_id=p_assessment AND p.enabled
      )
    )
  ) THEN RAISE EXCEPTION 'NOT_AUTHORIZED' USING ERRCODE='42501'; END IF;
  RETURN QUERY SELECT aq.question_id, op.id FROM public.assessment_questions aq
    JOIN private.answer_keys k ON k.question_id=aq.question_id
    JOIN public.question_options op ON op.id=k.correct_option_id AND op.question_id=aq.question_id
    WHERE aq.assessment_id=p_assessment ORDER BY aq.question_order;
 END;
 $fn$;
 $definition$;
 EXECUTE $definition$
 CREATE OR REPLACE FUNCTION public.bertel_teacher_preview_permissions(p_teacher uuid DEFAULT NULL)
 RETURNS TABLE(id uuid)
 LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $fn$
 DECLARE target uuid := COALESCE(p_teacher,auth.uid());
 BEGIN
  IF auth.uid() IS NULL OR (target<>auth.uid() AND NOT private.is_bertel_admin()) THEN
   RAISE EXCEPTION 'NOT_AUTHORIZED' USING ERRCODE='42501';
  END IF;
  RETURN QUERY SELECT p.assessment_id FROM private.bertel_teacher_preview p
   WHERE p.teacher_id=target AND p.enabled
   AND NOT public.bertel_es_simulacro_controlado(p.assessment_id)
   AND (private.is_bertel_admin() OR private.bertel_is_active_teacher(auth.uid()));
 END;
 $fn$;
 $definition$;
END;
$guard$;
COMMIT;
SELECT to_regprocedure('public.bertel_preview_answer_keys(uuid)') IS NOT NULL AS vista_previa_instalada;

