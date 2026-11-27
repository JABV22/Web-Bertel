-- BERTEL - SIMULACROS 3, 4 Y 5 EXCLUSIVOS DEL ADMINISTRADOR
-- Ejecutar COMPLETO como postgres, despues de revisar el TXT de validacion.
-- Reutiliza las 762 preguntas cargadas. No inserta preguntas ni duplica datos.
-- Cancela todo si falta una pregunta, opcion, clave, lectura o imagen prevista.
-- No publica ni matricula. No crea cursos ni modifica intentos.
-- Permite lectura administrativa de evaluaciones, secciones, preguntas y recursos.
-- Bloquea estas seis sesiones para profesores, estudiantes y anonimos.
-- El bucket SIMULACROS pasa a privado: la app debe usar URLs firmadas.
-- Las URLs firmadas emitidas anteriormente pueden seguir vigentes hasta su vencimiento.
-- La restriccion tambien debe aplicarse en rutas de servidor que usan service_role.
-- Este archivo NO cambia el codigo de la interfaz del proyecto.

BEGIN;
SELECT pg_advisory_xact_lock(2026,224);

DO $validar$
DECLARE item record;
BEGIN
 FOR item IN
WITH revision_completa(simulacro,sesion,evaluacion_id,evaluacion,estado,esperadas,preguntas,claves_faltantes,opciones_invalidas,recursos_faltantes,secciones_invalidas,numeracion_correcta,lista) AS (
WITH esperados(sim,ses,id,n) AS (VALUES
 (3,1,'137545d4-c22b-57c0-89de-ee0c3ff48d08'::uuid,120),
 (3,2,'31a166d7-9181-56e6-a78d-19d5ff9936ba'::uuid,134),
 (4,1,'aa4a1e61-fb5c-5946-ac7d-2db4fba405cb'::uuid,120),
 (4,2,'4b2b8d29-b9c6-5ed0-bae2-e6ace793b05d'::uuid,134),
 (5,1,'4c7e9573-4f02-5a21-868b-e29a9eaa8008'::uuid,120),
 (5,2,'82480b46-af91-5a68-a57e-628ee5ec08de'::uuid,134)
), lecturas(sim,ses,inicio,fin,ruta) AS (VALUES
 (3,1,26,30,'SIMULACRO 3/lecturas_s1_3/lectura_026_030.jpg'),
 (3,1,31,35,'SIMULACRO 3/lecturas_s1_3/lectura_031_035.jpg'),
 (3,1,36,39,'SIMULACRO 3/lecturas_s1_3/lectura_036_039.jpg'),
 (3,1,40,41,'SIMULACRO 3/lecturas_s1_3/lectura_040_041.jpg'),
 (3,1,42,46,'SIMULACRO 3/lecturas_s1_3/lectura_042_046.jpg'),
 (3,1,47,48,'SIMULACRO 3/lecturas_s1_3/lectura_047_048.jpg'),
 (3,1,49,50,'SIMULACRO 3/lecturas_s1_3/lectura_049_050.jpg'),
 (3,1,51,53,'SIMULACRO 3/lecturas_s1_3/lectura_051_053.jpg'),
 (3,1,54,57,'SIMULACRO 3/lecturas_s1_3/lectura_054_057.jpg'),
 (3,1,58,61,'SIMULACRO 3/lecturas_s1_3/lectura_058_061.jpg'),
 (3,1,62,64,'SIMULACRO 3/lecturas_s1_3/lectura_062_064.jpg'),
 (3,1,65,66,'SIMULACRO 3/lecturas_s1_3/lectura_065_066.jpg'),
 (3,1,95,97,'SIMULACRO 3/lecturas_s1_3/lectura_095_097.jpg'),
 (3,1,108,110,'SIMULACRO 3/lecturas_s1_3/lectura_108_110.jpg'),
 (3,2,54,56,'SIMULACRO 3/lecturas_s2_3/lectura_054_056.jpg'),
 (3,2,67,69,'SIMULACRO 3/lecturas_s2_3/lectura_067_069.jpg'),
 (3,2,80,84,'SIMULACRO 3/lecturas_s2_3/lectura_080_084_palabras.jpg'),
 (3,2,97,104,'SIMULACRO 3/lecturas_s2_3/lectura_097_104.jpg'),
 (3,2,105,112,'SIMULACRO 3/lecturas_s2_3/lectura_105_112.jpg'),
 (3,2,113,119,'SIMULACRO 3/lecturas_s2_3/lectura_113_119.jpg'),
 (3,2,120,124,'SIMULACRO 3/lecturas_s2_3/lectura_120_124.jpg'),
 (3,2,125,134,'SIMULACRO 3/lecturas_s2_3/lectura_125_134.jpg'),
 (4,1,26,30,'SIMULACRO 4/lecturas_s1_4/lectura_026_030.jpg'),
 (4,1,31,35,'SIMULACRO 4/lecturas_s1_4/lectura_031_035.jpg'),
 (4,1,36,40,'SIMULACRO 4/lecturas_s1_4/lectura_036_040.jpg'),
 (4,1,41,44,'SIMULACRO 4/lecturas_s1_4/lectura_041_044.jpg'),
 (4,1,46,50,'SIMULACRO 4/lecturas_s1_4/lectura_046_050.jpg'),
 (4,1,51,55,'SIMULACRO 4/lecturas_s1_4/lectura_051_055.jpg'),
 (4,1,56,60,'SIMULACRO 4/lecturas_s1_4/lectura_056_060.jpg'),
 (4,1,61,63,'SIMULACRO 4/lecturas_s1_4/lectura_061_063.jpg'),
 (4,1,64,66,'SIMULACRO 4/lecturas_s1_4/lectura_064_066.jpg'),
 (4,1,98,100,'SIMULACRO 4/lecturas_s1_4/lectura_098_100.jpg'),
 (4,1,102,104,'SIMULACRO 4/lecturas_s1_4/lectura_102_104.jpg'),
 (4,1,110,112,'SIMULACRO 4/lecturas_s1_4/lectura_110_112_grafica.jpg'),
 (4,1,110,112,'SIMULACRO 4/lecturas_s1_4/lectura_110_112_texto.jpg'),
 (4,2,80,84,'SIMULACRO 4/lecturas_s2_4/lectura_080_084_palabras.jpg'),
 (4,2,97,104,'SIMULACRO 4/lecturas_s2_4/lectura_097_104.jpg'),
 (4,2,105,112,'SIMULACRO 4/lecturas_s2_4/lectura_105_112.jpg'),
 (4,2,113,119,'SIMULACRO 4/lecturas_s2_4/lectura_113_119.jpg'),
 (4,2,120,124,'SIMULACRO 4/lecturas_s2_4/lectura_120_124.jpg'),
 (4,2,125,134,'SIMULACRO 4/lecturas_s2_4/lectura_125_134.jpg'),
 (5,1,26,30,'SIMULACRO 5/lecturas_s1_5/lectura_026_030.jpg'),
 (5,1,31,35,'SIMULACRO 5/lecturas_s1_5/lectura_031_035.jpg'),
 (5,1,36,40,'SIMULACRO 5/lecturas_s1_5/lectura_036_040.jpg'),
 (5,1,41,45,'SIMULACRO 5/lecturas_s1_5/lectura_041_045.jpg'),
 (5,1,46,50,'SIMULACRO 5/lecturas_s1_5/lectura_046_050.jpg'),
 (5,1,51,55,'SIMULACRO 5/lecturas_s1_5/lectura_051_055.jpg'),
 (5,1,56,60,'SIMULACRO 5/lecturas_s1_5/lectura_056_060.jpg'),
 (5,1,61,62,'SIMULACRO 5/lecturas_s1_5/lectura_061_062.jpg'),
 (5,1,63,66,'SIMULACRO 5/lecturas_s1_5/lectura_063_066.jpg'),
 (5,1,95,97,'SIMULACRO 5/lecturas_s1_5/lectura_095_097.jpg'),
 (5,1,108,110,'SIMULACRO 5/lecturas_s1_5/lectura_108_110.jpg'),
 (5,2,51,53,'SIMULACRO 5/lecturas_s2_5/lectura_051_053.jpg'),
 (5,2,54,56,'SIMULACRO 5/lecturas_s2_5/lectura_054_056.jpg'),
 (5,2,67,69,'SIMULACRO 5/lecturas_s2_5/lectura_067_069.jpg'),
 (5,2,80,84,'SIMULACRO 5/lecturas_s2_5/lectura_080_084.jpg'),
 (5,2,98,105,'SIMULACRO 5/lecturas_s2_5/lectura_098_105.jpg'),
 (5,2,106,112,'SIMULACRO 5/lecturas_s2_5/lectura_106_112.jpg'),
 (5,2,113,119,'SIMULACRO 5/lecturas_s2_5/lectura_113_119.jpg'),
 (5,2,120,124,'SIMULACRO 5/lecturas_s2_5/lectura_120_124.jpg'),
 (5,2,125,134,'SIMULACRO 5/lecturas_s2_5/lectura_125_134.jpg')
), vinculos AS (
 SELECT e.sim,e.ses,e.id,e.n,aq.question_id,aq.question_order,aq.section_id
 FROM esperados e JOIN public.assessment_questions aq ON aq.assessment_id=e.id
), archivos_esperados AS (
 SELECT v.id,v.question_id,
 'SIMULACRO '||v.sim||'/preguntas_s'||v.ses||'_'||v.sim||
 '/pregunta_'||lpad(v.question_order::text,3,'0')||'.jpg' AS ruta
 FROM vinculos v
 UNION ALL
 SELECT v.id,v.question_id,l.ruta FROM vinculos v JOIN lecturas l
 ON l.sim=v.sim AND l.ses=v.ses AND v.question_order BETWEEN l.inicio AND l.fin
), revision AS (
 SELECT e.sim,e.ses,e.id,a.title,a.status,e.n,
 (SELECT count(*) FROM vinculos v JOIN public.questions q ON q.id=v.question_id WHERE v.id=e.id) AS preguntas,
 (SELECT count(*) FROM vinculos v WHERE v.id=e.id AND NOT EXISTS (
   SELECT 1 FROM private.answer_keys k JOIN public.question_options op
   ON op.question_id=k.question_id AND op.id=k.correct_option_id
   WHERE k.question_id=v.question_id)) AS claves_faltantes,
 (SELECT count(*) FROM vinculos v WHERE v.id=e.id AND (
   (SELECT count(*) FROM public.question_options op WHERE op.question_id=v.question_id)<>
    CASE WHEN e.ses=2 AND v.question_order BETWEEN 80 AND 84 THEN CASE WHEN e.sim=4 THEN 8 ELSE 7 END
         WHEN e.ses=2 AND v.question_order BETWEEN 85 AND 119 THEN 3 ELSE 4 END
   OR EXISTS (SELECT 1 FROM public.question_options op WHERE op.question_id=v.question_id
     AND (op.position<1 OR op.option_text<>chr(64+op.position::integer)))
   OR (SELECT max(op.position) FROM public.question_options op WHERE op.question_id=v.question_id)<>
      (SELECT count(*) FROM public.question_options op WHERE op.question_id=v.question_id)
 )) AS opciones_invalidas,
 (SELECT count(*) FROM archivos_esperados f WHERE f.id=e.id AND (
   NOT EXISTS (SELECT 1 FROM storage.objects o WHERE o.bucket_id='SIMULACROS' AND o.name=f.ruta)
   OR NOT EXISTS (SELECT 1 FROM public.question_assets img WHERE img.question_id=f.question_id
     AND img.asset_url IN (
      'https://mwtnmctqxmryoggggupl.supabase.co/storage/v1/object/authenticated/SIMULACROS/'||replace(f.ruta,' ','%20'),
      'https://mwtnmctqxmryoggggupl.supabase.co/storage/v1/object/public/SIMULACROS/'||replace(f.ruta,' ','%20')
     ))
 )) AS recursos_faltantes,
 (SELECT count(*) FROM vinculos v WHERE v.id=e.id AND NOT EXISTS (
   SELECT 1 FROM public.assessment_sections s WHERE s.id=v.section_id AND s.assessment_id=e.id))
   + CASE WHEN (SELECT count(*) FROM public.assessment_sections s WHERE s.assessment_id=e.id)=4 THEN 0 ELSE 1 END
   AS secciones_invalidas,
 COALESCE((SELECT min(v.question_order)=1 AND max(v.question_order)=e.n
   AND count(DISTINCT v.question_order)=e.n FROM vinculos v WHERE v.id=e.id),false)
   AS numeracion_correcta
 FROM esperados e LEFT JOIN public.assessments a ON a.id=e.id
)
SELECT r.sim,r.ses,r.id,r.title,r.status,r.n,r.preguntas,r.claves_faltantes,
 r.opciones_invalidas,r.recursos_faltantes,r.secciones_invalidas,r.numeracion_correcta,
 r.title IS NOT NULL AND r.preguntas=r.n AND r.claves_faltantes=0
 AND r.opciones_invalidas=0 AND r.recursos_faltantes=0
 AND r.secciones_invalidas=0 AND r.numeracion_correcta
FROM revision r
)
SELECT simulacro,sesion,evaluacion,estado,preguntas,esperadas,
 preguntas-claves_faltantes AS claves_validas,claves_faltantes,
 opciones_invalidas,recursos_faltantes,secciones_invalidas,numeracion_correcta,
 CASE WHEN simulacro=5 AND sesion=2 THEN EXISTS (
  SELECT 1 FROM public.assessment_questions aq
  JOIN private.answer_keys k ON k.question_id=aq.question_id
  JOIN public.question_options op ON op.question_id=k.question_id AND op.id=k.correct_option_id
  WHERE aq.assessment_id=revision_completa.evaluacion_id AND aq.question_order=49
    AND op.option_text='C' AND op.position=3
 ) ELSE true END AS clave_49_correcta,
 CASE WHEN lista THEN 'DATOS COMPLETOS - HABILITACION MANUAL'
 ELSE 'PENDIENTE DE CORREGIR' END AS resultado
