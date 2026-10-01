# ARQUITECTURA COMPLETA DEL SISTEMA
## Plataforma Educativa Preicfes Bertel

**Versión:** 1.0  
**Documento relacionado:** PRD Maestro v1.0  
**Tipo:** Arquitectura funcional, lógica y técnica de alto nivel

---

# 1. Propósito

Este documento define cómo se divide el sistema, qué módulos existen, cómo se comunican, qué rutas tendrá la plataforma, qué información es pública o privada, qué operaciones se ejecutan en servidor y cómo deberá crecer la aplicación.

---

# 2. Principio arquitectónico

La plataforma se construirá como una **aplicación web monolítica modular**:

- un proyecto principal;
- un dominio;
- una aplicación;
- módulos internos separados;
- base de datos central;
- autenticación centralizada;
- despliegue centralizado.

No se utilizarán microservicios inicialmente.

---

# 3. Arquitectura general

```text
                 PREICFES BERTEL
                       │
                       ▼
              APLICACIÓN WEB CENTRAL
                       │
       ┌───────────────┼────────────────┐
       │               │                │
       ▼               ▼                ▼
  SITIO PÚBLICO     CAMPUS          ADMINISTRACIÓN
       │               │                │
   Visitantes      Estudiantes      Personal autorizado
```

---

# 4. Dominio y rutas

Dominio principal:

`https://www.preicfesbertel.com`

Estructura:

```text
/
├── nosotros
├── programas
├── metodologia
├── resultados
├── faq
├── contacto
├── login
├── campus
└── admin
```

No se separarán inicialmente campus y admin en subdominios.

---

# 5. Stack tecnológico

## Frontend

**Next.js + TypeScript**

Responsable de páginas, navegación, componentes, dashboards, formularios y experiencia de usuario.

## Diseño

**Tailwind CSS** y componentes accesibles.

## Backend

Capa de servidor de Next.js:

- Server Components;
- Server Actions;
- Route Handlers;
- servicios internos.

No se creará backend independiente en el MVP.

## Base de datos

**PostgreSQL mediante Supabase**

## Autenticación

**Supabase Auth**

## Archivos

**Supabase Storage**

## Hosting

**Vercel**

## Repositorio

**GitHub**

---

# 6. Modelo de capas

```text
┌───────────────────────────────┐
│          PRESENTACIÓN         │
│ UI / páginas / componentes    │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│        LÓGICA DE APLICACIÓN   │
│ casos de uso / servicios      │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│          DOMINIO              │
│ reglas del negocio            │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│         INFRAESTRUCTURA       │
│ DB / Auth / Storage           │
└───────────────┬───────────────┘
                │
┌───────────────▼───────────────┐
│        SERVICIOS EXTERNOS     │
└───────────────────────────────┘
```

---

# 7. Responsabilidades por capa

## Presentación

- mostrar información;
- recibir interacción;
- validación básica;
- llamar al servidor;
- mostrar resultados.

No contendrá reglas críticas.

## Lógica de aplicación

Casos de uso:

- crearEstudiante();
- crearPregunta();
- crearPrueba();
- iniciarIntento();
- guardarRespuesta();
- finalizarIntento();
- calcularResultado();
- asignarPrueba();
- publicarPrueba();

## Dominio

Reglas como:

- prueba en borrador no puede iniciarse;
- intento entregado no puede modificarse;
- estudiante solo accede a pruebas autorizadas;
- pregunta archivada no entra a nuevas pruebas;
- prueba cerrada no admite nuevos intentos.

## Infraestructura

Integración con PostgreSQL, Auth, Storage y servicios externos.

---

# 8. Módulos principales

```text
01 Public Website
02 Authentication
03 Users
04 Students
05 Programs
06 Groups
07 Subjects
08 Questions
09 Exams
10 Attempts
11 Responses
12 Scoring
13 Results
14 Analytics
15 CMS
16 Media
17 Access Codes
18 Administration
19 Audit
20 System Settings
```

---

# 9. Public Website

Incluye:

- Inicio;
- Nosotros;
- Programas;
- Metodología;
- Resultados;
- Testimonios;
- FAQ;
- Contacto.

