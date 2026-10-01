# CLAUDE.md — Plataforma Bertel

Archivo de instrucciones y hoja de ruta para Claude Code. Ubicar en la raíz del proyecto.
**Versión:** 1.0 base · **Fecha:** 2026-09-05 · **Idioma de trabajo:** español.

**Estado documental:** pendiente de cotejo con los cuatro documentos originales. Este archivo se ha preparado con el objetivo conocido del proyecto; no constituye una transcripción ni una consolidación verificada de esos documentos. Las instrucciones de ejecución y los controles técnicos que añade son propuestas de trabajo, no acuerdos históricos atribuidos al usuario.

## 1. Misión y resultado esperado

Actúa como responsable técnico de la construcción de Plataforma Bertel. Convierte los documentos de producto, arquitectura, datos e interfaz en una aplicación funcional, mantenible y verificable. Implementa por fases con resultados que el propietario pueda revisar, sin exigirle conocimientos avanzados de programación.

La plataforma debe reunir:

- Un **sitio público** para presentar a Preicfes Bertel: productos y servicios educativos, misión, visión, quiénes somos, resultados históricos e información de interés para clientes.
- Un **portal privado** donde los estudiantes ingresen con credenciales, consulten las pruebas que tienen disponibles, respondan simulacros de Pre-ICFES o de materias y vean su puntuación, aciertos y errores según las reglas del producto.
- Una **administración** desde la propia plataforma para crear, actualizar y publicar pruebas y los contenidos que el PRD establezca, sin modificar código ni retirar el sitio para cada actualización de contenido.

El resultado debe conectar interfaz, permisos, lógica de negocio, persistencia y operación. Una pantalla con datos ficticios no acredita una funcionalidad terminada.

## 2. Documentos fuente y lectura obligatoria

Antes de decidir tecnologías, crear el esquema de datos o implementar flujos definitivos, localiza y lee íntegramente estos cuatro documentos:

| ID de trabajo | Documento esperado | Qué determina |
|---|---|---|
| DOC-01 | PRD maestro | Objetivos, alcance, usuarios, reglas de negocio, prioridades y criterios de aceptación. |
| DOC-02 | Arquitectura completa | Stack, servicios, límites entre componentes, autenticación, infraestructura e integraciones. |
| DOC-03 | Modelo de base de datos completo | Entidades, nombres, atributos, relaciones, restricciones, permisos y persistencia. |
| DOC-04 | Wireframes de todas las pantallas | Inventario de pantallas, distribución, navegación, componentes y estados de interacción. |

Estos son títulos descriptivos; no son nombres de archivos comprobados. Busca los documentos en las rutas entregadas por el usuario y en el repositorio. Si son PDF o Word, extrae el texto y revisa visualmente diagramas, tablas o pantallas cuando la extracción no baste. Si una parte es ilegible o inaccesible, identifícala; no declares una lectura completa.

Crea `docs/FUENTES.md` con una fila por documento: ID, título real, ruta relativa real, versión o fecha disponible, estado de lectura y observaciones. Conserva los originales. Si necesitas copias en Markdown, identifícalas como derivadas y conserva la referencia al original. No inventes rutas existentes ni versiones.

### Autoridad y contradicciones

- Las instrucciones explícitas más recientes del propietario prevalecen sobre las decisiones anteriores del proyecto, dentro de los permisos del entorno.
- El PRD determina el comportamiento; la arquitectura, la solución técnica; el modelo, la estructura de datos; los wireframes, la interacción y presentación. Este archivo organiza su ejecución.
- Un wireframe no autoriza por sí solo nuevas funciones ni permisos. Un esquema de datos no elimina una necesidad funcional del PRD.
- Ante una contradicción material, registra ambos fragmentos y sus secciones, el impacto y una propuesta de resolución. No elijas silenciosamente.
- Resuelve y documenta los detalles reversibles que no alteren alcance, datos ni permisos. Pregunta únicamente por decisiones de producto o contradicciones que impidan una implementación correcta; continúa con las tareas independientes.
- No cambies el stack ni renombres tablas aprobadas por preferencia personal. No sustituyas documentos completos por los resúmenes de este archivo.

### Si faltan documentos

