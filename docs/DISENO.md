# DISEÑO — Dirección artística y sistema visual

**Última actualización:** 2026-09-05 · **Alcance:** prototipo visual en `prototipo/`

> **Naturaleza del entregable.** Esto es un **prototipo visual funcional**, no la aplicación.
> El proyecto sigue sin stack aprobado (DOC-02 no existe), así que el rediseño se construyó de forma
> que **no compromete ninguna decisión técnica futura**: HTML semántico + CSS con variables + un guion
> sin dependencias. Todo es portable a React, Vue, Astro, Laravel o lo que indique la arquitectura.

## 1. Identidad de marca — procedencia verificada

No se inventó ningún color ni logotipo. Todo se extrajo de materiales del propietario:

| Elemento | Valor | Procedencia |
|---|---|---|
| Azul marino (primario) | `#1D3564` | Color dominante en `dashboard_preicfes_bertel_8c_20_de_enero_2026.html` (18 usos) y `..._9b_segundo_simulacro_2026.html` (22 usos) |
| Oro (acento) | `#E6B332` | 6 y 9 usos respectivamente en los mismos archivos |
| Gris de texto | `#667085` | 13 usos en ambos archivos |
| Degradado corporativo | `#172B55 → #203B70 → #E6B332` | Declarado literalmente en los dashboards |
| Verde acierto / rojo error | `#2D6A4F` / `#D64545` | Colores semánticos de los mismos dashboards |
| Tipografía | **Inter** (fallback Segoe UI, Arial) | `font-family:Inter,Segoe UI,Arial,sans-serif` en los dashboards |
| Logotipo | Monograma **PB** + wordmark «PREICFÉS BERTEL» | PNG incrustado en base64 en el dashboard 9-B, extraído a `prototipo/assets/logo-bertel.png` |
| Grafía de la marca | **Preicfés Bertel** (con tilde) | Título y textos de los dashboards |

Los dashboards incluyen la nota **«Preicfés Bertel · Paleta corporativa integrada»**, lo que confirma
que la paleta es deliberada y no accidental.

**Tratamiento del logotipo:** se le retiró el fondo claro por umbral de luminosidad/saturación para
obtener transparencia. Sus trazos son azul marino, de modo que sobre superficies oscuras se coloca
sobre una pastilla blanca (ver `portal.css`, última regla). No se redibujó ni se reinterpretó la marca.

**Pendiente:** confirmar valores oficiales si existe un manual de marca, y resolver **CONF-01**
(razón social, ver `FUENTES.md` §3).

## 2. Concepto y protagonista visual

Recorrido **Descubrir → Prepararse → Practicar → Comprender → Avanzar**.

El protagonista no son esferas ni partículas: son **paneles de interfaz del propio producto**
suspendidos en perspectiva — progreso, pregunta y resultado. Cada panel tiene grosor sutil
(`--grosor-panel`, cara lateral con `rotateX(-90deg)`), bordes precisos y sombra coherente con una
única fuente de luz cenital-frontal.

Los paneles muestran estructura real (enunciado, alternativas, componentes Saber 11, marcador de
aciertos/errores/omisiones) con los **valores vaciados a «—»**, porque no hay datos aprobados.

## 3. Decisión técnica: CSS 3D en lugar de WebGL

Se eligió **transformaciones CSS con `perspective`**, no WebGL. Motivos:

1. El brief pide usar «la solución compatible más sencilla que produzca el resultado», y una
   composición de paneles planos con profundidad es exactamente lo que resuelve CSS 3D.
2. WebGL habría exigido una librería (three.js), es decir, **una decisión de dependencia que DOC-02
   todavía no ha autorizado**.
3. Sin canvas, los encabezados, botones y navegación nunca dependen del render: siguen siendo HTML.

Coste: no hay iluminación volumétrica real. Se compensa con sombras en capas y un halo de acento.

## 4. Tokens

Definidos en `prototipo/css/tokens.css`: color, tipografía fluida (`clamp`), espaciado en escala de 4,
radios, sombras, movimiento y profundidad. La clase `.tema-oscuro` **redefine** tokens de texto y borde
para superficies oscuras en vez de introducir colores nuevos.

Tipografía fluida: `--t-display` va de 2.6rem a 6rem según el ancho; los titulares no se cortan ni
desbordan en ningún punto medido (ver §7).

## 5. La escena de scrollytelling

Implementada en `prototipo/js/escena.js`, contenedor de **280vh** (rango sugerido 250–300vh).

| Progreso | Cambio visual | Mensaje |
|---|---|---|
| 0–25 % | La plataforma aparece en perspectiva y se aproxima | «Prepárate con un propósito.» |
| 25–50 % | Los paneles se separan y destaca la pregunta | «Pon a prueba lo que sabes.» |
| 50–75 % | La vista evoluciona hacia el resultado | «Comprende tus aciertos y errores.» |
| 75–100 % | Los elementos se reúnen y se estabilizan | «Da el siguiente paso con Bertel.» |

Garantías implementadas:

- **Scroll nativo.** No se intercepta la rueda ni se fuerza la velocidad.
- **Reversible.** El progreso se deriva de `getBoundingClientRect()`, no se acumula: subir deshace.
- **Coherente al recargar a mitad de página**, porque se calcula en el primer pintado.
- **Mensajes en HTML semántico** (`<article>` + `<h2>` + `<p>`), nunca dibujados en un canvas.
- **No pinta fuera de pantalla** (`IntersectionObserver`) **ni con la pestaña oculta** (`visibilitychange`).
- **Libera recursos** en `destruir()`: observador, `scroll`, `resize`, `visibilitychange`.
- **Ante un fallo**, `try/catch` deja visible el contenido y la imagen de respaldo.

## 6. Movimiento reducido y móvil

- **`prefers-reduced-motion: reduce`** → el escenario deja de ser sticky, la rejilla pasa a una columna,
  los paneles se apilan legibles y **los cuatro mensajes quedan visibles simultáneamente**.
  El guion detecta la preferencia y toma la rama `estatico()`.
- **Móvil (< 980 px)** → misma sustitución por bloques verticales, profundidad reducida
  (`perspective` menor), sin paralaje de puntero y con menú desplegable operable con una mano.

## 7. Verificaciones realizadas

**Entorno:** Windows 11, Chrome 1440×900 y anchos intermedios, servidor local `python -m http.server`.
Todas son **pruebas de laboratorio en un único equipo**, no mediciones de usuarios reales.

| Comprobación | Método | Resultado |
|---|---|---|
| Sintaxis del guion | `node --check js/escena.js` | Correcto |
| Referencias locales | Recorrido de `href`/`src` de los 6 HTML | Todas resuelven |
| Desbordamiento horizontal | Auditoría DOM de elementos fuera del viewport | **Sin desbordes** a 489, 527, 727, 991 y 1407 px |
| Movimiento reducido | `--force-prefers-reduced-motion` + estilos computados | `reduce=true`, escenario `static`, 1 columna, rama estática activa, **4 de 4 mensajes visibles** |
| Coreografía | Progreso fijado en 0,02 / 0,30 / 0,55 / 0,80 | Las 4 etapas muestran el panel y el mensaje correctos |
| Alineación de titulares | Medición de rectángulos | Los 4 titulares en L27, ancho completo |
| Portal sin motor 3D | Inspección de los 5 HTML del portal | Ninguno carga `js/escena.js` |

**Defectos encontrados y corregidos durante la verificación:**

1. Paneles superpuestos e ilegibles en la composición estática (móvil y movimiento reducido).
2. Menú móvil visible pese al atributo `hidden` — `display:grid` de autor vencía a la regla del navegador.
3. Titulares del relato centrados en lugar de alineados a la izquierda en la vista apilada.
4. Logotipo ilegible sobre el lateral azul del portal (sus trazos son azul marino).
5. Composición del hero demasiado apretada: el panel de resultado tapaba las alternativas.
6. **Componentes compartidos inaccesibles desde el portal**: `.panel`, `.barra` y `.lista-materias` vivían en `publico.css`, que las páginas del portal no cargan. El panel del ingreso y las barras de progreso salían invisibles. Se movieron a `base.css` (capa compartida).

Capturas en [docs/capturas/](capturas/).

## 7b. Organización del CSS

| Archivo | Contiene | Lo cargan |
|---|---|---|
| `tokens.css` | Variables | Todas las páginas |
| `base.css` | Reset, tipografía, botones, cabecera, pie **y componentes compartidos** (panel, barra, opciones, gráfico) | Todas las páginas |
| `publico.css` | Hero, escena de scroll, programas, identidad, cierre | Sólo `index.html` |
| `portal.css` | Ingreso, panel, simulacro, resultados, administración | Sólo el portal |

Los componentes compartidos están en `base.css` precisamente porque el portal los reutiliza; tenerlos
en `publico.css` fue el defecto 6.

## 8. Limitaciones conocidas

- **Ancho móvil real (< 489 px) no verificado**: Chrome headless impone un viewport mínimo de 489 px.
  Los estilos para 560 px y menos están escritos, pero no fotografiados por debajo de ese límite.
- **Sin medición de rendimiento**: no se ejecutó Lighthouse ni se midieron Core Web Vitals.
- **Sin prueba con lector de pantalla real**: se aplicaron `aria-label`, `aria-hidden`, `role`,
  foco visible y jerarquía semántica, pero no se validó con NVDA/VoiceOver.
- **Sin prueba en Safari/Firefox**: sólo Chrome. `backdrop-filter` y `:has()` tienen soporte
  moderno amplio, pero conviene comprobarlo.
- **Contraste no medido con herramienta**: los pares se eligieron conservadores (azul marino sobre
  blanco cálido, blanco sobre azul marino), pero no se corrió un verificador WCAG.
- **Contenido de demostración**: programas, cifras y textos institucionales son marcadores.
  El aviso superior lo declara en todas las pantallas.

## 9. Qué debe portarse al stack definitivo

Cuando exista DOC-02:

1. `tokens.css` se traslada tal cual (o a la sintaxis de tokens del sistema elegido).
2. Cada panel/tarjeta pasa a componente del framework, conservando clases y estructura.
3. `escena.js` se envuelve en el ciclo de vida del componente, llamando a `destruir()` al desmontar.
4. Los textos y cifras marcados «—» y «Por confirmar» se sustituyen por datos servidos desde la
   administración, **sin editar la animación ni redesplegar código**.
