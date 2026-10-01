# MODELO COMPLETO DE BASE DE DATOS
## Plataforma Educativa Preicfes Bertel

**Versión:** 1.0  
**Motor:** PostgreSQL mediante Supabase  
**Documentos relacionados:** PRD Maestro v1.0 + Arquitectura Completa v1.0

---

# 1. Propósito

Definir tablas, columnas, relaciones, claves, restricciones, estados, versionado, historial, índices, reglas de eliminación, seguridad, RLS y almacenamiento de evaluaciones, respuestas, resultados y contenido.

---

# 2. Principios del modelo

- integridad;
- historial reproducible;
- seguridad;
- normalización;
- JSONB solo donde tenga sentido;
- archivado antes que eliminación;
- UUID como identificador principal;
- `timestamptz` para eventos temporales.

---

# 3. Esquemas

```text
auth
└── gestionado por Supabase

public
├── perfiles
├── estudiantes
├── preguntas
├── pruebas
└── resultados permitidos

private
├── claves correctas
├── scoring
├── auditoría
└── configuraciones sensibles

storage
└── gestionado por Supabase Storage
```

---

# 4. Auth y perfiles

No se modificará directamente `auth.users`.

`public.profiles.id` será PK y FK hacia `auth.users.id`.

---

# 5. Tablas principales

## Identidad

1. profiles
2. roles
3. user_roles
4. students

## Organización académica

5. programs
6. subjects
7. program_subjects
8. topics
9. competencies
10. cohorts
11. enrollments
12. staff_group_assignments

## Multimedia

13. media_assets

## Preguntas

14. questions
15. question_versions
16. question_version_options
17. private.question_answer_keys
18. question_version_assets
19. question_reviews

## Evaluaciones

20. private.scoring_models
21. exams
22. exam_versions
23. exam_sections
24. exam_items
25. exam_assignments

## Accesos

26. access_codes
27. access_code_redemptions

## Intentos

28. exam_attempts
29. attempt_items
30. attempt_responses
31. attempt_events

## Resultados

32. attempt_results
33. private.attempt_result_items
34. attempt_result_breakdowns

## Sitio institucional

35. site_pages
36. site_content_blocks
37. testimonials
38. faqs
39. institutional_metrics
40. contact_leads

## Legal

41. legal_documents
42. user_consents

## Sistema

43. private.audit_logs
44. private.system_settings

---

# 6. Convención general

La mayoría de tablas utilizará:

```text
id UUID PRIMARY KEY
created_at TIMESTAMPTZ
updated_at TIMESTAMPTZ
```

Cuando corresponda:

```text
created_by UUID
updated_by UUID
archived_at TIMESTAMPTZ
```

---

# 7. profiles

`public.profiles`

| Campo | Tipo | Regla |
|---|---|---|
| id | UUID | PK + FK auth.users.id |
| first_name | TEXT | NOT NULL |
| last_name | TEXT | NOT NULL |
| preferred_name | TEXT | NULL |
| phone | TEXT | NULL |
| avatar_media_id | UUID | FK media_assets |
| status | TEXT | NOT NULL |
| anonymized_at | TIMESTAMPTZ | NULL |
| created_at | TIMESTAMPTZ | NOT NULL |
| updated_at | TIMESTAMPTZ | NOT NULL |

Estados:

- invited;
- active;
- inactive;
- suspended.

---

# 8. roles

`public.roles`

| Campo | Tipo |
|---|---|
| id | UUID PK |
| code | TEXT UNIQUE |
| name | TEXT |
| description | TEXT |
| created_at | TIMESTAMPTZ |

Valores iniciales:

- student;
- teacher;
- coordinator;
- admin;
- superadmin.

---

# 9. user_roles

Relaciona usuarios con roles.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| user_id | UUID FK profiles |
| role_id | UUID FK roles |
| assigned_by | UUID FK profiles |
| assigned_at | TIMESTAMPTZ |
| revoked_at | TIMESTAMPTZ NULL |

Restricción:

`UNIQUE(user_id, role_id)`