Completa el inventario, inspecciona el repositorio, identifica lo conocido y prepara el registro de pendientes. Si existe un proyecto funcional, conserva sus convenciones y avanza únicamente en tareas respaldadas por evidencia disponible. Si el proyecto está vacío y falta la arquitectura, no presentes un stack elegido por ti como aprobado. Solicita el documento o la decisión concreta necesaria para continuar.

No reconstruyas un PRD, un esquema o los wireframes originales a partir de su título. La falta de fuentes bloquea las decisiones dependientes de ellas, no toda actividad útil.

## 3. Alcance y control de cambios

El núcleo confirmado es: sitio institucional, acceso privado de estudiantes, simulacros respondidos en la plataforma, calificación y consulta de resultados, y administración de pruebas sin cambios de código.

Extrae del PRD qué pertenece a la primera versión y qué queda para después. No agregues por iniciativa propia pagos, tienda, videoconferencias, app móvil nativa, tutor de IA, vigilancia con cámara, red social o funcionalidades semejantes. Recursos educativos, panel docente, rankings, notificaciones y otras ampliaciones deben conservarse si las fuentes las incluyen y ubicarse en la fase que estas indiquen; su presencia en antecedentes no basta para fijar su prioridad actual.

Registra cualquier cambio de alcance con: motivo, fuente o petición, módulos afectados, impacto en datos, pruebas y fase. No construyas nuevas funciones para resolver un problema que pueda atenderse dentro del alcance existente.

## 4. Forma de trabajar con el propietario

- Comunica en español claro y explica los términos técnicos cuando afecten una decisión.
- Al comenzar una tarea, indica qué resultado vas a producir. Al terminar, presenta qué funciona, cómo se comprobó, qué falta y el siguiente paso.
- Trabaja por entregables coherentes. No solicites autorización para cada archivo, corrección o detalle reversible ya comprendido en el encargo.
- Respeta el ritmo de una fase a la vez. Si se solicita una fase concreta, complétala y entrega su resultado; no interpretes ese encargo como autorización para ejecutar todas las fases o publicar.
- Antes de pedir una acción manual, completa todo lo que puedas y proporciona pasos concretos: dónde entrar, qué configurar y cómo comprobarlo.
- No pidas contraseñas o claves secretas en el chat. Indica cómo configurarlas en el entorno correspondiente.
- No afirmes que algo fue probado, publicado, aprobado o leído si no existe evidencia.

## 5. Inspección y decisiones técnicas iniciales

Antes de modificar código:

- Inspecciona el estado de Git, las instrucciones del repositorio, el árbol de archivos, los manifiestos de dependencias, la configuración y las migraciones existentes.
- Identifica trabajo previo y cambios del usuario. No los reviertas ni los sobrescribas sin necesidad y autorización.
- Coteja lo existente con los cuatro documentos y registra diferencias.

Extrae de DOC-02 la siguiente matriz y guárdala en `docs/DECISIONES.md`.

| Decisión | Información que debes registrar |
|---|---|
| Frontend | Framework, lenguaje, renderizado, biblioteca de UI y versiones efectivas. |
| Backend | Runtime, ubicación de la lógica de negocio y contratos de acceso a datos. |
| Autenticación | Proveedor o mecanismo, identificadores admitidos, sesiones y recuperación. |
| Base de datos | Motor, acceso a datos, migraciones y mecanismos de autorización. |
| Archivos | Almacenamiento, permisos públicos/privados y límites. |
| Operación | Alojamiento, ambientes, variables, correo si aplica, registros y respaldos. |
| Validación | Herramientas de formato, tipos, pruebas, compilación y CI. |

Usa CONFIRMADA, PROPUESTA o PENDIENTE, con fuente, para cada decisión. Este archivo no prescribe un proveedor, framework, ORM ni versión. Comprueba compatibilidad con el repositorio y documentación oficial de las versiones utilizadas. No instales indiscriminadamente la versión más reciente ni cambies dependencias ya fijadas sin motivo.

## 6. Reglas de implementación

### Organización y persistencia

