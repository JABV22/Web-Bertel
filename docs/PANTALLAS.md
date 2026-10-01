# PANTALLAS — Inventario de interfaz

**Última actualización:** 2026-09-05 · **Fuente:** WIREFRAMES.md (DOC-04), leído íntegro

> IDs originales de DOC-04 (`P01`, `A01`, `C01`, `AD01`…). Rutas según ARCHITECTURE.md §29–31.
> DOC-04 §94 estima ~85 pantallas, estados y variantes. Aquí están las **pantallas nombradas**;
> los estados transversales se listan en §5.
>
> Columna **MVP**: ✅ dentro del MVP (PRD §60) · ⏳ fuera del MVP, previsto para después.

## 1. Sitio público — DOC-04 §3–12

| ID | Ruta | Objetivo | Secciones / acciones clave | MVP |
|---|---|---|---|---|
| P01 | `/` | Propuesta de valor y conversión | Hero, programas, ¿por qué Bertel?, resultados destacados, metodología, testimonios, CTA final | ✅ |
| P02 | `/nosotros` | Confianza institucional | Introducción, historia, misión, visión, valores, equipo, CTA | ✅ |
| P03 | `/programas` | Catálogo | Cards dinámicas: nombre, descripción, modalidad, duración, CTA | ✅ |
| P04 | `/programas/[slug]` | Detalle de programa | Hero, para quién es, qué incluye, metodología, modalidad/duración/horarios/inicio, resultados, FAQ, CTA | ✅ |
| P05 | `/metodologia` | Explicar el método | Diagnóstico → Formación → Práctica → Simulacros → Retroalimentación | ✅ |
| P06 | `/resultados` | Resultados institucionales | Métricas, filtro por año, gráfica histórica, resultados y casos destacados | ✅ |
| P07 | `/testimonios` | Prueba social | Grid con filtro por programa | ⏳ |
| P08 | `/faq` | Resolver dudas | Accordion con filtros por categoría/programa | ✅ |
| P09 | `/contacto` | Captar leads | Formulario (nombre, teléfono, programa, mensaje) + WhatsApp, teléfono, email, redes, horarios | ✅ |
| P10 | `/politica-privacidad` | Legal | Layout documental: título, fecha, índice, contenido | ✅ |
| P11 | `/terminos` | Legal | Igual que P10 | ✅ |

**Layout público (DOC-04 §2):** header/nav → contenido → footer. Móvil: logo + hamburguesa.

## 2. Autenticación — DOC-04 §13–16

| ID | Ruta | Objetivo | Estados | MVP |
|---|---|---|---|---|
| A01 | `/login` | Iniciar sesión | loading · credenciales incorrectas · usuario suspendido · error de conexión | ✅ |
| A02 | `/recuperar-contrasena` | Solicitar enlace | Campo correo + CTA enviar | ✅ |
| A03 | — | Confirmación de correo enviado | CTA volver | ✅ |
| A04 | — | Nueva contraseña | Nueva + confirmación + actualizar | ✅ |

Login pide **correo** y contraseña (DOC-04 §13) — resuelve la duda que el prototipo dejaba abierta.

## 3. Campus del estudiante — DOC-04 §17–31

Layout: sidebar (Inicio, Pruebas, Historial, Progreso, Perfil) + top bar. Móvil: bottom nav con
Inicio, Pruebas e Historial.