---

# 10. students

`public.students`

| Campo | Tipo |
|---|---|
| user_id | UUID PK + FK profiles |
| student_code | TEXT UNIQUE |
| notes | TEXT NULL |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

No almacena contraseñas, resultados, grupos ni programas.

---

# 11. programs

| Campo | Tipo |
|---|---|
| id | UUID PK |
| code | TEXT UNIQUE |
| slug | TEXT UNIQUE |
| name | TEXT |
| short_description | TEXT |
| status | TEXT |
| is_public | BOOLEAN |
| sort_order | INTEGER |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Estados:

- draft;
- active;
- inactive;
- archived.

---

# 12. subjects

| Campo | Tipo |
|---|---|
| id | UUID PK |
| code | TEXT UNIQUE |
| name | TEXT |
| description | TEXT |
| status | TEXT |
| created_at | TIMESTAMPTZ |

---

# 13. program_subjects

Relaciona programas y materias.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| program_id | UUID FK programs |
| subject_id | UUID FK subjects |
| position | INTEGER |
| is_required | BOOLEAN |

`UNIQUE(program_id, subject_id)`

---

# 14. topics

Permite jerarquía de temas.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| subject_id | UUID FK subjects |
| parent_topic_id | UUID FK topics NULL |
| code | TEXT |
| name | TEXT |
| status | TEXT |
| created_at | TIMESTAMPTZ |

`UNIQUE(subject_id, code)`

---

# 15. competencies

| Campo | Tipo |
|---|---|
| id | UUID PK |
| subject_id | UUID FK subjects |
| code | TEXT |
| name | TEXT |
| description | TEXT |
| status | TEXT |

---

# 16. cohorts

Representa grupos/cohortes.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| program_id | UUID FK programs |
| code | TEXT UNIQUE |
| name | TEXT |
| period_label | TEXT |
| start_date | DATE |
| end_date | DATE |
| status | TEXT |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Estados:

- planned;
- active;
- finished;
- archived.

---

# 17. enrollments

Relaciona estudiantes con grupos.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| student_id | UUID FK students |
| cohort_id | UUID FK cohorts |
| status | TEXT |
| enrolled_at | TIMESTAMPTZ |
| ended_at | TIMESTAMPTZ NULL |
| created_by | UUID FK profiles |

`UNIQUE(student_id, cohort_id)`

---

# 18. staff_group_assignments

Relaciona docentes/coordinadores con grupos.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| user_id | UUID FK profiles |
| cohort_id | UUID FK cohorts |
| assignment_role | TEXT |
| starts_at | DATE |
| ends_at | DATE NULL |
| status | TEXT |

Roles:

- teacher;
- coordinator.

---

# 19. media_assets

Metadatos de archivos.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| bucket | TEXT |
| storage_path | TEXT |
| original_filename | TEXT |
| mime_type | TEXT |
| size_bytes | BIGINT |
| visibility | TEXT |
| uploaded_by | UUID FK profiles |
| created_at | TIMESTAMPTZ |

`UNIQUE(bucket, storage_path)`

---

# 20. questions

Representa identidad lógica de una pregunta.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| code | TEXT UNIQUE |
| subject_id | UUID FK subjects |
| topic_id | UUID FK topics NULL |
| competency_id | UUID FK competencies NULL |
| difficulty | SMALLINT |
| lifecycle_status | TEXT |
| created_by | UUID FK profiles |
| created_at | TIMESTAMPTZ |
| archived_at | TIMESTAMPTZ NULL |

`CHECK difficulty BETWEEN 1 AND 5`

---

# 21. question_versions

| Campo | Tipo |
|---|---|
| id | UUID PK |
| question_id | UUID FK questions |
| version_number | INTEGER |
| stem_markdown | TEXT |
| status | TEXT |
| authored_by | UUID FK profiles |
| created_at | TIMESTAMPTZ |
| published_at | TIMESTAMPTZ NULL |

Estados:

- draft;
- review;
- published;
- rejected.

`UNIQUE(question_id, version_number)`