FROM revision_completa ORDER BY simulacro,sesion
 LOOP
  IF item.resultado<>'DATOS COMPLETOS - HABILITACION MANUAL' OR NOT item.clave_49_correcta THEN
   RAISE EXCEPTION 'Carga incompleta: simulacro %, sesion %.',item.simulacro,item.sesion
    USING DETAIL=format('Preguntas %s/%s. Claves faltantes %s. Opciones invalidas %s. Recursos faltantes %s. Secciones invalidas %s. Clave 49 correcta: %s.',
      item.preguntas,item.esperadas,item.claves_faltantes,item.opciones_invalidas,item.recursos_faltantes,item.secciones_invalidas,item.clave_49_correcta),
      HINT='No reinsertar a ciegas. Corregir solo los registros indicados y repetir.';
  END IF;
 END LOOP;
END;
$validar$;

CREATE OR REPLACE FUNCTION public.bertel_simulacros_admin_activo()
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $fn$
 SELECT EXISTS (
  SELECT 1 FROM public.profiles p
  JOIN public.user_roles ur ON ur.user_id=p.id
  JOIN public.roles r ON r.id=ur.role_id
  WHERE p.id=(SELECT auth.uid()) AND p.status='active'
    AND lower(btrim(r.name)) IN ('admin','administrador','administrator')
 );
