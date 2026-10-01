# ESTADO — Registro de sesión

## Sesión 2026-09-05 (c) — Fase 0 CERRADA con las fuentes reales

**Fecha:** 2026-09-05 · **Rama / commit:** todavía sin repositorio Git (se crea en Fase 1)
**Fase activa al terminar:** 2 — Datos, autenticación y autorización
**Fases completadas en esta sesión:** 0 (cotejo) y 1 (base técnica)

### Hecho

El propietario entregó los cuatro documentos. Estaban en la carpeta `Downloads` del usuario y se
**copiaron byte a byte** a `docs/` (PRD.md, ARCHITECTURE.md, DATABASE.md, WIREFRAMES.md), siguiendo
la ruta que fija ARCHITECTURE §85. No se transcribieron: el texto adjunto al chat llegó con mojibake,
mientras que los archivos en disco son UTF-8 correcto.

| Trabajo | Evidencia |
|---|---|
| 4/4 documentos leídos íntegros | PRD 980 líneas · ARCHITECTURE 1.319 · DATABASE 1.665 · WIREFRAMES 1.216 |
| Stack confirmado | ARCH §5 y §87: Next.js + TypeScript + Tailwind + Supabase/PostgreSQL + Vercel + GitHub |
| `DECISIONES.md` | Las 7 decisiones de CLAUDE.md §5 pasan de PENDIENTE a **CONFIRMADA**, con su sección de origen |
| `PANTALLAS.md` | Inventario con IDs originales (P01–P11, A01–A04, C01–C15, AD01–AD48) y estados transversales |
| `TRAZABILIDAD.md` | 20 criterios `CA-xx` (PRD §65) + 10 reglas `RB-xxx` (PRD §59), con fase y tablas |
| `ROADMAP.md` | Fase 0 cerrada; reconciliado con el orden de construcción de ARCH §80 |
| MVP identificado | PRD §60; fuera de alcance PRD §61; prioridades P0–P3 PRD §66 |

### Comandos ejecutados

| Comando | Resultado |
|---|---|
| `find` por los 4 nombres de archivo | Encontrados en `Downloads`, copiados a `docs/` |
| `file -b docs/*.md` | UTF-8 válido en los cuatro |
| `grep -ci "jaba"` en los 4 documentos | **0 en los cuatro** → resuelve CONF-01 |
| `grep -oh "Preicf[eé]s"` | 9 «Preicfes» sin tilde, 0 con tilde → abre CONF-02 |
| `sed -n` sobre PRD §9 y §21 | Programas y materias reales confirmados |

### Contradicciones

- **CONF-01 — identidad institucional: RESUELTA.** Ningún documento menciona JABA S.A.S. El producto
  es **Preicfes Bertel**, dominio `www.preicfesbertel.com`. El texto de JABA queda descartado.
- **CONF-02 — grafía: ABIERTA.** Los documentos escriben «Preicfes»; el logotipo y los dashboards
  reales escriben «Preicfés». Requiere confirmación del propietario.
- **CONF-03 — programas: RESUELTA, corrección pendiente.** El prototipo presenta «Instituciones y
  municipios», que **inventé yo**. Los programas reales (PRD §9) son PreICFES, Preuniversitario y
  Curso para el Magisterio.

### Correcciones a mi propio trabajo anterior

1. **Programas inventados** en el prototipo — deben sustituirse (CONF-03).
2. **Puntaje estimado**: sostuve que no debía mostrarse ninguna escala 0–500. PRD §32 **sí la
   permite** si se etiqueta como «puntaje estimado» y su fórmula es configurable y documentada. La
   regla real es etiquetar, no prohibir.
3. **Identificador de acceso**: el prototipo lo dejaba «por definir». DOC-04 §13 confirma **correo**.
4. **Cobertura**: el prototipo cubre 6 de ~85 pantallas. Su valor es el sistema visual, no el alcance.
5. **Rutas**: las del prototipo (`portal/*.html`) no coinciden con ARCH §29–31 (`/campus`, `/admin`).

### Estado del prototipo visual

No se descarta ni se despliega. Se convierte en **referencia visual** que se porta a Next.js +
Tailwind; el mapeo está en `DECISIONES.md` §4, junto con las cuatro correcciones obligatorias.

### Bloqueos

Ninguno impide la Fase 1. Pendientes del propietario: credenciales de Supabase (Fase 2), CONF-02,
razón social, contenido institucional real y autorización del material.

### Fase 1 — ejecutada y verificada

