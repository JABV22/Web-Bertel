# WIREFRAMES MAESTROS
## Plataforma Educativa Preicfes Bertel

**Versión:** 1.0  
**Tipo:** UX/UI — Wireframes de baja fidelidad  
**Objetivo:** definir estructura, jerarquía, navegación y comportamiento de todas las pantallas antes del diseño visual.

---

# 1. Experiencias principales

```text
PREICFES BERTEL
│
├── SITIO PÚBLICO
│   └── Visitantes / padres / estudiantes / clientes
│
├── CAMPUS
│   └── Estudiantes
│
└── ADMINISTRACIÓN
    └── Docentes / coordinadores / administradores
```

---

# 2. Layout global

## Sitio público — desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ HEADER / NAV                                                 │
├──────────────────────────────────────────────────────────────┤
│                                                              │
│                     CONTENIDO PRINCIPAL                      │
│                                                              │
├──────────────────────────────────────────────────────────────┤
│ FOOTER                                                       │
└──────────────────────────────────────────────────────────────┘
```

## Campus/Admin — desktop

```text
┌──────────────┬───────────────────────────────────────────────┐
│              │ TOP BAR                                       │
│  SIDEBAR     ├───────────────────────────────────────────────┤
│              │                                               │
│              │              CONTENIDO                        │
│              │                                               │
└──────────────┴───────────────────────────────────────────────┘
```

## Mobile

```text
┌──────────────────────┐
│ LOGO      ☰          │
├──────────────────────┤
│      CONTENIDO       │
└──────────────────────┘
```

---

# PARTE I — SITIO PÚBLICO

# 3. P01 — Inicio

Ruta: `/`

Objetivo: presentar propuesta de valor y convertir visitantes.

```text
┌────────────────────────────────────────────────────────────┐
│ LOGO      Inicio Nosotros Programas Resultados Contacto    │
│                                      [Iniciar sesión]      │
├────────────────────────────────────────────────────────────┤
│ PREPÁRATE PARA ALCANZAR              [IMAGEN HERO]         │
│ TU MEJOR RESULTADO                                         │
│ Texto corto                                                │
│ [Conoce nuestros cursos] [Hablar con nosotros]            │
├────────────────────────────────────────────────────────────┤
│ NUESTROS PROGRAMAS                                         │
│ [PreICFES] [Preuniversitario] [Magisterio]                 │
├────────────────────────────────────────────────────────────┤
│ ¿POR QUÉ BERTEL?                                           │
│ Experiencia | Metodología | Acompañamiento                 │
├────────────────────────────────────────────────────────────┤
│ RESULTADOS DESTACADOS                                      │
│ [dato] [dato] [dato]                                       │
├────────────────────────────────────────────────────────────┤
│ NUESTRA METODOLOGÍA                                        │
│ Diagnóstico → Formación → Simulacros → Seguimiento        │
├────────────────────────────────────────────────────────────┤
│ TESTIMONIOS                                                │
├────────────────────────────────────────────────────────────┤
│ CTA FINAL                                                  │
└────────────────────────────────────────────────────────────┘
```

Mobile mantiene el mismo orden en columna.

---

# 4. P02 — Nosotros

Ruta: `/nosotros`

Incluye:

- introducción;
- historia;
- misión;
- visión;
- valores;
- equipo;
- CTA.

---

# 5. P03 — Programas

Ruta: `/programas`

Cards dinámicas por programa con nombre, descripción, modalidad, duración y CTA.

---

# 6. P04 — Programa individual

Ruta: `/programas/[slug]`

Secciones:

- hero;
- para quién es;
- qué incluye;
- metodología;
- modalidad/duración/horarios/inicio;
- resultados;
- FAQ;
- CTA.

---

# 7. P05 — Metodología

Ruta: `/metodologia`

```text
Diagnóstico
    ↓
Formación
    ↓
Práctica
    ↓
Simulacros
    ↓
Retroalimentación
```

Cada fase tendrá bloque visual y explicación.

---

# 8. P06 — Resultados institucionales

Ruta: `/resultados`

Incluye:

- métricas;
- filtro por año;
- gráfica histórica;
- resultados destacados;
- casos destacados.

---

# 9. P07 — Testimonios

Ruta: `/testimonios`

Grid de testimonios con filtro por programa.

---

# 10. P08 — FAQ

Ruta: `/faq`

Accordion con filtros por categoría/programa.

---

# 11. P09 — Contacto

Ruta: `/contacto`

Formulario con:

- nombre;
- teléfono;
- programa;
- mensaje.

A un lado: WhatsApp, teléfono, email, redes y horarios.

---

# 12. P10/P11 — Privacidad y términos

Layout documental con título, fecha, índice y contenido.

---

# PARTE II — AUTENTICACIÓN

# 13. A01 — Login

Ruta: `/login`

```text
LOGO
Iniciar sesión