$fn$;

CREATE OR REPLACE FUNCTION public.bertel_es_simulacro_controlado(target_id uuid)
RETURNS boolean LANGUAGE sql IMMUTABLE SECURITY INVOKER SET search_path='' AS $fn$
 SELECT COALESCE(target_id IN (
  '137545d4-c22b-57c0-89de-ee0c3ff48d08'::uuid,
  '31a166d7-9181-56e6-a78d-19d5ff9936ba'::uuid,
  'aa4a1e61-fb5c-5946-ac7d-2db4fba405cb'::uuid,
  '4b2b8d29-b9c6-5ed0-bae2-e6ace793b05d'::uuid,
  '4c7e9573-4f02-5a21-868b-e29a9eaa8008'::uuid,
  '82480b46-af91-5a68-a57e-628ee5ec08de'::uuid
 ),false);
$fn$;

CREATE OR REPLACE FUNCTION public.bertel_es_pregunta_controlada(target_id uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $fn$
 SELECT EXISTS (SELECT 1 FROM public.assessment_questions aq
   WHERE aq.question_id=target_id
     AND public.bertel_es_simulacro_controlado(aq.assessment_id));
$fn$;

REVOKE ALL ON FUNCTION public.bertel_simulacros_admin_activo(),
 public.bertel_es_simulacro_controlado(uuid),public.bertel_es_pregunta_controlada(uuid) FROM PUBLIC;
GRANT EXECUTE ON FUNCTION public.bertel_simulacros_admin_activo(),
 public.bertel_es_simulacro_controlado(uuid),public.bertel_es_pregunta_controlada(uuid)
 TO anon,authenticated,service_role;

-- La politica restrictiva se combina con las permisivas preexistentes.
-- Una regla antigua para profesores no puede abrir estos seis simulacros.
DO $politicas$
DECLARE t text; predicate text; target_column text;
BEGIN
 FOREACH t IN ARRAY ARRAY['assessments','assessment_sections','assessment_questions','course_assessments',
   'questions','question_options','question_assets','question_topics'] LOOP
  IF to_regclass('public.'||t) IS NULL THEN
   RAISE EXCEPTION 'Falta public.%. No se aplicaron cambios.',t;
  END IF;
  IF t IN ('assessments','assessment_sections','assessment_questions','course_assessments') THEN
   target_column:=CASE WHEN t='assessments' THEN 'id' ELSE 'assessment_id' END;
   predicate:=format('public.bertel_es_simulacro_controlado(%I)',target_column);
  ELSE
   target_column:=CASE WHEN t='questions' THEN 'id' ELSE 'question_id' END;
   predicate:=format('public.bertel_es_pregunta_controlada(%I)',target_column);
  END IF;
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY',t);
  EXECUTE format('GRANT SELECT ON public.%I TO authenticated',t);
  EXECUTE format('DROP POLICY IF EXISTS bertel_simulacros_admin_lectura ON public.%I',t);
  EXECUTE format('CREATE POLICY bertel_simulacros_admin_lectura ON public.%I FOR SELECT TO authenticated USING ((%s) AND (SELECT public.bertel_simulacros_admin_activo()))',t,predicate);
  EXECUTE format('DROP POLICY IF EXISTS bertel_simulacros_admin_limite ON public.%I',t);
  EXECUTE format('CREATE POLICY bertel_simulacros_admin_limite ON public.%I AS RESTRICTIVE FOR SELECT TO anon,authenticated USING (NOT (%s) OR (SELECT public.bertel_simulacros_admin_activo()))',t,predicate);
 END LOOP;
END;
$politicas$;

-- No se concede acceso directo a private.answer_keys.
-- La funcion siguiente comprueba el rol antes de consultar cualquier clave.
CREATE OR REPLACE FUNCTION public.bertel_admin_detalle_simulacro(p_assessment_id uuid)
RETURNS jsonb LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $fn$
DECLARE payload jsonb;
BEGIN
 IF NOT public.bertel_simulacros_admin_activo() THEN
  RAISE EXCEPTION 'Acceso exclusivo del administrador.' USING ERRCODE='42501';
 END IF;
 IF NOT public.bertel_es_simulacro_controlado(p_assessment_id) THEN
  RAISE EXCEPTION 'Evaluacion fuera de los simulacros 3, 4 y 5.' USING ERRCODE='22023';
 END IF;
 SELECT jsonb_build_object(
  'id',a.id,'title',a.title,'status',a.status,'duration_minutes',a.duration_minutes,
  'sections',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',s.id,'title',s.title,'section_order',s.section_order) ORDER BY s.section_order)
    FROM public.assessment_sections s WHERE s.assessment_id=a.id),'[]'::jsonb),
  'questions',COALESCE((SELECT jsonb_agg(jsonb_build_object(
    'id',q.id,'statement',q.statement,'status',q.status,
    'question_order',aq.question_order,'section_id',aq.section_id,
    'options',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',op.id,'option_text',op.option_text,'position',op.position) ORDER BY op.position)
      FROM public.question_options op WHERE op.question_id=q.id),'[]'::jsonb),
    'assets',COALESCE((SELECT jsonb_agg(jsonb_build_object('id',img.id,'asset_url',img.asset_url,'alt_text',img.alt_text) ORDER BY img.asset_url)
      FROM public.question_assets img WHERE img.question_id=q.id),'[]'::jsonb),
    'correct_option_id',(SELECT k.correct_option_id FROM private.answer_keys k WHERE k.question_id=q.id)
   ) ORDER BY aq.question_order)
   FROM public.assessment_questions aq JOIN public.questions q ON q.id=aq.question_id
   WHERE aq.assessment_id=a.id),'[]'::jsonb)
 ) INTO payload FROM public.assessments a WHERE a.id=p_assessment_id;
 IF payload IS NULL THEN RAISE EXCEPTION 'Evaluacion no encontrada.'; END IF;
 RETURN payload;