Una versión publicada es inmutable.

---

# 22. question_version_options

| Campo | Tipo |
|---|---|
| id | UUID PK |
| question_version_id | UUID FK |
| option_key | TEXT |
| option_text | TEXT |
| position | SMALLINT |
| created_at | TIMESTAMPTZ |

Restricciones:

- `UNIQUE(question_version_id, option_key)`
- `UNIQUE(question_version_id, position)`

---

# 23. private.question_answer_keys

Tabla especialmente sensible.

| Campo | Tipo |
|---|---|
| question_version_id | UUID PK |
| correct_option_id | UUID FK question_version_options |
| solution_markdown | TEXT |
| created_by | UUID FK profiles |
| created_at | TIMESTAMPTZ |

No será accesible directamente desde el cliente estudiante.

---

# 24. question_version_assets

Relaciona recursos multimedia.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| question_version_id | UUID FK |
| media_asset_id | UUID FK |
| usage_type | TEXT |
| position | INTEGER |

---

# 25. question_reviews

| Campo | Tipo |
|---|---|
| id | UUID PK |
| question_version_id | UUID FK |
| reviewer_id | UUID FK profiles |
| decision | TEXT |
| notes | TEXT |
| reviewed_at | TIMESTAMPTZ |

Decision:

- approved;
- changes_requested;
- rejected.

---

# 26. private.scoring_models

| Campo | Tipo |
|---|---|
| id | UUID PK |
| code | TEXT |
| name | TEXT |
| version | INTEGER |
| strategy | TEXT |
| configuration | JSONB |
| status | TEXT |
| created_at | TIMESTAMPTZ |

`UNIQUE(code, version)`

Estrategias futuras:

- simple_percentage;
- weighted;
- estimated_icfes;
- irt.

---

# 27. exams

Identidad lógica del simulacro.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| code | TEXT UNIQUE |
| program_id | UUID FK programs |
| lifecycle_status | TEXT |
| created_by | UUID FK profiles |
| created_at | TIMESTAMPTZ |
| archived_at | TIMESTAMPTZ NULL |

---

# 28. exam_versions

| Campo | Tipo |
|---|---|
| id | UUID PK |
| exam_id | UUID FK exams |
| version_number | INTEGER |
| title | TEXT |
| description | TEXT |
| instructions | TEXT |
| duration_minutes | INTEGER |
| scoring_model_id | UUID FK scoring_models |
| status | TEXT |
| created_by | UUID |
| created_at | TIMESTAMPTZ |
| published_at | TIMESTAMPTZ NULL |

Estados:

- draft;
- published;
- retired.

`UNIQUE(exam_id, version_number)`

Una versión publicada es inmutable.

---

# 29. exam_sections

| Campo | Tipo |
|---|---|
| id | UUID PK |
| exam_version_id | UUID FK |
| subject_id | UUID FK NULL |
| title | TEXT |
| instructions | TEXT NULL |
| position | INTEGER |
| weight | NUMERIC |
| created_at | TIMESTAMPTZ |

`UNIQUE(exam_version_id, position)`

---

# 30. exam_items

Une una sección con una versión específica de pregunta.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| section_id | UUID FK exam_sections |
| question_version_id | UUID FK question_versions |
| position | INTEGER |
| points | NUMERIC |
| required | BOOLEAN |

`UNIQUE(section_id, position)`

---

# 31. exam_assignments

Define quién puede hacer una prueba y cuándo.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| exam_version_id | UUID FK |
| program_id | UUID FK NULL |
| cohort_id | UUID FK NULL |
| student_id | UUID FK NULL |
| status | TEXT |
| opens_at | TIMESTAMPTZ |
| closes_at | TIMESTAMPTZ NULL |
| attempts_allowed | INTEGER |
| result_release_mode | TEXT |
| answer_release_mode | TEXT |
| randomize_questions | BOOLEAN |
| randomize_options | BOOLEAN |
| created_by | UUID |
| created_at | TIMESTAMPTZ |