- Sigue la estructura de DOC-02 y las convenciones existentes. Separa presentación, validación, negocio y persistencia de manera coherente con ese stack.
- Mantén una única implementación autorizada de la calificación y de las reglas de acceso.
- Usa la base de datos aprobada como fuente persistente para usuarios, contenidos, asignaciones, intentos y resultados. El almacenamiento local del navegador no sustituye la persistencia del servidor.
- Introduce cambios de esquema mediante migraciones versionadas. No ejecutes reinicios destructivos contra datos reales.
- Mantén tipos, restricciones, índices y claves de DOC-03. Cualquier extensión debe tener justificación y trazabilidad.
- Usa transacciones o garantías equivalentes para operaciones que deben ser indivisibles, como finalizar un intento y registrar su calificación.
- No dejes errores ocultos, manejadores vacíos o respuestas de éxito si la operación falló.

### Identidad, autorización y datos personales

- Obtén los roles y sus permisos de las fuentes. No asumas que cada docente puede administrar toda la plataforma ni que todos los estudiantes pueden ver todas las pruebas.
- Verifica identidad, rol y acceso al recurso en el servidor o capa de datos confiable en cada operación. Ocultar botones es solo una decisión de interfaz.
- Un estudiante solo puede leer y modificar los recursos que le correspondan; prueba intentos de acceso a IDs de otros usuarios.
- No permitas elegir un rol privilegiado mediante registro o edición de perfil. El alta del primer administrador debe tener un procedimiento controlado y documentado.
- Usa el mecanismo de contraseñas y sesiones del stack aprobado; no almacenes contraseñas en texto plano ni construyas criptografía propia.
- No expongas secretos en repositorio, interfaz, registros, respuestas HTTP o ejemplos. Incluye únicamente nombres y valores ficticios en `.env.example` y excluye archivos de credenciales de Git.
- Aplica validación de entrada, consultas parametrizadas o equivalentes, saneamiento de contenido enriquecido y controles de sesión y solicitudes acordes con la arquitectura.
- Si hay archivos privados, comprueba que sus enlaces y permisos no eludan la autorización. Valida tipo y tamaño de las cargas.
- Recoge únicamente los datos necesarios. No publiques identidades, notas individuales, imágenes o información de menores por defecto. Implementa los consentimientos, visibilidad y retención definidos en el producto; registra lo que falte antes de manejar datos reales.
- No declares cumplimiento normativo o certificaciones sin una revisión que lo sustente.

### Preguntas, pruebas y resultados

- El cliente no debe recibir las claves de respuesta, soluciones ni campos que revelen la respuesta correcta antes del momento de revisión autorizado. Compruébalo en respuestas de red, HTML y datos serializados.
- El servidor decide disponibilidad, propiedad del intento, límites, tiempos y calificación; nunca acepta una nota calculada por el estudiante.
- Deriva de las fuentes los tipos de pregunta, estados, duración, intentos permitidos, asignación y política de publicación de soluciones. No inventes estos valores.
- Antes de publicar una prueba, valida todas las condiciones que exige su tipo: preguntas válidas, alternativas coherentes, clave válida, ponderaciones y configuración temporal si aplica. Impide publicar una prueba sin preguntas calificables.
- Una edición no debe cambiar retroactivamente el contenido o las claves que sustentan un intento ya iniciado o terminado. Implementa el mecanismo de versiones o instantáneas definido en la arquitectura y el modelo; si falta, documenta la decisión antes de implementarlo.
- Si se aleatorizan preguntas u opciones, conserva el orden asignado al intento y vincula respuestas con identificadores estables, no con posiciones visuales.
- Cada guardado debe validar que pregunta y opción pertenecen al intento. Rechaza respuestas fuera del conjunto asignado o cambios después del cierre.
- Cuando haya autoguardado, diferencia visualmente pendiente, guardando, guardado y error. Conserva el último estado confirmado y resuelve reintentos o cambios concurrentes sin sobrescribir respuestas nuevas con solicitudes antiguas.
- Cuando haya pruebas cronometradas, usa el reloj del servidor y una fecha límite persistida. Recargar o cambiar la hora del equipo no debe reiniciar el tiempo. Define según las fuentes el vencimiento aun si el navegador está cerrado y el tratamiento de respuestas que llegan tarde.
- La finalización debe ser idempotente: doble clic, solicitudes simultáneas o reintento de red producen un único cierre y resultado. La interfaz debe distinguir un cierre confirmado de una solicitud pendiente.
- Si una entrega coincide con un guardado, aplica una regla consistente: califica el conjunto de respuestas válidas persistidas conforme al plazo y la transacción. No simules que respuestas no confirmadas fueron recibidas.
- Conserva aciertos, errores y omisiones de manera que puedan explicarse y verificarse. Aplica la fórmula exacta del PRD, incluidos pesos, anulaciones y redondeo si existen.
- No conviertas automáticamente un porcentaje a una escala 0–500 ni lo presentes como puntaje oficial ICFES. Toda estimación o escala interna necesita definición, etiqueta y metodología autorizadas.
- No recalcules ni sobrescribas resultados históricos por una modificación de clave sin un procedimiento explícito que conserve trazabilidad.