END;
$fn$;
REVOKE ALL ON FUNCTION public.bertel_admin_detalle_simulacro(uuid) FROM PUBLIC,anon,authenticated;
GRANT EXECUTE ON FUNCTION public.bertel_admin_detalle_simulacro(uuid) TO authenticated;

-- Storage: la descarga publica debe cerrarse para respetar el acceso exclusivo.
UPDATE storage.buckets SET public=false WHERE id='SIMULACROS' AND public IS DISTINCT FROM false;
-- storage.objects es una tabla administrada por Supabase con RLS habilitado.
-- No se modifica su propietario ni sus privilegios administrados.
DO $storage_rls$
BEGIN
 IF NOT EXISTS (SELECT 1 FROM pg_catalog.pg_class c
   JOIN pg_catalog.pg_namespace n ON n.oid=c.relnamespace
   WHERE n.nspname='storage' AND c.relname='objects' AND c.relrowsecurity) THEN
  RAISE EXCEPTION 'storage.objects debe tener RLS habilitado. Revisar configuracion de Storage.';
 END IF;
END;
$storage_rls$;
DROP POLICY IF EXISTS bertel_simulacros_storage_admin_lectura ON storage.objects;
CREATE POLICY bertel_simulacros_storage_admin_lectura ON storage.objects
 FOR SELECT TO authenticated USING (
  bucket_id='SIMULACROS' AND split_part(name,'/',1) IN ('SIMULACRO 3','SIMULACRO 4','SIMULACRO 5')
  AND (SELECT public.bertel_simulacros_admin_activo())
 );