| Trabajo | Evidencia |
|---|---|
| Proyecto Next.js creado | Next.js **16.3.4**, React **19.2.8**, Tailwind **4**, TypeScript 5. 364 paquetes, **0 vulnerabilidades** |
| Estructura ARCH §51 | `src/{app,components,features,lib,services,types,hooks,validations,config}` + 12 módulos en `features/` |
| Migraciones | `supabase/migrations/` creado y vacío, con su README y el checklist de DB §88 |
| Tokens de marca | Portados a Tailwind 4 (`@theme` en `src/app/globals.css`) desde el prototipo |
| Tipografía | Inter vía `next/font` — sin peticiones a terceros en render |
| `.env.example` | Solo nombres y valores ficticios; advertencia explícita sobre `SUPABASE_SERVICE_ROLE_KEY` |
| `.gitignore` | `.env*` ignorado **con excepción** `!.env.example` |
| Git | `git init -b main` (ARCH §84). **Sin commit**: pendiente de autorización del propietario |
| Logotipo | Monograma PB recortado del activo real → `public/logo-bertel-marca.png` (el wordmark completo era ilegible a 56 px) |

**Comandos ejecutados y su resultado:**

| Comando | Resultado |
|---|---|
| `npx create-next-app@latest` | Falló con la carpeta `PLATAFORMA` (npm no admite mayúsculas). Se generó aparte con `--skip-install` y se trasladó |
| `npm install` | 364 paquetes, 0 vulnerabilidades, 2 min |
| `npm run build` | ✅ «Compiled successfully», TypeScript sin errores, 2 rutas estáticas |
| `npm run lint` | ✅ sin problemas (tras excluir `prototipo/`) |
| `npm run start` + `curl` | ✅ HTTP 200 |
| Captura headless 1280×900 | ✅ `docs/capturas/11-fase1-app-arranca.png` |

**Incidencias resueltas durante la Fase 1:**

1. `create-next-app` rechazó el nombre de carpeta en mayúsculas → andamiaje generado aparte y trasladado; `package.json` renombrado a `plataforma-bertel`.
2. El andamiaje trae su propio `CLAUDE.md` y `AGENTS.md` → **excluidos** para no sobrescribir la guía del proyecto.
3. `.gitignore` ignoraba `.env*`, lo que habría excluido `.env.example` → añadida la excepción.
4. ESLint analizaba `prototipo/` → excluido; además se eliminaron dos variables muertas reales en `escena.js`.
5. El logotipo cuadrado con wordmark era ilegible a tamaño pequeño → recorte del monograma.

### Próxima acción concreta

**Fase 2 — Datos, autenticación y autorización.** Escribir las migraciones SQL de DATABASE.md
(44 tablas en `public` y `private`), las políticas RLS, los datos sintéticos de desarrollo y el flujo
de acceso con Supabase Auth.

**Bloqueo real:** sin credenciales de Supabase se pueden **escribir** las migraciones, pero no
aplicarlas ni verificar RLS. CLAUDE.md §9 exige comportamiento verificado, no código escrito.

**Criterio de terminado:** un usuario autorizado accede a sus recursos, uno no autorizado recibe
rechazo **desde el servidor**, y el esquema se reproduce en una base de desarrollo vacía.

---


## Sesión 2026-09-05 (b) — Dirección de arte y prototipo visual

**Fecha:** 2026-09-05 · **Rama / commit:** no aplica (sigue sin repositorio Git)
**Objetivo:** implementar la estética premium: composición minimalista, tipografía protagonista,
profundidad 3D y narrativa vinculada al scroll.

### Punto de partida y cómo se resolvió

El encargo pedía leer los cuatro documentos y **reutilizar el stack y los componentes existentes**.
No existe ninguna de las dos cosas: el proyecto seguía sin código. Se aplicó la cláusula del propio
encargo («si faltan documentos, identifica la limitación y avanza con lo respaldado por el proyecto
disponible») construyendo la capa visual **sin dependencias**, de forma que no compromete el stack
que fije DOC-02. Ver `DISENO.md` §3 y las decisiones DEC-L06 a DEC-L10.

### Trabajo completado (con evidencia)

| Trabajo | Evidencia |
|---|---|
| Identidad de marca **verificada** | Azul `#1D3564`, oro `#E6B332`, Inter y el logotipo PB extraídos de los dashboards del propietario, que declaran «Paleta corporativa integrada». `DISENO.md` §1 |
| Logotipo real recuperado | PNG en base64 incrustado en el dashboard 9-B, extraído y con fondo retirado → `prototipo/assets/logo-bertel.png` |
| Sistema de tokens | `prototipo/css/tokens.css`: color, tipografía fluida, espaciado, radios, sombras, movimiento, profundidad |
| Sitio público | `prototipo/index.html`: cabecera, hero con paneles 3D, escena de scroll de 4 etapas, programas, resultados, identidad, cierre y pie |
| Escena de scrollytelling | `prototipo/js/escena.js`: scroll nativo, reversible, sin secuestro de rueda, mensajes en HTML semántico |
| Portal académico | 5 pantallas: ingreso, panel, simulacro, resultados y administración |
| Verificación | `node --check` OK; referencias locales OK; sin desbordes de 489 a 1407 px; movimiento reducido con 4/4 mensajes; 4 etapas de coreografía fotografiadas |
| Capturas | `docs/capturas/` (10 imágenes) |