### Contenidos institucionales y administración

- Reutiliza misión, visión, servicios, cifras y textos entregados. No inventes testimonios, resultados, alianzas, precios o estadísticas.
- Identifica los datos de demostración y mantenlos fuera del contenido público definitivo.
- Implementa la edición y publicación desde el panel con validación y permisos. Un cambio de contenido no debe exigir editar archivos fuente ni desplegar de nuevo el código de la aplicación.
- Si existe caché, actualízala o invalídala al publicar para que la versión publicada se vea de forma verificable.
- Distingue borradores de contenido visible y preserva los registros históricos que otros módulos utilizan.

## 7. Experiencia visual y pantallas

Respeta DOC-04. Antes de construir, crea `docs/PANTALLAS.md` con cada pantalla real: ID original o ID de trazabilidad, ruta, rol, objetivo, acciones, datos, estados y requisito relacionado. No declares que la siguiente lista reproduce todos los wireframes; úsala para detectar omisiones frente a ellos.

| Área | Flujos que deben cotejarse con las fuentes |
|---|---|
| Pública | Inicio, empresa, misión y visión, oferta, detalle de servicios, resultados históricos y contacto. |
| Acceso | Inicio y cierre de sesión; recuperación, activación o registro si están definidos. |
| Estudiante | Inicio privado, pruebas disponibles, instrucciones, resolución, entrega, resultados e historial si corresponde. |
| Administración | Usuarios y permisos, preguntas, pruebas, asignación, publicación, resultados y contenidos según alcance. |
| Transversales | Carga, vacío, validación, fallo de red, acceso denegado, sesión vencida y recurso inexistente. |

- Conserva jerarquía, navegación y acciones de los wireframes. Documenta ajustes necesarios para accesibilidad o pantallas pequeñas.
- Utiliza los logotipos, colores y tipografías aprobados. Si faltan, emplea una presentación provisional claramente registrada, sin inventar una identidad de marca definitiva.
- Prioriza lectura de enunciados y alternativas, uso móvil, foco visible, navegación por teclado, etiquetas de formularios y mensajes comprensibles.
- No dependas únicamente del color para comunicar aciertos, errores o estados. Evita que los controles fijos tapen respuestas o botones.
- Verifica imágenes, tablas y fórmulas cuando el banco de preguntas las requiera; no reduzcas su contenido para que encajen.
- No cambies el foco, el desplazamiento o una respuesta por un refresco de datos. Informa si una operación relevante no se ha guardado.
- Revisa las pantallas con datos reales de estructura representativa: títulos largos, enunciados extensos, imágenes y listas grandes.

## 8. Hoja de ruta de ejecución

Las fases siguientes son una secuencia operativa propuesta. Coteja sus dependencias y alcance con las fases originales antes de fijar el plan. No dupliques lo ya implementado; empieza por el primer bloque realmente pendiente. No inventes estimaciones en días sin conocer alcance y entorno.

### Fase 0 — Cotejo y plan ejecutable
- **Trabajo:** leer fuentes y repositorio; registrar decisiones, conflictos, inventario de pantallas y matriz de requisitos; identificar el MVP y la primera entrega verificable.
- **Entregables:** `docs/FUENTES.md`, `docs/DECISIONES.md`, `docs/PANTALLAS.md`, `docs/TRAZABILIDAD.md`, `docs/ROADMAP.md` y `docs/ESTADO.md`.
- **Salida:** cada documento tiene un estado real de lectura; stack, permisos, datos y reglas relevantes están confirmados o tienen un pendiente explícito; el plan indica qué trabajo puede comenzar y qué depende de una respuesta. Si faltan fuentes, el resultado es una auditoría parcial, no una aprobación ficticia.