DROP POLICY IF EXISTS bertel_simulacros_storage_admin_limite ON storage.objects;
CREATE POLICY bertel_simulacros_storage_admin_limite ON storage.objects
 AS RESTRICTIVE FOR SELECT TO anon,authenticated USING (
  bucket_id<>'SIMULACROS' OR split_part(name,'/',1) NOT IN ('SIMULACRO 3','SIMULACRO 4','SIMULACRO 5')
  OR (SELECT public.bertel_simulacros_admin_activo())
 );

-- Apply the same restriction to legacy attempt access and grading RPCs.
CREATE OR REPLACE FUNCTION private.bertel_assessment_allowed(p_user uuid, p_assessment uuid)
RETURNS boolean LANGUAGE sql STABLE SECURITY DEFINER SET search_path='' AS $fn$
 SELECT CASE WHEN public.bertel_es_simulacro_controlado(p_assessment)
 THEN p_user=auth.uid() AND public.bertel_simulacros_admin_activo()
 ELSE COALESCE(
  (SELECT a.enabled FROM private.bertel_assessment_access a WHERE a.user_id=p_user AND a.assessment_id=p_assessment),
  (SELECT NOT p.assessments_require_assignment FROM public.profiles p WHERE p.id=p_user),
  false)
 END;
$fn$;

