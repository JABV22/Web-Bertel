# TRAZABILIDAD — Requisitos → pantallas → datos → evidencia

**Última actualización:** 2026-09-05 · **Fuente:** PRD.md §59, §60, §65, §66

> IDs **originales del PRD**: `RB-xxx` son reglas de negocio (§59) y `CA-xx` los criterios de
> aceptación del MVP (§65). Los IDs `REQ-Lxx` de la sesión anterior quedan **retirados**: eran
> locales y ya no hacen falta.
>
> Estado: **No verificado** en todas las filas — no existe código productivo todavía.

## 1. Criterios de aceptación del MVP — PRD §65

| ID | Requisito | Prioridad | Pantallas | Datos / servicios | Fase | Estado |
|---|---|---|---|---|---|---|
| CA-01 | Un visitante puede navegar por el sitio público | P1 | P01–P11 | `site_pages`, `site_content_blocks`, `programs` | 3 | No verificado |
| CA-02 | Un estudiante puede iniciar sesión | **P0** | A01 | Supabase Auth, `profiles`, `user_roles` | 2 | No verificado |
| CA-03 | Un administrador puede crear un estudiante | **P0** | AD05 | `profiles`, `students`, `user_roles` | 2 | No verificado |
| CA-04 | Puede crear un grupo | **P0** | AD11 | `cohorts`, `enrollments` | 2 | No verificado |
| CA-05 | Puede crear preguntas | **P0** | AD18 | `questions`, `question_versions`, `question_version_options`, `private.question_answer_keys` | 4 | No verificado |
| CA-06 | Puede crear una prueba | **P0** | AD23–AD28 | `exams`, `exam_versions`, `exam_sections`, `exam_items` | 4 | No verificado |
| CA-07 | Puede asignarla | **P0** | AD27 | `exam_assignments` | 4 | No verificado |
| CA-08 | El estudiante puede iniciarla | **P0** | C03 | `exam_attempts`, `attempt_items` (transacción DB §68) | 5 | No verificado |
| CA-09 | Las respuestas se guardan | **P0** | C04/C05 | `attempt_responses` (transacción DB §69) | 5 | No verificado |
| CA-10 | El temporizador funciona | **P0** | C04 | `started_at`, `expires_at` — reloj del servidor | 5 | No verificado |
| CA-11 | El estudiante puede entregar | **P0** | C07 | `exam_attempts.submitted_at` | 5 | No verificado |
| CA-12 | El sistema califica | **P0** | C08 | `private.scoring_models`, `attempt_results`, `private.attempt_result_items`, `attempt_result_breakdowns` (DB §70) | 6 | No verificado |
| CA-13 | El estudiante consulta el resultado permitido | **P0** | C09–C11 | `result_release_mode`, `answer_release_mode` | 6 | No verificado |
| CA-14 | El administrador consulta resultados | P1 | AD32–AD33 | Vistas `v_exam_result_summary` | 6 | No verificado |
| CA-15 | **No hay acceso a datos ajenos** | **P0** | Todas | RLS (DB §59–§66) | 2 | No verificado |
| CA-16 | **No se exponen respuestas correctas durante la prueba** | **P0** | C04 | `private.question_answer_keys` fuera del cliente (DB §83) | 4–5 | No verificado |
| CA-17 | Funciona en móvil y escritorio | P1 | Todas | — | 3–7 | No verificado |
| CA-18 | Se conserva historial | **P0** | C12 | Inmutabilidad (DB §55), versionado (DB §53–54) | 6 | No verificado |
| CA-19 | Se actualizan preguntas y pruebas sin modificar código | **P0** | AD17–AD31 | CMS académico | 4 | No verificado |
| CA-20 | El contenido administrable se actualiza sin redeploy | P1 | AD37–AD41 | `site_content_blocks`, invalidación de caché | 3 | No verificado |

## 2. Reglas de negocio — PRD §59

| ID | Regla | Dónde se impone | Fase | Estado |
|---|---|---|---|---|
| RB-001 | Todo usuario debe tener un rol | `user_roles` + alta controlada | 2 | No verificado |
| RB-002 | Estudiantes solo acceden a contenido autorizado | RLS + `exam_assignments` | 2, 4 | No verificado |
| RB-003 | Pruebas en borrador no son visibles | `exam_versions.status` + RLS | 4 | No verificado |
| RB-004 | Respuestas correctas no se exponen durante prueba activa | Esquema `private` + servidor | 4, 5 | No verificado |
| RB-005 | Cada intento pertenece a un único estudiante | `exam_attempts.student_id` + RLS | 5 | No verificado |
| RB-006 | Cada respuesta pertenece a un intento | FK `attempt_id` + validación de `option_id` | 5 | No verificado |
| RB-007 | Un intento entregado queda cerrado | Trigger de inmutabilidad (DB §78) | 5 | No verificado |
| RB-008 | Un resultado debe poder reproducirse desde las respuestas | `scoring_configuration_snapshot` | 6 | No verificado |
| RB-009 | Datos históricos no se sobrescriben al modificar una prueba | Versionado de examen (DB §54, §95) | 4 | No verificado |
| RB-010 | Una pregunta usada históricamente no se elimina físicamente | Archivado (DB §56) | 4 | No verificado |

## 3. Escenarios críticos — CLAUDE.md §9 vs PRD §58

Los doce escenarios de CLAUDE.md §9 **aplican todos** y coinciden con PRD §58 y DB §71–72.
Se ejecutan en Fase 7 y se registran en `VALIDACION.md`. Ninguno verificado todavía.

Correspondencia relevante:

| Escenario CLAUDE.md §9 | Respaldo documental |
|---|---|
| Estudiante modifica el ID de un intento ajeno | RLS DB §64 |
| Inspección de red durante una prueba | ARCH §47, DB §83 |
| Guardados en distinto orden | `attempt_responses.revision` |
| Dos finalizaciones simultáneas | DB §70 «debe ser idempotente» + §71 `SELECT … FOR UPDATE` |
| Doble pestaña | ARCH §73, DB §72 |
| Cambio de pregunta tras iniciar | Versionado DB §53, §95 |

## 4. Fuera del alcance del MVP — PRD §61

**No implementar**: app móvil nativa, videoconferencia, streaming, LMS completo, pagos complejos,
marketplace, certificados, gamificación avanzada, red social, chat, IA personalizada, TRI propia,
reconocimiento facial, proctoring por cámara, bloqueo del computador, sistema contable y CRM completo.

Coincide con la prohibición de CLAUDE.md §3. **V2** (PRD §62) y **V3** (PRD §63) quedan registradas
como backlog, no como trabajo actual.

## 5. Aclaración importante sobre el puntaje estimado

PRD §32 **permite** presentar una escala relacionada con Saber 11 siempre que:

1. se identifique como **puntaje estimado**, nunca como puntaje oficial;
2. la fórmula sea **configurable** (`private.scoring_models.configuration`, estrategia
   `estimated_icfes`) y esté **documentada**.

Esto matiza la posición conservadora de sesiones anteriores: la regla es **etiquetar y documentar**,
no prohibir. CLAUDE.md §6 sigue siendo compatible: exige «definición, etiqueta y metodología
autorizadas», que es exactamente lo que pide el PRD.
