# ROADMAP — Plan de ejecución

**Última actualización:** 2026-11-18 · **Fase activa:** 2 — Datos, autenticación y autorización

> Sin estimaciones en días (CLAUDE.md §8). Las casillas se marcan **después de verificar
> comportamiento**, no por haber escrito código.

## Estado por fases

| Fase | Objetivo | Estado | Nota |
|---|---|---|---|
| **0** | Cotejo y plan ejecutable | ✅ **CERRADA** | 4/4 documentos leídos; decisiones confirmadas; MVP identificado |
| **1** | Base técnica y entorno | ✅ **CERRADA** | Next.js 16 + TS + Tailwind 4 + Git `main`. Build, lint y arranque verificados |
| **2** | Datos, autenticación y autorización | 🟡 **EN CURSO** | Aplicación conectada al modelo DOC-05; migraciones aún no validadas ni aplicadas |
| **3** | Sitio público y contenidos administrables | 🟡 Parcial | Sistema visual listo en `prototipo/`; falta portarlo y 6 de 11 páginas |
| **4** | Banco de preguntas y construcción de pruebas | 🔴 Bloqueada | Requiere Fases 1–2 |
| **5** | Resolución de simulacros | 🔴 Bloqueada | Requiere Fase 4 |
| **6** | Calificación, revisión y seguimiento | 🔴 Bloqueada | Requiere Fase 5 |
| **7** | Integración y aceptación | 🔴 Bloqueada | Requiere Fases 1–6 |
| **8** | Preparación y puesta en producción | 🔴 Bloqueada | **La publicación no está autorizada en el encargo vigente** |
| **9** | Operación y evolución | 🔴 Bloqueada | Requiere Fase 8 |

## Reconciliación con ARCHITECTURE.md §80

DOC-02 fija su propio orden de construcción de 16 pasos. **No contradice** las fases de CLAUDE.md:
es el mismo camino con más granularidad. Correspondencia:

| ARCH §80 | Fase CLAUDE.md |
|---|---|
| 1. Infraestructura base | **1** |
| 2. Auth · 3. Users | **2** |
| 4. Programs · 5. Groups · 6. Subjects | **2** (datos maestros) |
| 7. Questions · 8. Exams | **4** |
| 9. Attempts · 10. Responses | **5** |
| 11. Scoring · 12. Results | **6** |
| 13. Campus · 14. Administration | transversal a 4–6 |
| 15. CMS | **3** |
| 16. Analytics | **6** |

**Diferencia registrada:** ARCH §80 pone el CMS (paso 15) casi al final, mientras la Fase 3 de
CLAUDE.md lo sitúa antes del banco de preguntas. Se sigue **el orden de ARCH §80** para la lógica
(auth y datos maestros primero), pero el sitio público puede avanzar en paralelo porque solo depende
de `site_content_blocks` y `programs`. Ninguna de las dos fuentes lo prohíbe.

## Fase 0 — cerrada

- [x] Los cuatro documentos localizados, copiados a `docs/` y **leídos íntegros**
- [x] `FUENTES.md` con estado real de lectura (4/4)
- [x] `DECISIONES.md` con las 7 decisiones en **CONFIRMADA** y su sección de origen
- [x] `PANTALLAS.md` con los IDs originales de DOC-04 y el cotejo contra el prototipo
- [x] `TRAZABILIDAD.md` con los 20 criterios `CA-xx` y las 10 reglas `RB-xxx` del PRD
- [x] MVP identificado (PRD §60) y fuera de alcance registrado (PRD §61)
- [x] Contradicciones: CONF-01 **resuelta**, CONF-02 y CONF-03 registradas
- [x] Reglas vinculantes de DB §87 y §55 incorporadas a `DECISIONES.md`

**Criterio de salida cumplido:** cada documento tiene estado real de lectura; stack, permisos, datos
y reglas están confirmados o con pendiente explícito.

## Fase 1 — cerrada

**Trabajo:** crear el proyecto Next.js + TypeScript + Tailwind con la estructura de ARCH §51,
inicializar Git con `main` (ARCH §84), `.env.example` sin secretos, `README.md` y comandos reales.

**Entregables:** proyecto reproducible, dependencias bloqueadas, `.env.example`, `README.md`.

**Salida verificada:**

| Criterio | Evidencia |
|---|---|
| La aplicación compila | `npm run build` → «Compiled successfully», 0 errores de TypeScript |
| La aplicación arranca | `npm run start` → HTTP 200 y render confirmado por captura |
| Sin errores de lint | `npm run lint` → sin problemas |
| No hay secretos versionados | `.env*` ignorado, con excepción `!.env.example`; `node_modules` ignorado |
| Estructura aprobada | `src/{app,components,features,lib,services,types,hooks,validations,config}` + 12 módulos en `features/` (ARCH §51) |
| Git | Repositorio inicializado en `main` (ARCH §84). **Sin commit todavía**: pendiente de autorización |

Captura: `docs/capturas/11-fase1-app-arranca.png`.

No se crearon recursos de pago. No se tocó Supabase ni Vercel.

## Fase 2 — en curso

**Trabajo:** cotejar el esquema DOC-05 (24 tablas, 109 columnas), RLS, datos sintéticos, Supabase
Auth, sesiones, matriz de permisos por rol y alta controlada del primer administrador.

**Criterio de salida:** esquema remoto cotejado; migraciones aplicadas en desarrollo; autenticación y
aislamiento comprobados con perfiles de estudiante, docente y administrador.

**Bloqueo real:** aún no se ha podido confirmar conexión a Supabase ni aplicar o probar
migraciones. La metodología de puntaje ya fue definida por DOC-06 y está implementada en la
migración 004, pero falta verificarla en una instancia de desarrollo.

**Reconciliación de fuentes:** el DOC-05 recibido el 2026-11-18 prevalece sobre DOC-03 v1.0 para el
esquema de 24 tablas y sustituye las decisiones de un solo intento y porcentaje del 2026-11-09.
Ver `docs/DICCIONARIO_DATOS.md` y `docs/DECISIONES.md` §7.

## Bloqueos reales pendientes del propietario

| # | Bloqueo | Qué impide | Cómo se resuelve |
|---|---|---|---|
| 1 | **Acceso de administración a Supabase** | Aplicar migraciones y verificar RLS | Confirmar un proyecto de desarrollo/staging y configurar la conexión de forma local; nunca compartir claves por chat |
| 2 | **CONF-02** — grafía «Preicfes» / «Preicfés» | Wordmark y textos legales | Confirmar cuál es la correcta |
| 3 | **Razón social** | Privacidad y Términos (P10, P11) | Indicar la entidad legal |
| 4 | **Contenido institucional real** | P02, P06, P07 | Historia, misión, visión, valores, equipo, cifras verificadas |
| 5 | **Autorización del material** | Fase 3 y 4 | Confirmar si portafolios, simulacros y claves pueden usarse |
| 6 | **Validación del puntaje estimado** | Verificación de Fase 6 | Probar en Supabase el ejemplo de DOC-06 y casos de prueba parcial, sin respuestas y con áreas mal configuradas |

El bloqueo 1 impide cerrar la Fase 2. Los demás no impiden escribir las migraciones.
