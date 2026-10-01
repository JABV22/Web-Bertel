# DECISIONES — Matriz técnica

**Última actualización:** 2026-09-05 · **Fase:** 0 — cerrada

> Las siete decisiones de CLAUDE.md §5 quedan **CONFIRMADAS** por ARCHITECTURE.md (DOC-02).
> Nada de esta matriz fue elegido por Claude: cada fila cita la sección que la fija.

## 1. Matriz exigida por CLAUDE.md §5

| Decisión | Valor confirmado | Estado | Fuente |
|---|---|---|---|
| **Frontend** | Next.js + TypeScript. Server Components, renderizado en servidor. UI con **Tailwind CSS** y componentes accesibles. Estructura `src/app`, `components`, `features`, `lib`, `services`, `types`, `hooks`, `validations`, `config`. | **CONFIRMADA** | ARCH §5, §51, §87 |
| **Backend** | Sin backend independiente en el MVP. Capa de servidor de Next.js: Server Components, Server Actions, Route Handlers y servicios internos. Lógica de negocio en la capa de aplicación/dominio, nunca en presentación. | **CONFIRMADA** | ARCH §5, §6, §7 |
| **Autenticación** | **Supabase Auth**. Correo + contraseña (WIREFRAMES A01). Recuperación por enlace (A02–A04). Estados de cuenta: `invited`, `active`, `inactive`, `suspended`. Roles: `student`, `teacher`, `coordinator`, `admin`, `superadmin`. | **CONFIRMADA** | ARCH §5, §10, §11 · PRD §16 · DB §8 |
| **Base de datos** | **PostgreSQL vía Supabase**. Esquemas `public`, `private`, `auth`, `storage`. UUID como PK, `timestamptz`. Migraciones SQL versionadas (`001_initial_schema.sql`…). Autorización por **RLS** + verificación en servidor. | **CONFIRMADA** | ARCH §5, §64 · DB §2, §3, §86 |
| **Archivos** | **Supabase Storage**. Los archivos viven fuera de la DB; `media_assets` guarda metadatos. Buckets: `/public`, `/questions`, `/private`. Visibilidad por archivo. | **CONFIRMADA** | ARCH §5, §55, §56 · DB §19 |
| **Operación** | Hosting **Vercel**, repositorio **GitHub**, dominio `www.preicfesbertel.com`. Entornos: Development, Staging (recomendado), Production. Secretos solo en variables de entorno; `service_role` **solo** en servidor. Logging por categorías: AUTH, DATABASE, EXAM, SCORING, UPLOAD, ADMIN. | **CONFIRMADA** | ARCH §4, §5, §60–63, §54 |
| **Validación** | Dos niveles: frontend para experiencia, backend para integridad y seguridad. Rama principal `main`, ramas `feature/*` y `fix/*`, cambios pequeños y verificables. | **CONFIRMADA** | ARCH §52, §84 |

**Versiones concretas:** DOC-02 no fija números de versión. Se elegirán las estables vigentes al
crear el proyecto y se registrarán aquí una vez instaladas (Fase 1). No se instalará una versión
mayor experimental sin motivo.

## 2. Reglas vinculantes que condicionan la implementación

Extraídas de DATABASE.md §87 («Reglas para Claude Code»), obligatorias:

1. No crear tablas improvisadas ni columnas sin documentar.
2. No borrar columnas directamente.
3. No alterar los esquemas `auth` ni `storage`.
4. **No desactivar RLS para resolver errores.**
5. No guardar claves correctas en tablas accesibles al estudiante.
6. No modificar versiones publicadas.
7. No meter historial académico en JSON sin justificación.

Y de DATABASE.md §55 (inmutabilidad): `QuestionVersion` tras `published`, `ExamVersion` tras
`published`, `Attempt` tras `submitted`, `Result` tras generarse, `Consent` tras aceptarse y
`AuditLog` siempre.

## 3. Decisiones locales de Claude (reversibles)