Exactamente uno de `program_id`, `cohort_id`, `student_id` debe tener valor.

---

# 32. Modos de liberación

## Resultados

- immediate;
- after_close;
- manual;
- hidden.

## Respuestas correctas

- immediate;
- after_close;
- manual;
- never.

---

# 33. access_codes

| Campo | Tipo |
|---|---|
| id | UUID PK |
| code_hash | TEXT UNIQUE |
| display_hint | TEXT |
| program_id | UUID NULL |
| cohort_id | UUID NULL |
| exam_assignment_id | UUID NULL |
| max_redemptions | INTEGER NULL |
| expires_at | TIMESTAMPTZ NULL |
| status | TEXT |
| created_by | UUID |
| created_at | TIMESTAMPTZ |

El código completo no tiene que almacenarse en texto plano.

---

# 34. access_code_redemptions

| Campo | Tipo |
|---|---|
| id | UUID PK |
| access_code_id | UUID FK |
| user_id | UUID FK profiles |
| redeemed_at | TIMESTAMPTZ |

`UNIQUE(access_code_id, user_id)`

---

# 35. exam_attempts

Representa un intento concreto.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| exam_assignment_id | UUID FK |
| exam_version_id | UUID FK |
| student_id | UUID FK |
| attempt_number | INTEGER |
| status | TEXT |
| started_at | TIMESTAMPTZ |
| expires_at | TIMESTAMPTZ |
| submitted_at | TIMESTAMPTZ NULL |
| submission_reason | TEXT NULL |
| auto_submitted | BOOLEAN |
| created_at | TIMESTAMPTZ |

Estados:

- in_progress;
- submitted;
- expired;
- cancelled.

`UNIQUE(student_id, exam_assignment_id, attempt_number)`

---

# 36. attempt_items

Conserva cómo fue presentada realmente la prueba.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| attempt_id | UUID FK |
| exam_item_id | UUID FK |
| display_position | INTEGER |
| option_order | UUID[] |
| created_at | TIMESTAMPTZ |

Restricciones:

- `UNIQUE(attempt_id, exam_item_id)`
- `UNIQUE(attempt_id, display_position)`

---

# 37. attempt_responses

| Campo | Tipo |
|---|---|
| id | UUID PK |
| attempt_id | UUID FK |
| attempt_item_id | UUID FK |
| selected_option_id | UUID FK NULL |
| is_flagged | BOOLEAN |
| first_answered_at | TIMESTAMPTZ NULL |
| updated_at | TIMESTAMPTZ |
| revision | INTEGER |

`UNIQUE(attempt_id, attempt_item_id)`

Solo se modifica mientras el intento esté activo.

---

# 38. attempt_events

| Campo | Tipo |
|---|---|
| id | UUID PK |
| attempt_id | UUID FK |
| event_type | TEXT |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Eventos:

- started;
- resumed;
- connection_lost;
- connection_restored;
- submitted;
- auto_submitted;
- expired.

---

# 39. attempt_results

Resultado general.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| attempt_id | UUID UNIQUE FK |
| scoring_model_id | UUID FK |
| scoring_configuration_snapshot | JSONB |
| raw_score | NUMERIC |
| max_score | NUMERIC |
| percentage | NUMERIC |
| scaled_score | NUMERIC NULL |
| correct_count | INTEGER |
| incorrect_count | INTEGER |
| unanswered_count | INTEGER |
| generated_at | TIMESTAMPTZ |

`CHECK percentage BETWEEN 0 AND 100`

---

# 40. private.attempt_result_items

Resultado pregunta por pregunta.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| result_id | UUID FK |
| attempt_item_id | UUID FK |
| selected_option_id | UUID NULL |
| correct_option_id | UUID |
| is_correct | BOOLEAN |
| points_awarded | NUMERIC |
| max_points | NUMERIC |
| subject_id | UUID |
| topic_id | UUID NULL |
| competency_id | UUID NULL |

Especialmente protegida por contener respuestas correctas.

---

# 41. attempt_result_breakdowns

Resultado agregado por dimensión.