No contendrá lógica académica crítica.

---

# 10. Authentication

Responsable de:

- login;
- logout;
- sesiones;
- recuperación de contraseña;
- protección de rutas;
- identificación de usuario.

---

# 11. Users

Maneja identidad interna, perfil, rol y estado.

Roles iniciales:

```text
student
teacher
coordinator
admin
superadmin
```

---

# 12. Students

Maneja información académica del estudiante, grupos, programas e historial relacionado.

Usuario y estudiante son conceptos separados.

---

# 13. Programs

Maneja productos educativos como PreICFES, Preuniversitario y Magisterio.

---

# 14. Groups

Maneja cohortes, estudiantes, docentes asignados, pruebas y estadísticas.

---

# 15. Subjects

Maneja:

- materia;
- tema;
- subtema;
- competencia.

---

# 16. Questions

Maneja banco de preguntas:

- crear;
- editar;
- revisar;
- publicar;
- archivar;
- filtrar;
- buscar;
- multimedia;
- respuesta correcta.

---

# 17. Exams

Maneja:

- información general;
- instrucciones;
- secciones;
- preguntas;
- duración;
- fechas;
- reglas;
- asignaciones.

---

# 18. Attempts

Un intento representa una sesión real de un estudiante dentro de una prueba.

Estados:

```text
in_progress
submitted
expired
cancelled
```

---

# 19. Responses

Almacena respuestas seleccionadas mientras el intento esté activo.

---

# 20. Scoring

Calcula:

- correctas;
- incorrectas;
- sin responder;
- porcentaje;
- resultados por materia;
- resultados por tema.

Debe estar separado de la interfaz.

---

# 21. Results

Guarda y consulta resultados históricos.

---

# 22. Analytics

Estadísticas agregadas:

- promedio estudiante;
- grupo;
- materia;
- preguntas falladas;
- evolución;
- tasa de finalización.

---

# 23. CMS

Permite modificar sin código:

- programas;
- textos institucionales;
- resultados destacados;
- testimonios;
- FAQ;
- bloques de página.

No habrá edición arbitraria de HTML.

---

# 24. Media

Maneja:

- imágenes de preguntas;
- imágenes institucionales;
- recursos gráficos;
- archivos permitidos.

---

# 25. Access Codes

Maneja códigos adicionales para grupos, programas o pruebas. No sustituye cuentas personales.

---

# 26. Administration

Es una interfaz que consume los módulos de negocio. No duplicará lógica.

---

# 27. Audit

Registra acciones sensibles: creación, modificación, archivado, eliminación, publicación, asignación y cambios de permisos.

---

# 28. System Settings

Centraliza configuraciones generales no secretas.

---

# 29. Rutas públicas

```text
/
├── /nosotros
├── /programas
│   └── /[slug]
├── /metodologia
├── /resultados
├── /testimonios
├── /faq
├── /contacto
├── /login
├── /recuperar-contrasena
├── /politica-privacidad
└── /terminos
```

---

# 30. Rutas del campus

```text
/campus
├── /pruebas
│   ├── /disponibles
│   └── /[examId]
├── /intentos
│   └── /[attemptId]
├── /resultados
│   └── /[resultId]
├── /historial
├── /progreso
└── /perfil
```

---

# 31. Rutas administrativas

```text
/admin
├── /dashboard
├── /usuarios
├── /estudiantes
├── /docentes
├── /programas
├── /grupos
├── /materias
├── /temas
├── /preguntas
├── /pruebas
├── /resultados
├── /estadisticas
├── /contenido
├── /archivos
├── /codigos-acceso
├── /auditoria
└── /configuracion
```

---

# 32. Protección de rutas

## Públicas

No requieren autenticación.

## Privadas

Requieren autenticación.

## Administrativas

Requieren autenticación y rol autorizado.

Ocultar botones no es una medida de seguridad suficiente.

---

# 33. Control de acceso

```text
USUARIO
   │
   ▼
¿Está autenticado?
   │
   ▼
¿Tiene el rol?
   │
   ▼
¿Tiene permiso sobre este recurso?
   │
   ▼
BASE DE DATOS / RLS
```