DROP POLICY IF EXISTS bertel_simulacros_admin_limite ON public.assessment_attempts;
CREATE POLICY bertel_simulacros_admin_limite ON public.assessment_attempts
 AS RESTRICTIVE FOR SELECT TO anon,authenticated
 USING (NOT public.bertel_es_simulacro_controlado(assessment_id) OR (SELECT public.bertel_simulacros_admin_activo()));

DO $wrap$
BEGIN
 IF to_regprocedure('private.bertel_graded_review_before_simulacros(uuid)') IS NULL THEN
  ALTER FUNCTION public.get_graded_attempt_review(uuid) SET SCHEMA private;
  ALTER FUNCTION private.get_graded_attempt_review(uuid) RENAME TO bertel_graded_review_before_simulacros;
 END IF;
END;
$wrap$;
REVOKE ALL ON FUNCTION private.bertel_graded_review_before_simulacros(uuid) FROM PUBLIC,anon,authenticated;

CREATE OR REPLACE FUNCTION public.get_graded_attempt_review(p_attempt_id uuid)
RETURNS TABLE(question_id uuid,selected_option_id uuid,correct_option_id uuid,is_correct boolean)
LANGUAGE plpgsql STABLE SECURITY DEFINER SET search_path='' AS $fn$
BEGIN
 IF NOT public.bertel_simulacros_admin_activo() AND EXISTS (
  SELECT 1 FROM public.assessment_attempts a
  WHERE a.id=p_attempt_id AND public.bertel_es_simulacro_controlado(a.assessment_id)
 ) THEN
  RAISE EXCEPTION 'NOT_AUTHORIZED' USING ERRCODE='42501';
 END IF;
 RETURN QUERY SELECT * FROM private.bertel_graded_review_before_simulacros(p_attempt_id);