| Campo | Tipo |
|---|---|
| id | UUID PK |
| result_id | UUID FK |
| dimension_type | TEXT |
| subject_id | UUID NULL |
| topic_id | UUID NULL |
| competency_id | UUID NULL |
| correct_count | INTEGER |
| incorrect_count | INTEGER |
| unanswered_count | INTEGER |
| points_awarded | NUMERIC |
| max_points | NUMERIC |
| percentage | NUMERIC |
| scaled_score | NUMERIC NULL |

Dimensiones:

- subject;
- topic;
- competency.

---

# 42. site_pages

| Campo | Tipo |
|---|---|
| id | UUID PK |
| slug | TEXT UNIQUE |
| title | TEXT |
| seo_title | TEXT |
| seo_description | TEXT |
| status | TEXT |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |
| published_at | TIMESTAMPTZ NULL |

---

# 43. site_content_blocks

| Campo | Tipo |
|---|---|
| id | UUID PK |
| page_id | UUID FK |
| block_key | TEXT |
| block_type | TEXT |
| content | JSONB |
| position | INTEGER |
| status | TEXT |
| updated_by | UUID |
| updated_at | TIMESTAMPTZ |

`UNIQUE(page_id, block_key)`

---

# 44. testimonials

| Campo | Tipo |
|---|---|
| id | UUID PK |
| name | TEXT |
| testimonial | TEXT |
| program_id | UUID NULL |
| year | INTEGER NULL |
| photo_media_id | UUID NULL |
| status | TEXT |
| sort_order | INTEGER |
| created_at | TIMESTAMPTZ |

---

# 45. faqs

| Campo | Tipo |
|---|---|
| id | UUID PK |
| question | TEXT |
| answer | TEXT |
| category | TEXT |
| program_id | UUID NULL |
| status | TEXT |
| position | INTEGER |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

---

# 46. institutional_metrics

| Campo | Tipo |
|---|---|
| id | UUID PK |
| program_id | UUID NULL |
| year | INTEGER |
| metric_code | TEXT |
| label | TEXT |
| numeric_value | NUMERIC NULL |
| display_value | TEXT |
| unit | TEXT NULL |
| description | TEXT NULL |
| source_note | TEXT NULL |
| is_featured | BOOLEAN |
| status | TEXT |

---

# 47. contact_leads

| Campo | Tipo |
|---|---|
| id | UUID PK |
| name | TEXT |
| phone | TEXT |
| email | TEXT NULL |
| program_id | UUID NULL |
| message | TEXT NULL |
| source | TEXT |
| status | TEXT |
| created_at | TIMESTAMPTZ |
| updated_at | TIMESTAMPTZ |

Estados:

- new;
- contacted;
- qualified;
- enrolled;
- closed.

---

# 48. legal_documents

| Campo | Tipo |
|---|---|
| id | UUID PK |
| document_type | TEXT |
| version | INTEGER |
| title | TEXT |
| content | TEXT |
| effective_at | TIMESTAMPTZ |
| status | TEXT |
| created_at | TIMESTAMPTZ |

Tipos:

- terms;
- privacy;
- data_processing;
- consent.

---

# 49. user_consents

| Campo | Tipo |
|---|---|
| id | UUID PK |
| user_id | UUID FK |
| legal_document_id | UUID FK |
| actor_type | TEXT |
| actor_name | TEXT NULL |
| accepted_at | TIMESTAMPTZ |
| evidence_reference | TEXT NULL |

Actor:

- self;
- guardian;
- administrator.

---

# 50. private.audit_logs

| Campo | Tipo |
|---|---|
| id | UUID PK |
| actor_user_id | UUID NULL |
| action | TEXT |
| entity_type | TEXT |
| entity_id | UUID NULL |
| metadata | JSONB |
| created_at | TIMESTAMPTZ |

Append-only.

---

# 51. private.system_settings

| Campo | Tipo |
|---|---|
| key | TEXT PK |
| value | JSONB |
| description | TEXT |
| updated_by | UUID |
| updated_at | TIMESTAMPTZ |

