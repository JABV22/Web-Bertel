# Diccionario de datos vigente

**Fuente:** `C:\Users\kent\Downloads\Diccionario_de_Datos_PreICFES_Bertel.pdf`  
**Consulta:** 2026-11-18 · 9 páginas · 24 tablas · 109 columnas  
**SHA-256:** `CFCE9332A1FB64893B40D0FC04822C24719C16BEE9E1C5D66CB509C4D50B519C`

Este resumen identifica el modelo vigente y sus reglas visibles. El PDF original se conserva en
la ruta de origen; este archivo no reemplaza ni transcribe sus fichas.

## Tablas por módulo

| Módulo | Tablas |
|---|---|
| Usuarios y gestión académica | `profiles`, `roles`, `user_roles`, `academic_periods`, `subjects`, `programs`, `courses`, `student_groups`, `course_enrollments`, `course_teachers` |
| Banco de preguntas | `questions`, `question_options`, `private.answer_keys`, `competencies`, `topics`, `subtopics`, `question_assets`, `question_topics` |
| Evaluaciones e intentos | `assessments`, `assessment_sections`, `assessment_questions`, `assessment_attempts`, `student_answers`, `assessment_results` |

## Relaciones y reglas explícitas

- `profiles.id` referencia `auth.users.id`; `user_roles` relaciona perfiles y roles con clave
  primaria compuesta.
- Los IDs de catálogos académicos son `bigint`; los cursos y perfiles usan `uuid`.
- Un curso pertenece a un programa y período académico. Las matrículas enlazan estudiantes,
  cursos y, opcionalmente, grupos; los docentes se asignan por curso.
- Las claves se guardan en `private.answer_keys`. La opción correcta referencia una alternativa de
  la misma pregunta.
- `assessment_questions` vincula evaluación y pregunta; la misma dupla identifica la fila.
  `question_order` es único dentro de la evaluación y una sección opcional pertenece a esa misma
  evaluación.
- Una evaluación publicada puede ser presentada varias veces por un estudiante. No se documenta
  un máximo de intentos.
- `assessment_attempts.status` contempla `en_progreso`, `enviado` y `clasificado`. La fecha de
  vencimiento y de entrega son opcionales; el inicio es requerido.
- `assessment_results` permite un resultado por intento. `total_score` y `assessment_attempts.score`
  son `numeric(7,2)`; el diccionario describe el rango 0–500, pero no especifica fórmula, método de
  estimación ni redondeo. La fórmula se definió posteriormente en DOC-06.
- El esquema no contiene versionado de preguntas/evaluaciones ni una política de liberación de
  respuestas; la migración existente protege contenido asociado a intentos, pero no crea
  instantáneas.

## Decisiones de producto vigentes

Confirmadas por el propietario el 2026-11-18, con la fórmula completada el 2026-11-19:

1. Este diccionario reemplaza al modelo de `DATABASE.md` v1.0 para el esquema de datos de esta
   implementación.
2. Se permiten múltiples intentos por evaluación; no se impondrá un máximo mientras no se defina.
3. La escala de resultados será estimada de 0 a 500, nunca presentada como puntaje oficial ICFES.
4. DOC-06 define la fórmula de puntaje por área y la ponderación global estimada 0–500. El método
   no representa el modelo oficial IRT del ICFES.

Las decisiones del 2026-11-09 que no contradicen estas cuatro reglas continúan vigentes. Ver
[`DECISIONES.md`](./DECISIONES.md).

## Configuración y validación pendientes

- La migración `001_exam_authorization.sql` asume que las 24 tablas ya existen; no crea el esquema
  base.
- La migración `003_multiple_attempts_pending_scoring.sql` permite nuevos intentos. La migración
  `004_estimated_icfes_scoring.sql` aplica la fórmula confirmada por DOC-06.
- No se ha comprobado el esquema de la instancia Supabase ni aplicado migración alguna.
- Antes de datos reales se debe verificar RLS por rol, integridad de claves/alternativas, intentos
  simultáneos, entrega idempotente y correspondencia del esquema remoto con el PDF.