END;
$fn$;
REVOKE ALL ON FUNCTION public.get_graded_attempt_review(uuid) FROM PUBLIC,anon;
GRANT EXECUTE ON FUNCTION public.get_graded_attempt_review(uuid) TO authenticated;

NOTIFY pgrst,'reload schema';
COMMIT;

-- Resultado: seis filas con cantidades 120/134, sin cambiar draft a published.
SELECT a.id,a.title,a.status,count(aq.question_id) AS preguntas,
 count(k.correct_option_id) AS claves_validas
FROM public.assessments a
JOIN public.assessment_questions aq ON aq.assessment_id=a.id
LEFT JOIN private.answer_keys k ON k.question_id=aq.question_id
WHERE public.bertel_es_simulacro_controlado(a.id)
GROUP BY a.id,a.title,a.status ORDER BY a.title;

-- INTEGRACION DE CODEX EN LA INTERFAZ (comentarios, no ejecutar como SQL):
-- 1. Reutilizar las preguntas existentes. No crear preguntas desde nombres de JPG.
-- 2. Mostrar seis fichas en el panel ADMIN, incluyendo status draft.
-- 3. Al abrir una ficha con la sesion del administrador:
--    const {data,error}=await supabase.rpc('bertel_admin_detalle_simulacro',
--      {p_assessment_id: idDeLaEvaluacion});
-- 4. data.questions contiene numero, enunciado, seccion, opciones e imagenes.
--    Los enunciados reales estan en las imagenes. No mostrar solo statement.
-- 5. Para cada asset_url, extraer bucket/ruta sin el prefijo object/authenticated
--    u object/public, decodificar %20 y usar Storage createSignedUrls por lote,
--    con caducidad corta (p.ej. 300 s), mediante la sesion del ADMIN.
--    Mostrar lecturas compartidas antes de la imagen pregunta_XXX.jpg.
-- 6. correct_option_id es SOLO para revision del ADMIN. Nunca reutilizar este
--    RPC ni su respuesta en una pantalla/API de estudiante o profesor.
-- 7. Probar acceso directo: admin permitido; profesor, estudiante, anon denegados.
-- 8. Las rutas de servidor con service_role deben verificar identidad y rol
--    antes de leer registros o firmar URLs. service_role omite RLS.
-- 9. No publicar ni asignar cursos automaticamente. La habilitacion posterior
--    sera una accion manual del administrador con autorizacion de servidor.
--    Este bloqueo RLS inicial tambien debera adaptarse al implementar esa accion.
-- 10. No se invalida aqui ningun enlace firmado anterior: si sigue vigente,
--     gestionar su revocacion segun la configuracion real del proyecto.