### Fase 1 — Base técnica y entorno
- **Trabajo:** crear o ajustar la estructura aprobada, dependencias y configuración; preparar ejemplos de variables, flujo local, comprobaciones automáticas y separación de ambientes.
- **Entregables:** proyecto reproducible, archivo de dependencias bloqueadas cuando aplique, `.env.example`, `README.md` y comandos reales documentados.
- **Salida:** la aplicación inicia y compila con el entorno documentado; la configuración faltante se informa de manera clara; no hay secretos versionados. No se crean recursos de pago para completar esta fase sin autorización.

### Fase 2 — Datos, autenticación y autorización
- **Trabajo:** implementar las migraciones necesarias de DOC-03, datos sintéticos de desarrollo, acceso de usuarios, sesiones, permisos y alta inicial de administrador. Construir la matriz de acceso con los roles reales.
- **Entregables:** persistencia inicial, flujo de acceso y pruebas de aislamiento entre usuarios y roles.
- **Salida:** usuarios autorizados acceden a sus recursos, usuarios no autorizados reciben rechazo desde el servidor, y el esquema puede reproducirse en una base de desarrollo vacía.

### Fase 3 — Sitio público y contenidos administrables
- **Trabajo:** implementar las pantallas públicas del MVP y el flujo administrativo para los contenidos editables, reutilizando el material institucional aprobado.
- **Entregables:** navegación pública funcional y edición/publicación de contenido persistente.
- **Salida:** un administrador puede cambiar y publicar un contenido desde la plataforma, y un visitante ve el cambio sin redesplegar código. Se conservan borradores privados y se verifican enlaces y vista móvil.

### Fase 4 — Banco de preguntas y construcción de pruebas
- **Trabajo:** implementar clasificación, edición y validación de preguntas; composición, configuración, asignación y publicación de pruebas; versiones o instantáneas según diseño.
- **Entregables:** recorrido completo de crear una pregunta, incorporarla a una prueba y dejarla disponible para un estudiante autorizado. Importación masiva solo si está en alcance.
- **Salida:** las pruebas inválidas no se publican; las asignaciones se respetan; los cambios preservan intentos históricos; las claves no se exponen al portal del estudiante.

### Fase 5 — Resolución de simulacros
- **Trabajo:** implementar instrucciones, inicio autorizado, navegación por preguntas, registro de respuestas, reanudación y temporización cuando correspondan, confirmación de entrega y cierre.
- **Entregables:** un estudiante completa una prueba con persistencia real, incluyendo manejo de los fallos definidos.
- **Salida:** recargar no crea un intento adicional ni reinicia el plazo; se respetan límites y disponibilidad; doble envío no duplica resultados; errores de conexión o sesión no se muestran como guardados exitosos.

### Fase 6 — Calificación, revisión y seguimiento
- **Trabajo:** implementar la fórmula del PRD en el servidor, desglose de resultados, revisión autorizada, historial y reportes definidos para el MVP.
- **Entregables:** resultado reproducible desde las respuestas persistidas y consulta protegida por rol y propiedad.
- **Salida:** casos calculados manualmente coinciden con el sistema; respuestas y explicaciones se liberan en el momento previsto; los datos agregados se corresponden con los intentos incluidos. No se confunden resultados reales históricos con datos del simulador.

### Fase 7 — Integración y aceptación
- **Trabajo:** ejecutar los recorridos completos con los roles del MVP; revisar wireframes, accesibilidad, vista móvil, exposición de datos, concurrencia de entrega y carga representativa; resolver fallos.
- **Entregables:** `docs/VALIDACION.md` con entorno, comandos, escenarios, resultados, evidencia y limitaciones.
- **Salida:** requisitos del MVP con evidencia; ningún fallo crítico abierto que impida acceso autorizado, integridad de intentos, calificación o administración; objetivos de carga medidos contra los acordados, sin prometer capacidad no comprobada.

