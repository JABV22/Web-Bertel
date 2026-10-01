# Plataforma Bertel

Plataforma educativa de **Preicfés Bertel**: sitio institucional público, campus privado para
estudiantes con simulacros Saber 11, y administración de contenidos, preguntas y pruebas.

**Estado actual: Fase 1 — base técnica.** La aplicación arranca y compila, pero todavía no hay
autenticación, base de datos ni interfaz de producto. Ver [docs/ESTADO.md](docs/ESTADO.md).

> **Nota para futuras sesiones de IA.** Next.js 16 introduce cambios de ruptura respecto a versiones
> anteriores: APIs, convenciones y estructura de archivos pueden diferir de lo memorizado. Consulta
> `node_modules/next/dist/docs/` antes de escribir código de framework.
>
> `next dev` intentaba inyectar este aviso dentro de `CLAUDE.md`. Se desactivó con
> `agentRules: false` en `next.config.ts` para que ninguna herramienta modifique el documento rector.

## Requisitos

| Herramienta | Versión usada | Nota |
|---|---|---|
| Node.js | 22.23.1 | Cualquier LTS ≥ 20 debería servir |
| npm | 10.9.8 | Incluido con Node |
| Git | 2.54.0 | Rama principal `main` (ARCHITECTURE.md §84) |

## Puesta en marcha

```sh
npm install
cp .env.example .env.local     # rellenar cuando existan credenciales
npm run dev
```

La aplicación queda en <http://localhost:3000>.

**`.env.local` no es obligatorio todavía.** Sin credenciales de Supabase la aplicación arranca igual;
solo dejará de funcionar cuando la Fase 2 introduzca autenticación y datos.

## Comandos reales

| Comando | Qué hace | Verificado |
|---|---|---|
| `npm run dev` | Servidor de desarrollo | ✅ |
| `npm run build` | Compilación de producción | ✅ |
| `npm run start` | Sirve la compilación | No probado |
| `npm run lint` | ESLint | ✅ |

## Stack

Confirmado por [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §5 y §87 — no elegido por conveniencia:

- **Next.js 16** + **TypeScript** + **React 19** — App Router, Server Components
- **Tailwind CSS 4** — tokens de marca en `src/app/globals.css`
- **Supabase** (PostgreSQL + Auth + Storage) — se conecta en la Fase 2
- **Vercel** + **GitHub** — despliegue, aún no configurado

## Estructura

```
src/
├── app/           Rutas (App Router)
├── components/    Componentes de presentación reutilizables
├── features/      Un módulo por dominio: auth, students, questions, exams…
├── lib/           Utilidades transversales
├── services/      Acceso a datos y contratos con Supabase
├── types/         Tipos compartidos
├── hooks/         Hooks de React
├── validations/   Esquemas de validación de entrada
└── config/        Constantes no secretas

supabase/migrations/   Migraciones SQL versionadas (vacío hasta la Fase 2)
docs/                  PRD, arquitectura, modelo de datos, wireframes y seguimiento
prototipo/             Referencia visual navegable (HTML/CSS, sin dependencias)
```

Sigue [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §51.

## Documentación

| Documento | Contenido |
|---|---|
| [CLAUDE.md](CLAUDE.md) | Guía de ejecución del proyecto |
| [docs/PRD.md](docs/PRD.md) | Producto, MVP, reglas de negocio y criterios de aceptación |
| [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) | Stack, módulos, rutas y capas |
| [docs/DATABASE.md](docs/DATABASE.md) | 44 tablas, RLS, versionado e inmutabilidad |
| [docs/WIREFRAMES.md](docs/WIREFRAMES.md) | ~85 pantallas y reglas UX |
| [docs/ESTADO.md](docs/ESTADO.md) | Dónde está el trabajo ahora mismo |
| [docs/ROADMAP.md](docs/ROADMAP.md) | Fases y bloqueos |
| [docs/DECISIONES.md](docs/DECISIONES.md) | Matriz técnica confirmada |
| [docs/PANTALLAS.md](docs/PANTALLAS.md) | Inventario de pantallas |
| [docs/TRAZABILIDAD.md](docs/TRAZABILIDAD.md) | Requisitos → pantallas → datos → evidencia |
| [docs/DISENO.md](docs/DISENO.md) | Dirección artística y origen verificado de la marca |

## Seguridad — reglas que no se negocian

De [docs/DATABASE.md](docs/DATABASE.md) §87 y [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) §63:

- **Nunca** desactivar RLS para resolver un error.
- `SUPABASE_SERVICE_ROLE_KEY` **solo** en servidor: nunca en el navegador, en Git ni en capturas.
- Las claves de respuesta viven en el esquema `private` y **no viajan al cliente** durante una prueba.
- Las versiones publicadas de preguntas y pruebas son **inmutables**: se crea una nueva versión.
- Se prefiere **archivar** antes que eliminar.

## Pendiente del propietario

1. **Credenciales de Supabase** — bloquean la Fase 2. Se configuran en `.env.local`, nunca por chat.
2. **Grafía de la marca** — los documentos escriben «Preicfes»; el logotipo, «Preicfés» (CONF-02).
3. **Razón social** para privacidad y términos.
4. **Contenido institucional real** — historia, misión, visión, valores, equipo y cifras verificadas.