| ID | Ruta | Objetivo | Notas | MVP |
|---|---|---|---|---|
| C01 | `/campus` | Dashboard | Saludo, próxima prueba, pruebas realizadas, promedio, evolución, desempeño por materia, últimos resultados | ✅ |
| C02 | `/campus/pruebas` | Listado | Tabs: Disponibles · En progreso · Finalizadas. Card con preguntas, duración, cierre, intentos, CTA | ✅ |
| C03 | `/campus/pruebas/[examId]` | Instrucciones | Nombre, descripción, preguntas, duración, intentos, áreas, instrucciones, **checkbox de aceptación**, CTA iniciar/continuar | ✅ |
| C04 | `/campus/intentos/[attemptId]` | Simulacro desktop | Enunciado, opciones, navegador lateral, leyenda, estado de guardado, anterior/siguiente, marcar para revisar | ✅ |
| C05 | idem (móvil) | Simulacro móvil | Cabecera compacta con pregunta/tiempo, opciones a ancho completo, CTA «Ver preguntas» | ✅ |
| C06 | — | Navegador de preguntas móvil | Drawer: respondidas, pendientes, marcadas, grid numérico, CTA entregar | ✅ |
| C07 | — | Confirmación de entrega | Modal: respondidas, sin responder, marcadas, **advertencia de irreversibilidad**, seguir revisando / entregar | ✅ |
| C08 | — | Procesando resultado | Loading corto; si el scoring tarda, confirma recepción y permite volver | ✅ |
| C09 | `/campus/resultados/[resultId]` | Resultado general | Porcentaje, **puntaje estimado**, correctas, incorrectas, sin responder, desempeño por área, fortalezas, áreas por mejorar | ✅ |
| C10 | idem (detalle) | Resultado detallado | Tabs: General · Materias · Preguntas. Por tema y competencia | ✅ |
| C11 | — | Revisión de preguntas | **Solo si la configuración lo permite.** Enunciado, respuesta del estudiante, correcta y explicación | ✅ |
| C12 | `/campus/historial` | Historial | Lista con fecha, porcentaje, CTA ver resultado | ✅ |
| C13 | `/campus/progreso` | Progreso | Evolución general, por materia, temas por mejorar | ⏳ |
| C14 | `/campus/perfil` | Perfil | Nombre, correo, código, programa, grupo, edición permitida | ✅ |
| C15 | — | Activar código | Ingresar código para activar grupo/programa/prueba | ⏳ |

## 4. Administración — DOC-04 §33–76

Sidebar de 15 entradas (DOC-04 §33). Se listan agrupadas; los IDs son los de DOC-04.

| IDs | Área | MVP |
|---|---|---|
| AD01 | Dashboard admin: estudiantes, preguntas, intentos, promedio, actividad, pruebas activas | ✅ |
| AD02–AD03 | Usuarios: tabla con filtros por rol/estado; detalle | ✅ |
| AD04–AD06 | Estudiantes: tabla, crear, perfil administrativo con tabs | ✅ |
| AD07–AD08 | Docentes: listado y perfil con grupos, materias y permisos | ⏳ |
| AD09–AD10 | Programas: listado y editor (nombre, slug, descripción, estado, visibilidad, materias) | ✅ |
| AD11–AD13 | Grupos: listado, detalle, agregar estudiantes | ✅ |
| AD14–AD16 | Materias, temas/subtemas (árbol) y competencias | ✅ |
| AD17–AD21 | **Banco de preguntas**: listado, crear, previsualizar, revisar, historial de versiones | ✅ |
| AD22–AD31 | **Pruebas**: listado + constructor de 6 pasos (información, secciones, preguntas, configuración, asignación, revisión/publicación), errores de validación, detalle y versiones | ✅ |
| AD32–AD33 | Resultados: tabla con filtros y resultado individual | ✅ |
| AD34–AD36 | Estadísticas: generales, por grupo y analítica de pregunta | ✅ |
| AD37–AD41 | Contenido web: páginas, editor por bloques, testimonios, FAQ, resultados históricos | ✅ (básico) |
| AD42 | Contactos/leads: nuevo → contactado → calificado → matriculado | ✅ |
| AD43 | Archivos: biblioteca de medios | ⏳ |
| AD44–AD45 | Códigos de acceso | ⏳ |
| AD46 | Auditoría: usuario, acción, fecha, entidad | ✅ |
| AD47–AD48 | Configuración y documentos legales versionados | ⏳ |