---

# 34. Flujo de autenticación

```text
Usuario
  │
  ▼
/login
  │
  ▼
Supabase Auth
  │
  ├── error
  └── sesión válida
          │
          ▼
      consultar rol
          │
          ├── student → /campus
          └── admin   → /admin
```

---

# 35. Flujo de creación de estudiante

```text
Administrador
    ↓
Crear estudiante
    ↓
Validar datos
    ↓
Crear identidad
    ↓
Crear perfil
    ↓
Crear estudiante
    ↓
Asignar programa/grupo
    ↓
Generar acceso
```

---

# 36. Flujo del banco de preguntas

```text
Docente/Admin
    ↓
Nueva pregunta
    ↓
Materia / Tema / Competencia / Dificultad
    ↓
Enunciado
    ↓
Opciones
    ↓
Respuesta correcta
    ↓
Explicación
    ↓
Guardar borrador
    ↓
Revisar
    ↓
Publicar
```

---

# 37. Flujo de creación de prueba

```text
Administrador
    ↓
Nueva prueba
    ↓
Información general
    ↓
Secciones
    ↓
Preguntas
    ↓
Tiempo
    ↓
Fechas
    ↓
Intentos
    ↓
Asignación
    ↓
Revisión
    ↓
Publicación
```

---

# 38. Flujo de inicio de prueba

El servidor verifica:

- autenticación;
- autorización;
- fecha;
- intentos;
- estado.

Después crea un intento y registra la hora inicial.

---

# 39. Flujo de respuesta

```text
Estudiante
    ↓
Selecciona opción
    ↓
Frontend actualiza estado local
    ↓
Envía al servidor
    ↓
Servidor valida intento
    ↓
Guarda respuesta
    ↓
Confirma guardado
```

---

# 40. Autoguardado

Dos niveles:

1. estado local temporal;
2. persistencia en servidor como fuente definitiva.

---

# 41. Temporizador

El tiempo no dependerá solo del navegador.

Se almacenarán:

```text
started_at
expires_at
```

La decisión final será del servidor.

---

# 42. Finalización

```text
Entregar
  ↓
Confirmación
  ↓
Servidor valida
  ↓
Bloquea nuevas respuestas
  ↓
Marca submitted
  ↓
Calcula resultado
  ↓
Guarda resultado
  ↓
Muestra vista permitida
```

---

# 43. Finalización automática

Cuando `now() >= expires_at`, el servidor considera el intento vencido o autoentregado según configuración.

---

# 44. Resultados

```text
Intento finalizado
      ↓
Respuestas
      ↓
Clave correcta
      ↓
Correctas / Incorrectas / Sin responder
      ↓
Agrupar por materia / tema / competencia
      ↓
Guardar resultado histórico
```

---

# 45. Inmutabilidad histórica

Cambios futuros no deben alterar resultados previos.

Preguntas y pruebas deberán versionarse.

---

# 46. Pregunta de banco vs pregunta usada

Se distinguirá entre:

- pregunta lógica del banco;
- versión de pregunta;
- ítem incluido en una versión de examen.

---

# 47. Datos enviados durante prueba

Se podrán enviar:

- ID;
- enunciado;
- multimedia;
- opciones.

No se enviarán:

- respuesta correcta;
- explicación;
- scoring interno.

---

# 48. Servidor como autoridad

Operaciones que deben ejecutarse o verificarse en servidor:

- crear usuario;
- cambiar rol;
- crear intento;
- validar acceso;
- guardar respuesta;
- finalizar prueba;
- calcular resultado;
- revelar respuesta correcta;
- modificar resultados;
- administrar preguntas;
- publicar pruebas.

---

# 49. Cliente como interfaz

El navegador puede:

- mostrar páginas;
- cambiar preguntas;
- mostrar tiempo;
- mantener caché temporal;
- validar experiencia.

Nunca será autoridad final.

---

# 50. Componentes reutilizables

## Generales

- Button;
- Input;
- Select;
- Checkbox;
- RadioGroup;
- Modal;
- Drawer;
- Table;
- Pagination;
- Badge;
- Tabs;
- Card;
- Alert;
- Toast;
- Dropdown;
- DatePicker;
- FileUploader;
- Chart;
- StatCard.