Correo
[________________]

Contraseña
[________________] 👁

[INICIAR SESIÓN]

¿Olvidaste tu contraseña?

Volver al sitio web
```

Estados:

- loading;
- credenciales incorrectas;
- usuario suspendido;
- error de conexión.

---

# 14. A02 — Recuperar contraseña

Campo correo + CTA enviar enlace.

---

# 15. A03 — Correo enviado

Confirmación y CTA para volver.

---

# 16. A04 — Nueva contraseña

Nueva contraseña + confirmación + actualizar.

---

# PARTE III — CAMPUS

# 17. Layout campus

Desktop:

```text
┌──────────────┬─────────────────────────────────────────────┐
│ BERTEL       │ Buscar...               Usuario ▼          │
│ CAMPUS       ├─────────────────────────────────────────────┤
│ Inicio       │                                             │
│ Pruebas      │               CONTENIDO                    │
│ Historial    │                                             │
│ Progreso     │                                             │
│ Perfil       │                                             │
└──────────────┴─────────────────────────────────────────────┘
```

Mobile: bottom nav con Inicio, Pruebas e Historial.

---

# 18. C01 — Dashboard estudiante

Ruta: `/campus`

Incluye:

- saludo;
- próxima prueba;
- pruebas realizadas;
- promedio;
- evolución;
- desempeño por materia;
- últimos resultados.

---

# 19. C02 — Pruebas

Ruta: `/campus/pruebas`

Tabs:

- Disponibles;
- En progreso;
- Finalizadas.

Cada card muestra preguntas, duración, cierre, intentos y CTA.

---

# 20. C03 — Instrucciones

Ruta: `/campus/pruebas/[examId]`

Muestra:

- nombre;
- descripción;
- preguntas;
- duración;
- intentos;
- áreas;
- instrucciones;
- checkbox de aceptación;
- CTA iniciar.

Si hay intento en progreso, aparece CTA Continuar.

---

# 21. C04 — Simulacro activo desktop

```text
┌──────────────────────────────────────────────────────────────┐
│ Simulacro General #4                   Tiempo 02:41:16      │
│ Matemáticas                Pregunta 37 / 145                │
├────────────────────────────────────────────┬─────────────────┤
│ Pregunta 37                                │ PREGUNTAS       │
│                                            │ 1 ✓ 2 ✓ 3 ○    │
│ [Enunciado]                                │ 4 ✓ 5 ⚑ 6 ✓    │
│ [Imagen / gráfica]                         │ ...             │
│ ○ A. Respuesta                             │                 │
│ ○ B. Respuesta                             │ Leyenda         │
│ ● C. Respuesta                             │ ✓ respondida    │
│ ○ D. Respuesta                             │ ○ pendiente     │
│ ⚑ Marcar para revisar                     │ ⚑ revisar       │
├────────────────────────────────────────────┴─────────────────┤
│ Estado: ✓ Guardado          [Anterior] [Siguiente]          │
└──────────────────────────────────────────────────────────────┘
```

---

# 22. C05 — Simulacro mobile

```text
┌──────────────────────────────┐
│ Pregunta 37/145    02:41:16 │
├──────────────────────────────┤
│ Matemáticas                  │
│ Enunciado...                 │
│ [imagen]                     │
│ [○ A. Respuesta]             │
│ [○ B. Respuesta]             │
│ [● C. Respuesta]             │
│ ⚑ Marcar para revisar       │
│ ✓ Guardado                   │
├──────────────────────────────┤
│ [Anterior]       [Siguiente] │
├──────────────────────────────┤
│ [Ver preguntas]              │
└──────────────────────────────┘
```

---

# 23. C06 — Navegador de preguntas mobile

Drawer con:

- respondidas;
- pendientes;
- marcadas;
- grid de números;
- CTA entregar.

---

# 24. C07 — Confirmación de entrega

Modal:

- respondidas;
- sin responder;
- marcadas;
- advertencia de irreversibilidad;
- seguir revisando;
- entregar.

---

# 25. C08 — Procesando resultado

Loading corto. Si el scoring tarda, se confirma recepción y se permite volver al campus.

---

# 26. C09 — Resultado general

Ruta: `/campus/resultados/[resultId]`

Incluye:

- porcentaje;
- puntaje estimado;
- correctas;
- incorrectas;
- sin responder;
- desempeño por área;
- fortalezas;
- áreas por mejorar;
- CTA ver detalle.

---

# 27. C10 — Resultado detallado

Tabs:

- General;
- Materias;
- Preguntas.

Incluye resultados por tema y competencia.

---

# 28. C11 — Revisión de preguntas

Solo cuando configuración lo permita.

Muestra:

- enunciado;
- respuesta del estudiante;
- respuesta correcta;
- explicación.

---

# 29. C12 — Historial

Ruta: `/campus/historial`

Lista de simulacros con fecha, porcentaje y CTA ver resultado.

---

# 30. C13 — Progreso

Ruta: `/campus/progreso`

Incluye:

- evolución general;
- evolución por materia;
- temas por mejorar.

---

# 31. C14 — Perfil

Ruta: `/campus/perfil`

Muestra nombre, correo, código, programa, grupo y opciones permitidas de edición.

---

# 32. C15 — Activar código

Formulario para ingresar código y activar grupo, programa o prueba.

---

# PARTE IV — ADMIN

# 33. Layout admin

```text
┌────────────────┬─────────────────────────────────────────────┐
│ BERTEL ADMIN   │ Buscar...            Admin ▼              │
│ Dashboard      ├─────────────────────────────────────────────┤
│ Estudiantes    │                                             │
│ Docentes       │               CONTENIDO                    │
│ Programas      │                                             │
│ Grupos         │                                             │
│ Materias       │                                             │
│ Preguntas      │                                             │
│ Pruebas        │                                             │
│ Resultados     │                                             │
│ Estadísticas   │                                             │
│ Contenido      │                                             │
│ Contactos      │                                             │
│ Archivos       │                                             │
│ Códigos        │                                             │
│ Auditoría      │                                             │
│ Configuración  │                                             │
└────────────────┴─────────────────────────────────────────────┘
```

---

# 34. AD01 — Dashboard admin

Incluye:

- estudiantes;
- preguntas;
- intentos;
- promedio;
- actividad de simulacros;
- desempeño por materia;
- pruebas activas;
- actividad reciente.

---

# 35. AD02 — Usuarios

Tabla con búsqueda, filtros por rol/estado y acciones.

---

# 36. AD03 — Detalle de usuario

Datos personales, roles, estado, actividad y edición.

---

# 37. AD04 — Estudiantes

Tabla con:

- nombre;
- código;
- programa;
- grupo;
- estado;
- resultado;
- acciones.

---

# 38. AD05 — Crear estudiante

Formulario:

- nombre;
- apellido;
- correo;
- teléfono;
- código;
- programa;
- grupo;
- opción enviar invitación.

---

# 39. AD06 — Perfil administrativo del estudiante

Tabs:

- Información;
- Pruebas;
- Resultados;
- Progreso.

---

# 40. AD07/AD08 — Docentes

Listado y perfil con grupos, materias/permisos y actividad.

---

# 41. AD09/AD10 — Programas

Listado y editor de programa con nombre, slug, descripción, estado, visibilidad y materias asociadas.

---

# 42. AD11/AD12/AD13 — Grupos

Listado, detalle y modal para agregar estudiantes.

---

# 43. AD14 — Materias

Listado con código, nombre, estado y programas asociados.

---

# 44. AD15 — Temas y subtemas

Árbol jerárquico.

---

# 45. AD16 — Competencias

Listado y editor por materia.

---

# 46. AD17 — Banco de preguntas

Ruta: `/admin/preguntas`

Pantalla principal con:

- búsqueda;
- filtros;
- paginación;
- código;
- texto;
- materia;
- dificultad;
- estado;
- versión;
- acciones.

---

# 47. AD18 — Crear pregunta

Ruta: `/admin/preguntas/nueva`

Formulario:

- materia;
- tema;
- competencia;
- dificultad;
- enunciado;
- multimedia;
- opciones;
- respuesta correcta;
- explicación;
- guardar borrador;
- enviar a revisión.

---

# 48. AD19 — Previsualización de pregunta

Vista estudiante + metadatos internos.

---

# 49. AD20 — Revisión de pregunta

Vista renderizada + clave + explicación + comentarios + aprobar / solicitar cambios / rechazar.

---

# 50. AD21 — Historial de versiones

Lista:

- v3 borrador;
- v2 publicada;
- v1 publicada.

CTA crear nueva versión.

---

# 51. AD22 — Listado de pruebas

Tabla con nombre, preguntas, duración, estado y acciones.

---

# 52. AD23 — Constructor paso 1: Información

Campos:

- nombre;
- código;
- programa;
- descripción;
- instrucciones.

Wizard de 6 pasos.

---

# 53. AD24 — Paso 2: Secciones

Crear, editar y ordenar secciones con materia y peso.

---

# 54. AD25 — Paso 3: Preguntas

Split view:

- banco de preguntas a la izquierda;
- preguntas del simulacro a la derecha.

Incluye filtros, selección y drag & drop.

---

# 55. AD26 — Paso 4: Configuración

Campos:

- duración;
- intentos;
- randomización;
- liberación de resultados;
- liberación de respuestas;
- modelo de calificación.

---

# 56. AD27 — Paso 5: Asignación

Asignar a:

- grupo;
- programa;
- estudiante.

Configurar apertura y cierre.

---

# 57. AD28 — Paso 6: Revisión y publicación

Resumen completo + checklist de validación + guardar borrador/publicar.

---

# 58. AD29 — Error de validación

Lista clara de problemas que impiden publicar.

---

# 59. AD30 — Detalle de prueba

Tabs:

- Información;
- Preguntas;
- Asignaciones;
- Resultados;
- Versiones.

Muestra progreso de completitud.

---

# 60. AD31 — Versiones de prueba

Lista de versiones y CTA nueva versión.

---

# 61. AD32 — Resultados

Tabla con filtros por prueba, grupo, materia y fecha.

---

# 62. AD33 — Resultado individual

Resumen, métricas, gráfica por materia y tabs de detalle.

---

# 63. AD34 — Estadísticas generales

Incluye:

- promedio;
- evolución;
- desempeño por materia;
- distribución;
- preguntas más falladas.

---

# 64. AD35 — Estadísticas por grupo

Incluye:

- cantidad de estudiantes;
- promedio;
- evolución;
- desempeño por materia;
- mejores desempeños;
- mayores dificultades.

---

# 65. AD36 — Analítica de pregunta

Incluye:

- veces respondida;
- % correcta;
- % incorrecta;
- distribución de opciones;
- desempeño por grupo;
- versiones.

---

# 66. AD37 — Contenido web

Listado de páginas y tipos de contenido dinámico.

---

# 67. AD38 — Editor de página

Bloques ordenables:

- Hero;
- programas;
- resultados;
- testimonios;
- CTA.

No habrá HTML libre.

---

# 68. AD39 — Testimonios admin

Listado y formulario de nombre, programa, año, foto, texto y estado.

---

# 69. AD40 — FAQ admin

Listado ordenable con editar/archivar.

---

# 70. AD41 — Resultados históricos admin

Gestión de métricas institucionales por año.

---

# 71. AD42 — Contactos/leads

Tabla por estado:

- Nuevo;
- Contactado;
- Calificado;
- Matriculado.

Detalle con notas.

---

# 72. AD43 — Archivos

Biblioteca de medios con búsqueda, filtros, preview y metadatos.

---

# 73. AD44/AD45 — Códigos

Listado y creación de códigos para programa/grupo/prueba.

---

# 74. AD46 — Auditoría

Tabla con usuario, acción, fecha y entidad.

---

# 75. AD47 — Configuración

Tabs:

- General;
- Seguridad;
- Evaluaciones;
- Usuarios.

No permite modificar secretos.

---

# 76. AD48 — Documentos legales

Versionado de privacidad, términos y otros documentos.

---

# PARTE V — ESTADOS TRANSVERSALES

# 77. 403

Mensaje sin permiso + CTA volver.

# 78. 404

Página no encontrada + CTA inicio.

# 79. 500

Error general + reintentar.

# 80. Sin conexión durante simulacro

Banner:

`⚠ Sin conexión. Tus cambios pendientes se enviarán cuando vuelva Internet.`

Al volver:

`✓ Conexión restaurada. Todas tus respuestas están guardadas.`

# 81. Sesión expirada

Fuera de examen: CTA iniciar sesión.  
Durante examen: intentar recuperar sesión sin destruir estado local.

# 82. Estado vacío

Ejemplos para pruebas y filtros sin resultados.

# 83. Loading

Usar skeletons en dashboards y listados.

---

# 84. Mapas de navegación

## Público

```text
INICIO
├── Nosotros
├── Programas
│   ├── PreICFES
│   ├── Preuniversitario
│   └── Magisterio
├── Metodología
├── Resultados
├── Testimonios
├── FAQ
├── Contacto
├── Privacidad
├── Términos
└── Login
```

## Campus

```text
CAMPUS
├── Inicio
├── Pruebas
│   ├── Disponibles
│   ├── En progreso
│   └── Finalizadas
├── Intento activo
├── Resultados
├── Historial
├── Progreso
├── Activar código
└── Perfil
```

## Admin

```text
ADMIN
├── Dashboard
├── Usuarios
├── Estudiantes
├── Docentes
├── Programas
├── Grupos
├── Materias
│   ├── Temas
│   └── Competencias
├── Preguntas
│   ├── Banco
│   ├── Crear
│   ├── Revisar
│   └── Versiones
├── Pruebas
│   ├── Constructor
│   ├── Versiones
│   └── Asignaciones
├── Resultados
├── Estadísticas
├── Contenido
├── Contactos
├── Archivos
├── Códigos
├── Auditoría
└── Configuración
```

---

# 85. Componentes maestros

## Públicos

- PublicHeader;
- MobileMenu;
- Footer;
- Hero;
- ProgramCard;
- MetricCard;
- TestimonialCard;
- FaqAccordion;
- CTASection;
- ContactForm;
- Breadcrumb.

## Campus

- CampusSidebar;
- CampusMobileNav;
- ExamCard;
- ResultCard;
- SubjectProgress;
- ExamTimer;
- QuestionCard;
- AnswerOption;
- QuestionNavigator;
- FlagButton;
- AutosaveIndicator;
- ResultSummary;
- PerformanceChart.

## Admin

- AdminSidebar;
- AdminHeader;
- PageHeader;
- DataTable;
- FilterBar;
- SearchInput;
- Pagination;
- StatusBadge;
- ActionMenu;
- FormSection;
- WizardStepper;
- QuestionEditor;
- ExamBuilder;
- MediaPicker;
- AssignmentSelector;
- AnalyticsCard;
- AuditTimeline.

---

# 86. Reglas UX del simulacro

Prioridad visual:

1. enunciado;
2. opciones;
3. tiempo;
4. número de pregunta;
5. navegación;
6. estado de guardado;
7. marcado.

No debe haber decoración distractora.

---

# 87. Estados funcionales

Deben distinguirse por más que color:

- actual;
- respondida;
- pendiente;
- marcada;
- correcta;
- incorrecta.

---

# 88. Autoguardado

Estados:

- Guardando...
- ✓ Guardado
- ⚠ Sin conexión

---

# 89. Tiempo

Cuando falten menos de 30 minutos, aumentar relevancia.  
Cuando falten menos de 5, mostrar advertencia clara sin animación excesiva.

---

# 90. Finalización

Siempre:

`Entregar → Confirmación → Entrega definitiva`

---

# 91. Reglas UX admin

Acciones peligrosas como archivar, desactivar o cerrar pruebas requieren confirmación.

Se preferirá **Archivar** sobre **Eliminar** cuando exista historial.

Formularios grandes deben permitir guardar borrador.

---

# 92. Responsive

Conceptualmente:

- Mobile: 320–767 px
- Tablet: 768–1023 px
- Desktop: 1024+ px

El diseño deberá ser fluido.

---

# 93. Pantallas maestras a diseñar primero

1. Inicio público
2. Programa individual
3. Login
4. Dashboard estudiante
5. Lista de pruebas
6. Simulacro
7. Resultado
8. Dashboard admin
9. Banco de preguntas
10. Constructor de prueba

Estas diez pantallas determinarán la mayoría de patrones visuales.

---

# 94. Inventario aproximado

El sistema contempla alrededor de 85 pantallas, estados y variantes, aunque muchas reutilizan layouts y componentes.

---

# 95. Criterios de aceptación

Los wireframes se consideran aprobados si permiten identificar:

- páginas;
- navegación;
- acciones;
- jerarquía;
- simulacro;
- resultados;
- administración de estudiantes;
- creación de preguntas;
- creación de pruebas;
- contenido editable;
- comportamiento móvil;
- errores;
- estados vacíos;
- pérdida de conexión.

---

# 96. Decisión UX final

Tres lenguajes de interfaz:

**Sitio público:** confianza + información + conversión.  
**Campus:** claridad + concentración + progreso.  
**Administración:** productividad + densidad de información + control.

El motor de simulacro tendrá una interfaz particularmente limpia y libre de distracciones.

**Fin — Wireframes Maestros v1.0**