### Comandos realmente ejecutados

| Comando | Resultado |
|---|---|
| `node --check js/escena.js` | Sintaxis correcta |
| `python -m http.server 8765` | Servidor local, HTTP 200 |
| Chrome headless `--screenshot` a 1440×900, 560 y 390 | 19 capturas; 10 conservadas |
| Chrome headless `--force-prefers-reduced-motion` + `--dump-dom` | `reduce=true`, escenario `static`, 1 columna, rama estática, 4 pasos activos |
| Auditoría DOM de desbordes a 400/560/760/1024/1440 | «SIN DESBORDES» en los cinco anchos |

### Defectos encontrados y corregidos

1. Paneles superpuestos e ilegibles en la composición estática (móvil y movimiento reducido).
2. Menú móvil visible pese a `hidden`: `display:grid` de autor vencía a la regla del navegador.
3. Titulares del relato centrados en vez de alineados a la izquierda en la vista apilada.
4. Logotipo ilegible sobre el lateral azul del portal.
5. Hero demasiado apretado: el panel de resultado tapaba las alternativas.
6. **Componentes compartidos inaccesibles desde el portal**: `.panel`, `.barra` y `.lista-materias` vivían en `publico.css`, que las páginas del portal no cargan. El panel del ingreso y las barras de progreso salían invisibles. Se movieron a `base.css` (capa compartida).

### Corrección de un diagnóstico propio

Durante la verificación interpreté un `position: static` como prueba de que headless forzaba
`prefers-reduced-motion`. Era el **breakpoint móvil** (ventana headless por defecto de 800 px).
Se comprobó después con `--force-prefers-reduced-motion` explícito.

### Limitaciones (no verificado)

- Ancho real por debajo de 489 px: Chrome headless impone ese viewport mínimo.
- Sin medición de rendimiento (Lighthouse / Core Web Vitals).
- Sin prueba con lector de pantalla real ni verificador de contraste WCAG.
- Sólo Chrome; sin Safari ni Firefox.
- Todo son pruebas de laboratorio en un equipo, **no mediciones de usuarios reales**.

### Bloqueos que siguen abiertos

Los mismos de la sesión anterior: **DOC-01 a DOC-04**, **CONF-01** (razón social) y la autorización
del material institucional. El prototipo no los resuelve: sólo entrega la capa de presentación con
todos los datos marcados como demostración.

### Próxima acción concreta

Revisar el prototipo (`prototipo/README.md` explica cómo abrirlo) y confirmar dirección artística.
En paralelo, entregar los cuatro documentos para desbloquear las fases de construcción.

**Criterio de terminado del prototipo:** dirección artística aprobada por el propietario y cotejo del
inventario de pantallas contra DOC-04 cuando exista.

---

## Sesión 2026-09-05 (a) — Fase 0, auditoría de fuentes

**Fecha:** 2026-09-05
**Rama / commit:** no aplica — el proyecto **no es un repositorio Git** y no se inicializó ninguno
**Fase activa:** 0 — Cotejo y plan ejecutable
**Objetivo de la sesión:** ejecutar la Fase 0: localizar y leer las fuentes, y dejar creados los
documentos de arranque.

---

### Estado inicial encontrado

`c:\Users\tomyg\Desktop\PLATAFORMA` estaba **completamente vacío**. No había código, ni `docs/`, ni
control de versiones, ni el propio `CLAUDE.md` (llegó pegado en el mensaje del propietario, no en disco).
No existía trabajo previo que conservar ni cambios del usuario que respetar.

### Trabajo completado (con evidencia)