## Académicos

- QuestionCard;
- QuestionNavigator;
- AnswerOption;
- ExamTimer;
- ExamProgress;
- ExamHeader;
- ExamInstructions;
- QuestionFlag;
- AutosaveIndicator;
- ResultSummary;
- SubjectScore;
- PerformanceChart.

## Admin

- AdminSidebar;
- AdminHeader;
- DataTable;
- FiltersBar;
- SearchInput;
- StatusBadge;
- FormSection;
- DeleteDialog;
- PublishDialog;
- AssignmentSelector;
- QuestionEditor;
- ExamBuilder.

---

# 51. Estructura de frontend

```text
src/
├── app/
├── components/
├── features/
├── lib/
├── services/
├── types/
├── hooks/
├── validations/
└── config/
```

Dentro de `features`:

```text
auth/
students/
groups/
programs/
subjects/
questions/
exams/
attempts/
results/
analytics/
cms/
admin/
```

---

# 52. Validación

Dos niveles:

- frontend para experiencia;
- backend para integridad y seguridad.

---

# 53. Errores

El usuario verá mensajes claros. Los errores técnicos se registrarán internamente.

---

# 54. Logging

Categorías:

- AUTH;
- DATABASE;
- EXAM;
- SCORING;
- UPLOAD;
- ADMIN.

No se registrarán datos sensibles innecesarios.

---

# 55. Archivos

Los archivos se almacenarán fuera de la base de datos; la DB conservará metadatos y referencias.

---

# 56. Storage

Organización conceptual:

```text
/public
    /programs
    /team
    /website

/questions
    /images
    /charts

/private
    /internal
```

---

# 57. Caché

Se podrá cachear contenido institucional poco variable. No se cachearán de manera riesgosa respuestas, intentos ni resultados privados.

---

# 58. SEO

Indexables:

- `/`;
- `/programas`;
- `/nosotros`;
- `/resultados`.

No indexables:

- `/campus`;
- `/admin`;
- `/login`.

---

# 59. Analytics

La analítica comercial se mantendrá separada de datos académicos sensibles.

---

# 60. Despliegue

```text
Código local
    ↓
Git
    ↓
GitHub
    ↓
Vercel
    ↓
Aplicación
```

---

# 61. Entornos

- Development;
- Staging recomendado;
- Production.

Development utilizará datos ficticios.

---

# 62. Variables de entorno

Credenciales y secretos nunca se escribirán en código público.

---

# 63. Service Role

La clave privilegiada de Supabase deberá existir solo en servidor.

Nunca en cliente, GitHub, capturas ni documentación pública.

---

# 64. Row Level Security

Las tablas sensibles implementarán RLS. Una petición a un recurso deberá verificar pertenencia o permiso administrativo real.

---

# 65. Borrado

Se preferirá archivar o desactivar frente a eliminación física en estudiantes, preguntas, pruebas y resultados.

---

# 66. Versionado

Se versionarán preguntas, pruebas y reglas de puntuación sensibles.

---

# 67. Escalabilidad

La arquitectura evolucionará desde monolito modular. Solo se separarán servicios cuando exista una necesidad técnica demostrada.

---

# 68. Cuellos de botella previstos

- miles de respuestas simultáneas;
- imágenes pesadas;
- dashboards complejos;
- pruebas grandes;
- estadísticas históricas;
- inicios masivos de examen.

---

# 69. Consultas

No se cargarán datos indiscriminadamente. Se usarán paginación, filtros y consultas específicas.

---

# 70. Importaciones y exportaciones

La arquitectura permitirá posteriormente importación de estudiantes/preguntas y exportación de resultados con validación y permisos.

---

# 71. Responsive del examen

Debe funcionar bien en móvil, tablet y desktop. En móvil se priorizarán pregunta, opciones, temporizador y navegación.

---

# 72. Resiliencia de conexión

Se mostrarán estados de conexión, se reintentará el guardado y no se descartará inmediatamente el estado local.

No se promete offline completo en V1.

---

# 73. Doble pestaña

