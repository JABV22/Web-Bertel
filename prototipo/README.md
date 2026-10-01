# Prototipo visual — Plataforma Bertel

Prototipo de la estética premium de Preicfés Bertel: sitio público con escena 3D y narrativa de
scroll, más el sistema visual aplicado al portal académico.

**Esto no es la aplicación.** Es la capa visual, construida sin dependencias para no comprometer
decisiones de arquitectura que todavía no están aprobadas. Ver [../docs/DISENO.md](../docs/DISENO.md).

## Cómo verlo

Necesita un servidor local (abrir el archivo con doble clic funciona, pero el logotipo y las fuentes
se comportan mejor servidos por HTTP).

```sh
cd prototipo
python -m http.server 8765
```

Luego abrir <http://localhost:8765/index.html>.

Para detener el servidor: `Ctrl + C` en esa terminal.

## Qué mirar

| Ruta | Qué es |
|---|---|
| `index.html` | Sitio público: hero, escena de scroll, programas, resultados, identidad y cierre |
| `portal/ingreso.html` | Inicio de sesión |
| `portal/panel.html` | Panel del estudiante |
| `portal/simulacro.html` | Resolución de prueba — entorno estable, sin 3D ni parallax |
| `portal/resultados.html` | Resultados y revisión |
| `portal/administracion.html` | Tablas, filtros y contenidos editables |

En el sitio público, **desplázate despacio** por la sección oscura: es la secuencia de cuatro etapas.
Sube de nuevo para comprobar que es reversible.

## Comprobaciones rápidas

- **Movimiento reducido:** Windows → Configuración → Accesibilidad → Efectos visuales → desactivar
  «Efectos de animación». La escena pasa a una composición estática con los cuatro mensajes visibles.
- **Móvil:** F12 → icono de dispositivo. La secuencia sticky se sustituye por bloques verticales.
- **Teclado:** `Tab` recorre la página con foco visible; la primera pulsación revela «Saltar al contenido».

## Estructura

```
prototipo/
  index.html          Sitio público
  css/tokens.css      Variables: color, tipografía, espaciado, sombras, movimiento
  css/base.css        Reset, tipografía, botones, cabecera y pie
  css/publico.css     Hero, escena de scroll, programas, resultados
  css/portal.css      Ingreso, panel, simulacro, resultados y administración
  js/escena.js        Escena de scroll y menú móvil (sólo el sitio público)
  assets/             Logotipo extraído de los materiales del propietario
  portal/             Las cinco pantallas del portal
```

Las páginas del portal **no cargan `js/escena.js`**: no necesitan motor visual, y durante un simulacro
ninguna animación debe desplazar respuestas ni interferir con el temporizador.

## Contenido de demostración

Todas las páginas muestran un aviso superior. Programas, cifras y textos institucionales son
marcadores: **no son información aprobada**. Las cifras aparecen como «—» a propósito, porque la
fórmula de calificación y los resultados verificados aún no existen en el proyecto.

Los colores, la tipografía y el logotipo **sí** están verificados a partir de los materiales del
propietario (ver [../docs/DISENO.md](../docs/DISENO.md) §1).