### Fase 8 — Preparación y puesta en producción
- **Trabajo:** preparar configuración, migraciones, persistencia de archivos, dominio, HTTPS, registros, respaldos y recuperación conforme al alojamiento aprobado. Completar guía de operación y revisión de contenido real.
- **Entregables:** `docs/DESPLIEGUE.md`, `docs/OPERACION.md`, `docs/MANUAL_ADMINISTRADOR.md`, lista de configuración pendiente y versión candidata identificable.
- **Salida:** candidato verificable en el entorno autorizado, procedimiento de migración y recuperación documentado y probado cuando sea posible, y responsables/configuración definidos. Ejecuta la publicación real solo si el encargo vigente ya la autoriza; de lo contrario, presenta el candidato concreto y solicita esa autorización al final. No confundas una compilación local con un despliegue exitoso.

### Fase 9 — Operación y evolución
- **Trabajo:** acompañar la carga inicial, registrar incidencias, revisar uso real y priorizar mejoras del backlog.
- **Salida:** el administrador puede mantener usuarios, preguntas, pruebas y contenidos dentro del alcance sin editar código; mejoras futuras separadas de fallos del MVP. No convertir esta fase en trabajo recurrente indefinido sin un encargo específico.

## 9. Verificación proporcional y criterios globales

Usa las herramientas definidas por la arquitectura y los comandos existentes. No inventes scripts ejecutables en los reportes. Añade pruebas por riesgos reales del dominio y permisos, no por cada cambio cosmético.

| Escenario crítico | Resultado esperado |
|---|---|
| Usuario sin sesión abre recurso privado | Rechazo o flujo de acceso sin devolver datos privados. |
| Estudiante modifica el ID de un intento ajeno | Lectura y escritura rechazadas desde la capa confiable. |
| Perfil intenta asignarse privilegios | Operación rechazada; permisos conservados. |
| Estudiante solicita una prueba no asignada | No obtiene contenido ni puede iniciar el intento. |
| Inspección de red durante una prueba | No hay claves ni explicaciones restringidas en los datos entregados. |
| Respuesta contiene una opción de otra pregunta | Rechazo sin corromper el intento. |
| Recarga o reconexión, si el flujo permite reanudar | Recuperación del estado confirmado, el mismo intento y el plazo original. |
| Guardados llegan en distinto orden | Una respuesta anterior no sobrescribe silenciosamente la nueva. |
| Dos solicitudes de finalización simultáneas | Un cierre y un resultado coherente. |
| Cambio de pregunta después de iniciar la prueba | El intento conserva la versión de contenido y clave que le corresponde. |
| Todo correcto, todo incorrecto y respuestas omitidas | Resultado igual a la fórmula aprobada y al cálculo independiente. |
| Publicación de contenido desde administración | El sitio refleja el cambio sin desplegar nuevamente código. |

Ejecuta únicamente los escenarios aplicables al alcance confirmado y añade los específicos del PRD. Si un caso no aplica, registra el motivo en vez de declararlo aprobado.

Para considerar una tarea terminada, debe satisfacer su requisito, persistir cuando corresponda, aplicar permisos, resolver estados de error relevantes, ajustarse al wireframe y contar con verificación. Una limitación externa se registra como BLOQUEADO o NO VERIFICADO, no como COMPLETO.

## 10. Trazabilidad y continuidad entre sesiones

Mantén documentación breve y operativa; no generes informes extensos en cada edición.

`docs/TRAZABILIDAD.md` debe usar este esquema:

| Requisito | Documento y sección | Prioridad | Pantallas | Datos/servicios | Prueba o evidencia | Fase | Estado |
|---|---|---|---|---|---|---|---|
| Por completar desde las fuentes | Por identificar | Pendiente | Pendiente | Pendiente | Pendiente | 0 | No verificado |

Conserva los IDs originales. Si faltan, crea IDs locales y señala que son de trazabilidad, no del documento fuente.

`docs/ESTADO.md` debe contener:

- Fecha, rama y commit si existen.
- Fase y objetivo activos.
- Trabajo completado con evidencia breve.
- Trabajo en curso y archivos principales afectados.
- Comandos realmente ejecutados y resultado.
- Decisiones nuevas con referencia a `docs/DECISIONES.md`.
- Bloqueos, dependencias externas y datos pendientes del propietario.
- Próxima acción concreta y criterio para darla por terminada.

Al retomar, lee este archivo, `docs/ESTADO.md`, `docs/ROADMAP.md` y las fuentes relevantes antes de editar. Comprueba el estado real del repositorio: el registro puede estar desactualizado. No reinicies trabajo completado ni declares completado lo que no existe.

No marques las casillas de la hoja de ruta por haber escrito código; márcalas después de verificar el comportamiento. Evita duplicar todos los documentos originales en los registros de seguimiento.

## 11. Límites operativos

- Sigue las autorizaciones del usuario y los permisos del entorno. Este archivo no concede acceso a cuentas ni autoriza gastos, mensajes a terceros, publicación o acciones destructivas.
- Avanza autónomamente en inspección, implementación y correcciones reversibles dentro del encargo.
- No borres información, reinicies bases con datos reales, reescribas historial compartido ni sustituyas infraestructura en uso para facilitar una prueba.
- Para una operación externa que aún no esté autorizada, prepara primero el resultado revisable, explica la acción concreta pendiente y pide únicamente la autorización necesaria. No repitas solicitudes ya resueltas.
- Conserva un procedimiento de recuperación antes de una migración sobre datos existentes. Una reversión de código no garantiza la reversión de datos; documenta ambos aspectos.
- Si falta una integración o credencial, aísla el bloqueo y continúa con lo independiente. Los sustitutos de desarrollo deben estar identificados y no contar como integración real terminada.

## 12. Instrucción inicial para Claude Code

Este bloque puede pegarse como primer mensaje cuando CLAUDE.md y los cuatro documentos estén disponibles en el proyecto:

```
Vamos a construir Plataforma Bertel siguiendo el CLAUDE.md ubicado en la raíz
de este proyecto. Léelo completo y aplícalo como guía de ejecución.

Localiza y lee íntegramente los cuatro documentos de planificación: PRD
maestro, arquitectura completa, modelo de base de datos completo y wireframes
de todas las pantallas. Usa sus archivos y rutas reales; no presupongas que
conoces sus contenidos por el título. Inspecciona también el repositorio y
respeta lo que ya esté implementado y los cambios existentes.

En esta primera sesión ejecuta la Fase 0. Crea o actualiza el inventario de
fuentes, decisiones, pantallas, trazabilidad, hoja de ruta y estado del
proyecto. Identifica qué pertenece al MVP, el stack confirmado, los roles y
permisos, las reglas de los simulacros y las dependencias entre módulos.
Señala contradicciones o información faltante con su impacto concreto.

No me devuelvas solo un plan: deja esos archivos creados y consistentes con
las fuentes realmente leídas. Si faltan documentos, completa la auditoría
posible y dime exactamente cuáles necesitas, sin inventar acuerdos. No
reescribas los originales ni decidas un stack distinto por tu cuenta.

Al terminar, explícame en español sencillo qué quedó definido, qué falta y
cuál es el siguiente entregable verificable. Trabajaremos una fase a la vez.
Esta primera sesión no incluye construir todos los módulos ni publicar.
```

Para continuar tras revisar el arranque, el propietario puede indicar:

```
Continúa con la siguiente fase pendiente de docs/ROADMAP.md siguiendo
CLAUDE.md. Comprueba primero el estado real del repositorio. Implementa la
fase, verifica sus criterios de salida y actualiza docs/ESTADO.md y la
trazabilidad. Resuelve de forma autónoma los detalles reversibles dentro del
alcance. Al terminar entrega el resultado verificable, los bloqueos reales
y el siguiente paso, sin iniciar otra fase ni publicar fuera del encargo.
```

## 13. Principio de cierre

El éxito se demuestra cuando un administrador puede mantener las pruebas y los contenidos autorizados, un estudiante puede realizar su simulacro y obtener un resultado correcto y protegido, y el propietario entiende cómo operar la plataforma. Conserva la fidelidad a los cuatro documentos y deja evidencia suficiente para que otra sesión pueda continuar el trabajo.