No almacena secretos.

---

# 52. Información que nunca debe guardarse en tablas normales

- contraseñas;
- service secret keys;
- tokens privados;
- claves API;
- credenciales SMTP;
- secretos de terceros.

---

# 53. Versionado de preguntas

```text
QUESTION
├── VERSION 1 [published]
├── VERSION 2 [published]
└── VERSION 3 [draft]
```

Una versión publicada no se modifica; se crea una nueva.

---

# 54. Versionado de exámenes

Mismo principio. Una versión que ya tenga intentos permanece intacta.

---

# 55. Inmutabilidad

Entidades inmutables tras ciertos estados:

- QuestionVersion tras `published`;
- ExamVersion tras `published`;
- Attempt tras `submitted`;
- Result tras generación definitiva;
- Consent tras aceptación;
- AuditLog siempre.

---

# 56. Política de eliminación

- usuarios: inactivar/suspender/anónimizar;
- estudiantes: no eliminar si tienen intentos;
- preguntas: archivar;
- versiones publicadas: no eliminar;
- pruebas: archivar;
- intentos: no eliminar salvo procedimiento excepcional;
- resultados: no eliminar.

---

# 57. Anonimización

Se deberá poder separar información identificable del historial académico cuando la legislación lo requiera y exista base legal para conservar estadísticas.

---

# 58. Índices principales

## Users

```text
user_roles(user_id)
user_roles(role_id)
profiles(status)
```

## Students

```text
enrollments(student_id, status)
enrollments(cohort_id, status)
```

## Questions

```text
questions(subject_id)
questions(topic_id)
questions(competency_id)
questions(lifecycle_status)
questions(difficulty)
question_versions(question_id, version_number)
question_versions(status)
```

## Exams

```text
exams(program_id)
exam_versions(exam_id, version_number)
exam_assignments(cohort_id)
exam_assignments(student_id)
exam_assignments(program_id)
exam_assignments(status)
exam_assignments(opens_at, closes_at)
```

## Attempts

```text
exam_attempts(student_id)
exam_attempts(exam_assignment_id)
exam_attempts(status)
exam_attempts(expires_at)
```

## Responses

```text
attempt_responses(attempt_id)
```

## Results

```text
attempt_results(attempt_id)
attempt_result_breakdowns(result_id)
```

---

# 59. RLS — principio

```text
¿quién eres?
      ↓
¿qué rol tienes?
      ↓
¿este registro te pertenece
o tienes permiso?
      ↓
ALLOW / DENY
```

---

# 60. RLS — perfiles

Estudiante:

- SELECT propio;
- UPDATE solo campos permitidos.

Admin:

- gestión autorizada.

---

# 61. RLS — estudiantes

Estudiante: solo su registro.  
Docente: estudiantes de grupos asignados.  
Coordinador: grupos autorizados.  
Admin: todos.

---

# 62. RLS — preguntas

Estudiante no tendrá acceso indiscriminado al banco. Solo al contenido asociado a un intento autorizado.

---

# 63. RLS — answer keys

`private.question_answer_keys` no se expondrá directamente al cliente.

---

# 64. RLS — intentos

Estudiante solo puede consultar sus intentos.

---

# 65. RLS — respuestas

El estudiante solo podrá escribir respuestas si:

```text
attempt.student_id = auth.uid()
AND attempt.status = 'in_progress'
AND now() < expires_at
```

---

# 66. RLS — resultados

Estudiante solo ve resultados propios y el nivel de detalle dependerá de los modos de liberación.

---

# 67. Helper functions

Funciones conceptuales:

```text
has_role(user_id, role_code)
is_staff_of_cohort(user_id, cohort_id)
student_has_exam_access(student_id, assignment_id)
```

---

# 68. Operación iniciar simulacro

Debe ser transaccional:

1. validar usuario;
2. validar asignación;
3. validar fecha;
4. validar intentos;
5. evitar carrera;
6. crear attempt;
7. calcular expires_at;
8. generar attempt_items;
9. generar orden de opciones.