| Trabajo | Evidencia |
|---|---|
| Inspección del proyecto | Listado del directorio incluidos ocultos: vacío. Sin repositorio Git. |
| Búsqueda de DOC-01…DOC-04 | Escritorio, Documentos, Descargas, perfil de usuario (5 niveles, por palabra clave), OneDrive y Google Drive. **0 de 4 encontrados.** Detalle en `FUENTES.md` §2. |
| Descarte de falsos positivos | Los resultados de Drive `Wireframe.js`, `WireframeGeometry.js`, `Wireframe.d.ts` son código de la librería three.js, no wireframes de diseño. |
| Identificación de material relacionado | 9 grupos de archivos de Preicfes Bertel en `Downloads` y `Desktop`, catalogados en `FUENTES.md` §3 **sin autorizarlos como contenido**. |
| Detección de contradicción CONF-01 | Extracción de texto de `PROPUESTA   PARA MUNICIPIOS.docx`: la misión y el NIT corresponden a «INTEGRAL DE ASESORIAS Y SERVICIOS JABA S.A.S», mientras CLAUDE.md §1 habla de «Preicfes Bertel». |
| `CLAUDE.md` en la raíz | Creado con el texto entregado. Solo se reconstruyó el formato de tablas (DEC-L02); no se alteró ninguna palabra. |
| Seis documentos de Fase 0 | `FUENTES.md`, `DECISIONES.md`, `PANTALLAS.md`, `TRAZABILIDAD.md`, `ROADMAP.md`, `ESTADO.md`. |

### Comandos realmente ejecutados

| Comando | Resultado |
|---|---|
| Listado del directorio del proyecto (incl. ocultos) | Vacío |
| `find` sobre Desktop/Documents/Downloads por extensión de documento | Sin coincidencias con las fuentes |
| `find` sobre el perfil de usuario por palabras clave (`PRD`, `wireframe`, `bertel`, `icfes`, `arquitectura`, `plataforma`) | Solo material educativo y personal previo |
| Búsqueda en Google Drive por título + archivos recientes | Sin coincidencias |
| Extracción de texto de 3 `.docx` vía `zipfile` + limpieza de etiquetas XML | 1 legible (~26.000 caracteres), 2 ilegibles por extracción |
| `python --version` | Python 3.11.15. `python-docx` y `pypdf` **no** instalados (no se instaló nada) |

### Decisiones nuevas

Cinco decisiones locales reversibles, todas de documentación o de abstención: **DEC-L01** a **DEC-L05**
en `docs/DECISIONES.md` §2. Ninguna decisión de stack, esquema o alcance.

### Bloqueos y dependencias del propietario

1. **DOC-01 PRD maestro** — sin él: alcance, MVP, roles, reglas de simulacro y fórmula de calificación.
2. **DOC-02 Arquitectura completa** — sin él: todo el stack; bloquea la Fase 1 entera.
3. **DOC-03 Modelo de base de datos** — sin él: migraciones y persistencia; bloquea la Fase 2.
4. **DOC-04 Wireframes** — sin él: el inventario de pantallas; bloquea la Fase 3.
5. **CONF-01** — qué entidad se presenta al público: «Preicfes Bertel» o «INTEGRAL DE ASESORIAS Y
   SERVICIOS JABA S.A.S» (NIT 901145246-6), y qué textos institucionales son los vigentes.
6. **Autorización del material existente** — si portafolios, simulacros y claves de `Downloads` pueden
   usarse como contenido y banco de preguntas.
7. **Conectores sin autorizar** — Notion, Microsoft 365, Canva y Zoho CRM requieren autorización en los
   ajustes de conectores de claude.ai. Si las fuentes están ahí, siguen sin localizar.

### Lo que NO se hizo, deliberadamente

- No se eligió stack ni se instaló ninguna dependencia (CLAUDE.md §2: no presentar como aprobado un
  stack elegido por Claude).
- No se reconstruyeron el PRD, el esquema ni los wireframes a partir de sus títulos.
- No se inventaron pantallas, requisitos, entidades ni fórmulas de calificación.
- No se copió ni publicó material institucional cuya autorización no está confirmada.
- No se inicializó Git ni se creó ningún manifiesto de dependencias.

### Próxima acción concreta

**Recibir los cuatro documentos** y colocarlos en `docs/fuentes/`, o recibir la ruta / el conector donde
están.

Al recibirlos: leerlos íntegramente, actualizar `FUENTES.md` con títulos, rutas y estado real de lectura,
rehacer `DECISIONES.md` con el stack confirmado, completar `PANTALLAS.md` desde DOC-04 y sustituir los
IDs locales de `TRAZABILIDAD.md` por los IDs reales del PRD.

**Criterio para dar por terminada la Fase 0:** los cuatro documentos con estado de lectura verificable;
las siete decisiones de la matriz en CONFIRMADA o con pendiente explícito y su fuente; inventario de
pantallas con las pantallas reales de DOC-04; matriz de trazabilidad con los requisitos del PRD y su
prioridad de MVP; y contradicciones registradas con propuesta de resolución.