Ambas pestañas apuntarán al mismo intento. La entrega bloqueará las dos.

---

# 74. Resultados inmediatos o diferidos

Configuración:

```text
result_release_mode:
- immediate
- after_close
- manual
- hidden

answer_release_mode:
- immediate
- after_close
- manual
- never
```

---

# 75. Scoring configurable

La arquitectura deberá permitir estrategias futuras:

- percentage;
- weighted;
- estimated_icfes;
- irt.

---

# 76. Contactos comerciales

```text
Visitante
    ↓
Formulario
    ↓
Validación
    ↓
Guardar lead
    ↓
Panel administrativo
```

---

# 77. Futuro de pagos

Mantener separado del módulo de evaluaciones.

---

# 78. Futuro de IA

```text
Resultados
    ↓
Academic Analytics
    ↓
Recommendation Engine
    ↓
AI Tutor
```

La IA consumirá datos; no será propietaria del núcleo.

---

# 79. Dependencias entre módulos

```text
AUTH
 ↓
USERS
 ↓
STUDENTS
 ↓
GROUPS
 ↓
EXAMS
 ↓
ATTEMPTS
 ↓
RESPONSES
 ↓
SCORING
 ↓
RESULTS
 ↓
ANALYTICS

SUBJECTS
 ↓
QUESTIONS
 ↓
EXAMS
```

---

# 80. Orden de construcción

1. Infraestructura base
2. Auth
3. Users
4. Programs
5. Groups
6. Subjects
7. Questions
8. Exams
9. Attempts
10. Responses
11. Scoring
12. Results
13. Campus
14. Administration
15. CMS
16. Analytics

---

# 81. Convención de estados

Los estados internos serán constantes controladas en inglés, por ejemplo:

```text
draft
review
published
archived
```

La UI podrá traducirlos.

---

# 82. Auditoría

Las acciones administrativas críticas deben responder:

- quién;
- qué;
- cuándo;
- sobre qué.

---

# 83. Backups y recuperación

Git recupera código. Los backups recuperan datos. Son mecanismos diferentes.

---

# 84. Git Flow

Rama principal:

`main`

Ramas de trabajo:

- feature/auth;
- feature/questions;
- feature/exams;
- fix/exam-timer.

Los cambios deberán ser pequeños y verificables.

---

# 85. Documentación del repositorio

```text
/docs
├── PRD.md
├── ARCHITECTURE.md
├── DATABASE.md
├── WIREFRAMES.md
├── SECURITY.md
├── ROUTES.md
├── ROADMAP.md
└── TESTING.md
```

Además:

`/CLAUDE.md`

---

# 86. Criterios de aceptación de la arquitectura

La arquitectura se considera correcta cuando:

1. Sitio público y plataforma privada coexisten.
2. Auth está separada de datos académicos.
3. Estudiantes tienen identidad individual.
4. Roles están separados.
5. Preguntas forman módulo independiente.
6. Pruebas usan preguntas sin duplicar lógica.
7. Intentos están separados de pruebas.
8. Respuestas están separadas de resultados.
9. Calificación se ejecuta en servidor.
10. Respuestas correctas no se exponen durante prueba.
11. Resultados históricos se conservan.
12. Contenido editorial se actualiza sin redeploy.
13. Admin puede crear pruebas sin código.
14. Módulos pueden crecer independientemente.
15. Rutas públicas y privadas están separadas.
16. Existe estrategia móvil.
17. Existe estrategia para conexión inestable.
18. Existe RLS y autorización.
19. Código, datos y archivos están separados.
20. La arquitectura permite analítica e IA futura.

---

# 87. Decisión final

La Plataforma Educativa Preicfes Bertel se desarrollará inicialmente como:

**Aplicación web monolítica modular full-stack**

con:

**Next.js + TypeScript + Supabase + PostgreSQL + Vercel + GitHub**

organizada en:

**Sitio Público + Campus + Administración**

y módulos independientes para usuarios, estudiantes, grupos, preguntas, pruebas, intentos, respuestas, puntuación, resultados, estadísticas y contenido.

**Fin — Arquitectura Completa v1.0**