---

# 69. Operación guardar respuesta

Transacción:

1. verificar attempt;
2. verificar propietario;
3. verificar estado;
4. verificar tiempo;
5. verificar option_id;
6. UPSERT response.

---

# 70. Operación finalizar prueba

Transacción crítica:

1. bloquear attempt;
2. verificar no entregado;
3. marcar submitted;
4. impedir nuevas respuestas;
5. cargar claves;
6. calcular;
7. crear result;
8. crear result_items;
9. crear breakdowns.

Debe ser idempotente.

---

# 71. Concurrencia

Para operaciones críticas se podrán usar bloqueos como `SELECT ... FOR UPDATE`.

---

# 72. Doble pestaña

Las pestañas apuntan al mismo `attempt_id`. La primera entrega válida bloquea nuevas escrituras.

---

# 73. Vistas recomendadas

- `v_student_active_enrollments`;
- `v_student_available_exams`;
- `v_student_attempt_history`;
- `v_admin_question_bank`;
- `v_exam_result_summary`;
- `v_cohort_performance`.

---

# 74. Dashboard

Se evitarán cientos de consultas. Se usarán SQL agregados y, cuando el volumen lo justifique, materialized views o tablas resumen.

---

# 75. Datos derivados

Fuente de verdad:

`attempt_responses`

Resultado derivado:

`attempt_results`

Estadística derivada:

promedios y agregaciones.

---

# 76. Importaciones

Las importaciones de Excel/CSV pasarán por staging y validación antes de insertarse en tablas definitivas.

---

# 77. Exportaciones

Los reportes deberán generarse desde vistas autorizadas, nunca exportando tablas sensibles completas.

---

# 78. Triggers recomendados

- `updated_at`;
- protección de versiones publicadas;
- protección de respuestas tras cierre;
- auditoría de operaciones relevantes.

---

# 79. Restricciones de integridad

Evitar:

- attempt_number <= 0;
- duration_minutes <= 0;
- points < 0;
- percentage fuera de 0–100;
- difficulty fuera de 1–5;
- opens_at > closes_at.

---

# 80. ERD del núcleo

```text
PROGRAM
   │
   ├──── SUBJECT
   │       │
   │       ├──── TOPIC
   │       ├──── COMPETENCY
   │       └──── QUESTION
   │                │
   │                ▼
   │         QUESTION_VERSION
   │                │
   │                ├──── OPTION
   │                └──── ANSWER_KEY
   │
   └──── EXAM
            │
            ▼
       EXAM_VERSION
            │
            ▼
       EXAM_SECTION
            │
            ▼
         EXAM_ITEM
            │
            ▼
      QUESTION_VERSION
```

---

# 81. ERD estudiante/resultados

```text
AUTH.USER
    ↓
 PROFILE
    ↓
 STUDENT
    ↓
 ENROLLMENT
    ↓
 COHORT
    ↓
 EXAM_ASSIGNMENT
    ↓
 EXAM_ATTEMPT
    ├── ATTEMPT_ITEM
    └── ATTEMPT_RESPONSE
            ↓
       ATTEMPT_RESULT
        ├── RESULT_ITEM
        └── RESULT_BREAKDOWN
```

---

# 82. Cardinalidades principales

- User 1—1 Profile
- Profile 1—N UserRoles
- Role 1—N UserRoles
- Profile 1—0..1 Student
- Program 1—N Cohorts
- Student N—N Cohorts mediante Enrollments
- Program N—N Subjects mediante ProgramSubjects
- Subject 1—N Topics
- Subject 1—N Competencies
- Subject 1—N Questions
- Question 1—N QuestionVersions
- QuestionVersion 1—N Options
- QuestionVersion 1—1 AnswerKey
- Exam 1—N ExamVersions
- ExamVersion 1—N ExamSections
- ExamSection 1—N ExamItems
- ExamItem N—1 QuestionVersion
- ExamAssignment 1—N Attempts
- Student 1—N Attempts
- Attempt 1—N AttemptItems
- Attempt 1—N Responses
- Attempt 1—0..1 Result
- Result 1—N ResultItems
- Result 1—N ResultBreakdowns