**Editor de contenido (AD38):** bloques ordenables (Hero, programas, resultados, testimonios, CTA).
**No habrá HTML libre** — coincide con ARCH §23.

## 5. Estados transversales — DOC-04 §77–83

| Estado | Comportamiento exigido |
|---|---|
| 403 | Mensaje sin permiso + CTA volver |
| 404 | Página no encontrada + CTA inicio |
| 500 | Error general + reintentar |
| Sin conexión en simulacro | Banner «Sin conexión. Tus cambios pendientes se enviarán cuando vuelva Internet.» → al volver: «Conexión restaurada. Todas tus respuestas están guardadas.» |
| Sesión expirada | Fuera de examen: CTA iniciar sesión. **Durante examen: intentar recuperar sesión sin destruir el estado local** |
| Estado vacío | Pruebas y filtros sin resultados |
| Loading | Skeletons en dashboards y listados |

## 6. Reglas UX de obligado cumplimiento

- **Prioridad visual en el simulacro (§86):** enunciado → opciones → tiempo → número de pregunta →
  navegación → estado de guardado → marcado. **Sin decoración distractora.**
- **§87:** los estados (actual, respondida, pendiente, marcada, correcta, incorrecta) deben
  distinguirse **por más que color**.
- **§88 autoguardado:** «Guardando…» · «✓ Guardado» · «⚠ Sin conexión».
- **§89 tiempo:** a menos de 30 min aumentar relevancia; a menos de 5 min advertencia clara
  **sin animación excesiva**.
- **§90 finalización:** siempre `Entregar → Confirmación → Entrega definitiva`.
- **§91 admin:** acciones peligrosas piden confirmación; se prefiere **Archivar** sobre **Eliminar**;
  los formularios grandes permiten guardar borrador.
- **§92 responsive:** móvil 320–767 · tablet 768–1023 · desktop 1024+, diseño fluido.
- **§96 tres lenguajes de interfaz:** público = confianza; campus = concentración; admin = densidad.

## 7. Prioridad de diseño — DOC-04 §93

Las diez pantallas maestras que fijan la mayoría de patrones:

1. Inicio público · 2. Programa individual · 3. Login · 4. Dashboard estudiante · 5. Lista de pruebas
· 6. Simulacro · 7. Resultado · 8. Dashboard admin · 9. Banco de preguntas · 10. Constructor de prueba

## 8. Cotejo con el prototipo visual actual

| Pantalla de DOC-04 | Estado en `prototipo/` |
|---|---|
| P01 Inicio | Aproximada. **Falta** «¿Por qué Bertel?», metodología y testimonios; los programas están mal (CONF-03) |
| P02, P05, P07, P08, P10, P11 | **No existen** |
| P03/P04 Programas | Solo una sección en la home; falta página propia y detalle por slug |
| P06 Resultados | Aproximada; falta filtro por año y gráfica histórica |
| P09 Contacto | **No existe** el formulario |
| A01 Login | Aproximada; el prototipo dudaba del identificador — DOC-04 confirma **correo** |
| A02–A04 | **No existen** |
| C01 Dashboard | Aproximada; falta evolución y próxima prueba |
| C02 Pruebas | Parcial: faltan los tabs Disponibles/En progreso/Finalizadas |
| C03 Instrucciones | **No existe** (pantalla obligatoria antes de iniciar) |
| C04/C05 Simulacro | Aproximada y alineada con §86–§89 |
| C06, C07, C08 | **No existen** |
| C09/C10 Resultado | Aproximada; faltan tabs y puntaje estimado |
| C11 Revisión | Parcial |
| C12, C13, C14, C15 | **No existen** |
| AD01–AD48 | Solo una pantalla genérica de administración: cubre ~AD22 y AD37 de forma superficial |

**Conclusión:** el prototipo cubre **6 de ~85 pantallas**, y de forma aproximada. Su valor real es el
sistema visual (tokens, componentes, tratamiento del simulacro), no la cobertura funcional.
