# FUENTES — Inventario de documentos fuente

**Última actualización:** 2026-09-05 · **Fase:** 0 — **CERRADA**

> Los cuatro documentos fueron entregados por el propietario el 2026-09-05 y **leídos íntegramente**.
> Se copiaron byte a byte desde `c:\Users\tomyg\Downloads\` a `docs/`, siguiendo la convención de
> ARCHITECTURE.md §85 (`/docs/PRD.md`, `ARCHITECTURE.md`, `DATABASE.md`, `WIREFRAMES.md`).

## 1. Documentos exigidos por CLAUDE.md §2

| ID | Título real | Ruta | Versión / fecha | Estado de lectura | Observaciones |
|---|---|---|---|---|---|
| DOC-01 | PRD MAESTRO — Plataforma Web Educativa Preicfes Bertel | [PRD.md](PRD.md) | v1.0 · Septiembre 2026 | **LEÍDO ÍNTEGRO** (71 secciones, 980 líneas) | Define MVP, 20 criterios de aceptación, 10 reglas de negocio y prioridades P0–P3. |
| DOC-02 | ARQUITECTURA COMPLETA DEL SISTEMA | [ARCHITECTURE.md](ARCHITECTURE.md) | v1.0 | **LEÍDO ÍNTEGRO** (87 secciones, 1.319 líneas) | Stack confirmado, 20 módulos, rutas, capas y orden de construcción. |
| DOC-03 | MODELO COMPLETO DE BASE DE DATOS | [DATABASE.md](DATABASE.md) | v1.0 | **LEÍDO ÍNTEGRO** (100 secciones, 1.665 líneas) | 44 tablas, RLS, versionado, inmutabilidad y reglas explícitas para Claude Code (§87). |
| DOC-04 | WIREFRAMES MAESTROS | [WIREFRAMES.md](WIREFRAMES.md) | v1.0 | **LEÍDO ÍNTEGRO** (96 secciones, 1.216 líneas) | ~85 pantallas, 10 pantallas maestras prioritarias, componentes y reglas UX. |

**4 de 4 disponibles y leídos.** Ninguna parte resultó ilegible: los archivos son UTF-8 válido.

Nota de codificación: el texto adjuntado al chat llegó con mojibake (`VersiÃ³n`). Los archivos en
disco **no** tienen ese problema; se copiaron los originales, no la versión del chat.

## 2. Documentos previstos y aún no entregados

ARCHITECTURE.md §85 prevé también `SECURITY.md`, `ROUTES.md` y `TESTING.md`. No existen todavía.
No bloquean el MVP: su contenido está cubierto por PRD §48–51, ARCHITECTURE §29–34 y §52–54.

## 3. Contradicciones registradas

### CONF-01 — Identidad institucional · **RESUELTA**

- **Estado anterior:** se detectó que el único texto institucional legible del propietario
  (`PROPUESTA PARA MUNICIPIOS.docx`) atribuía misión y NIT a *INTEGRAL DE ASESORIAS Y SERVICIOS
  JABA S.A.S*, mientras el proyecto se llama Preicfes Bertel.
- **Resolución:** los cuatro documentos **no mencionan JABA ni una sola vez** (verificado con
  `grep -ci "jaba"` → 0 en los cuatro). PRD §2 y ARCHITECTURE §4 identifican el producto como
  **Preicfes Bertel**, con dominio `https://www.preicfesbertel.com`.
- **Conclusión:** la marca del producto es Preicfes Bertel. El documento de JABA S.A.S es material
  comercial de otra entidad y **no se usa** como contenido institucional.
- **Pendiente menor:** la razón social que debe figurar en los textos legales
  (PRD §10 exige Política de privacidad y Términos) sigue sin confirmar. No bloquea el MVP técnico.

### CONF-02 — Grafía de la marca · **ABIERTA**

| Fuente | Grafía |
|---|---|
| Los cuatro documentos | **Preicfes** Bertel — sin tilde, 9 ocurrencias, 0 con tilde |
| Dominio (ARCHITECTURE §4) | `preicfesbertel.com` — sin tilde |
| Logotipo del propietario | «PREICF**É**S BERTEL» — con tilde |
| Dashboards del propietario | «Preicf**é**s Bertel» — con tilde |

- **Impacto:** afecta el wordmark, el `<title>` de todas las páginas, el pie y los textos legales.
- **Propuesta de resolución:** dado que el logotipo y los dashboards reales usan tilde y el dominio
  no puede llevarla, lo más probable es que la grafía correcta sea **Preicfés Bertel** y que los
  documentos la hayan perdido al escribirse. **Requiere confirmación del propietario**; hasta
  entonces el prototipo mantiene la tilde por coherencia con el logotipo.

### CONF-03 — Programas del prototipo · **RESUELTA, corrección pendiente**

- El prototipo visual presenta «Instituciones y municipios» como tercer programa. **Fue una
  invención mía**, deducida de los dashboards por grupos y de la propuesta a municipios.
- PRD §9 fija los programas reales: **PreICFES, Preuniversitario y Curso para el Magisterio**.
- **Acción:** corregir el prototipo. Registrado en `ESTADO.md`.

## 4. Material complementario del propietario (no son DOC-01…04)

Sigue siendo insumo candidato, **pendiente de autorización** como contenido publicable:

| Material | Uso previsto | Fase |
|---|---|---|
| `dashboard_preicfes_bertel_*.html` | Origen verificado de marca, color y logotipo (ver `DISENO.md` §1) | Ya usado |
| Portafolios y `PRESENTACION RESULTADOS ESTADISTICOS 2025` | `institutional_metrics` (DOC-03 §46) y página Resultados | 3 |
| Simulacros y claves de respuesta en PDF | Banco de preguntas (`questions` / `question_versions`) | 4 |
| `PROPUESTA PARA MUNICIPIOS.docx` | **Descartado** como contenido institucional (CONF-01) | — |