---

# 83. Datos críticos que no llegan al navegador durante prueba

- answer keys;
- correct_option_id;
- solution_markdown;
- scoring interno;
- result_item.correct_option_id.

---

# 84. Backups

Los backups deberán cubrir PostgreSQL y Storage. GitHub solo conserva código.

---

# 85. Seed data

El repositorio podrá incluir:

- roles;
- subjects;
- competencies;
- programas iniciales;
- defaults del sistema.

Nunca estudiantes reales.

---

# 86. Migraciones

Toda modificación estructural se hará mediante migraciones SQL versionadas.

Ejemplo:

```text
001_initial_schema.sql
002_add_questions.sql
003_add_exam_versions.sql
004_add_attempt_results.sql
```

---

# 87. Reglas para Claude Code

Claude no deberá:

- crear tablas improvisadas;
- agregar columnas sin documentarlas;
- borrar columnas directamente;
- alterar `auth` o `storage`;
- desactivar RLS para resolver errores;
- guardar claves correctas en tablas accesibles al estudiante;
- modificar versiones publicadas;
- introducir historial académico en JSON sin justificación.

---

# 88. Checklist de migración

Cada migración debe responder:

- qué cambia;
- qué datos existentes afecta;
- si requiere transformación;
- si requiere índice;
- si requiere RLS;
- cómo se revierte;
- cómo afecta producción.

---

# 89. Nomenclatura

- tablas: `snake_case` plural;
- columnas: `snake_case`;
- FK: `<entity>_id`.

---

# 90. IDs humanos

Además del UUID se podrán usar códigos legibles, por ejemplo `MAT-00154`.

---

# 91. Escalabilidad

El modelo deberá soportar desde cientos hasta miles de estudiantes, decenas de miles de preguntas y millones de respuestas sin reconstruir el núcleo.

La tabla de mayor crecimiento probablemente será `attempt_responses`.

---

# 92. Particionamiento futuro

No implementar inicialmente. Evaluar solo cuando el volumen lo justifique.

---

# 93. Analítica futura

El modelo permitirá calcular:

- dificultad empírica;
- porcentaje de acierto;
- discriminación;
- desempeño por competencia;
- evolución histórica;
- comparación entre cohortes.

---

# 94. Futuro IRT

Se podrá agregar una tabla de calibración sin cambiar preguntas, intentos y respuestas.

---

# 95. Regla maestra de historial

Nunca:

`UPDATE pregunta antigua → cambia resultado antiguo`

Siempre:

`Nueva versión → nuevos simulacros → historial antiguo intacto`

---

# 96. Regla maestra de resultados

```text
RESPUESTA ORIGINAL
attempt_responses
        ↓
CALIFICACIÓN HISTÓRICA
attempt_result_items
        ↓
RESUMEN
attempt_results + breakdowns
```

---

# 97. Regla maestra de seguridad

La seguridad existe en:

- frontend;
- servidor;
- permisos de base de datos;
- RLS.

---

# 98. Regla maestra de contenido

Datos académicos: relacionales.  
Contenido institucional variable: relacional + JSONB controlado.

---

# 99. Criterios de aceptación

El modelo debe permitir crear usuarios, roles, estudiantes, programas, grupos, materias, preguntas versionadas, pruebas versionadas, asignaciones, intentos, respuestas, resultados, estadísticas, contenido, leads, consentimientos y auditoría sin comprometer historial ni seguridad.

---

# 100. Decisión final

La Plataforma Educativa Preicfes Bertel utilizará PostgreSQL/Supabase mediante un modelo relacional versionado.

Preguntas y pruebas publicadas serán inmutables.

Claves correctas y scoring sensible permanecerán separados.

Se evitará eliminación histórica mediante archivado.

La seguridad se implementará con autorización de servidor, permisos de base de datos y RLS.

**Fin — Modelo Completo de Base de Datos v1.0**