| # | Decisión | Estado tras el cotejo |
|---|---|---|
| DEC-L01 | Crear `CLAUDE.md` en la raíz | Vigente |
| DEC-L02 | Reconstruir el formato de tablas de `CLAUDE.md` | Vigente |
| DEC-L03 | Crear los documentos de Fase 0 | Vigente; ahora con contenido real |
| DEC-L04 | No inicializar Git ni instalar dependencias | **Caduca en Fase 1**: ARCH §84 exige Git con `main` + ramas `feature/*` |
| DEC-L05 | No copiar material de `Downloads` al proyecto | Parcialmente revocada: los 4 documentos sí se copiaron a `docs/` |
| DEC-L06 | Prototipo sin dependencias en `prototipo/` | **Se convierte en referencia visual.** El código productivo será Next.js (ARCH §5). Ver §4 |
| DEC-L07 | CSS 3D en lugar de WebGL | Vigente y compatible: no añade dependencias sobre Tailwind |
| DEC-L08 | Marca `#1D3564` / `#E6B332` con Inter | Vigente. DOC-01 §45 pide identidad «profesional, moderna, académica, confiable, juvenil sin resultar infantil» — coherente |
| DEC-L09 | Extraer el logotipo real del dashboard | Vigente. Único activo de marca disponible |
| DEC-L10 | Cifras como «—» y datos «Por confirmar» | Vigente hasta cargar `institutional_metrics` desde administración |
| **DEC-L11** | Guardar los 4 documentos en `docs/` y no en `docs/fuentes/` | **Nueva.** ARCHITECTURE §85 fija esa ruta explícitamente; prevalece sobre la sugerencia de CLAUDE.md §2 |
| **DEC-L12** | Conservar la tilde de «Preicfés» en la interfaz hasta resolver CONF-02 | **Nueva.** El logotipo real la lleva; cambiarla sin confirmar alteraría la marca |

## 4. Destino del prototipo visual

El prototipo de `prototipo/` **no se descarta ni se despliega tal cual**. Su valor es el sistema
visual verificado, que se porta a Next.js + Tailwind:

| Elemento del prototipo | Destino en el stack confirmado |
|---|---|
| `css/tokens.css` | `tailwind.config.ts` (`theme.extend`) + variables CSS globales |
| `css/base.css` (componentes compartidos) | `src/components/ui/*` |
| `js/escena.js` | Componente cliente de la landing, con `destruir()` en el `useEffect` de limpieza |
| `index.html` | `src/app/(public)/page.tsx` |
| `portal/*.html` | `src/app/campus/*` y `src/app/admin/*` |
| `assets/logo-bertel.png` | `public/` |

**Correcciones obligatorias antes de portarlo** (detectadas en el cotejo):

1. Sustituir «Instituciones y municipios» por **Preuniversitario** y **Magisterio** (PRD §9).
2. Añadir las páginas públicas que faltan: Metodología, Testimonios, FAQ, Privacidad, Términos (PRD §10).
3. Alinear rutas con ARCH §29–31 (`/nosotros`, `/programas/[slug]`, `/campus`, `/admin`, `/login`).
4. Revisar el puntaje: PRD §32 **sí permite** una escala tipo Saber 11 siempre que se etiquete como
   **puntaje estimado** y su fórmula sea configurable y documentada. El prototipo la omitía por
   completo; la regla real es «etiquetar», no «prohibir».

## 5. Decisiones que siguen pendientes del propietario

1. **CONF-02** — grafía «Preicfes» vs «Preicfés» (ver `FUENTES.md` §3).
2. **Razón social** para Política de privacidad y Términos (PRD §10).
3. **Credenciales de Supabase y Vercel** — no se piden por chat; se configuran como variables de
   entorno. Sin ellas, la Fase 2 queda bloqueada aunque el código exista.
4. **Autorización del material** (portafolios, simulacros, claves) como contenido y banco de preguntas.
5. **Contenido institucional real**: historia, misión, visión, valores, equipo, testimonios y cifras
   verificadas (PRD §12, §14).
