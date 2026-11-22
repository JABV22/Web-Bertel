# Calificación de simulacros

**Fuente:** `C:\Users\kent\Downloads\Metodología_y_Fórmulas_de_Calificación_-_Prueba_Estilo_ICFES__Saber_11_.pdf`  
**Consulta:** 2026-11-19 · 3 páginas · SHA-256 `4EF7D04714DC737F6C985B053CE9AB73D6D2D40701E580E5425BDE8F2A7F5D69`

Esta metodología calcula un **puntaje estimado de práctica**. No reproduce el modelo psicométrico
IRT del examen oficial y el resultado nunca debe presentarse como puntaje oficial del ICFES.

## Fórmula

Para cada área evaluada:

```text
puntaje_area = correctas_del_area / preguntas_del_area * 100
```

Ponderaciones relativas para un simulacro completo:

| Área | Peso relativo | Peso proporcional almacenado por defecto |
|---|---:|---:|
| Matemáticas | 3 | 3/13 |
| Lectura Crítica | 3 | 3/13 |
| Ciencias Naturales | 3 | 3/13 |
| Sociales y Ciudadanas | 3 | 3/13 |
| Inglés | 1 | 1/13 |

```text
puntaje_global = round(
  sum(puntaje_area * peso_area) / sum(peso_area de las áreas evaluadas) * 5
)
```

Solo se redondea el puntaje global final al entero más cercano; los valores intermedios conservan
su precisión. La normalización dinámica permite calificar pruebas parciales. Si el área tiene un
peso relativo configurado en `assessment_sections.weight`, se usa ese valor; de lo contrario, se
aplica el peso por defecto correspondiente a su nombre. Cada pregunta debe estar vinculada a una
sección/área. Áreas sin peso reconocido ni valor configurado, preguntas sin sección o claves
inválidas hacen fallar el cálculo explícitamente.

## Caso de verificación del documento

| Área | Puntaje de área | Peso |
|---|---:|---:|
| Matemáticas | 70 | 3 |
| Lectura Crítica | 80 | 3 |
| Ciencias Naturales | 65 | 3 |
| Sociales y Ciudadanas | 75 | 3 |
| Inglés | 60 | 1 |

```text
(70*3 + 80*3 + 65*3 + 75*3 + 60*1) / 13 * 5
= 357.6923... -> 358 puntos estimados
```

Un área obtiene su puntaje usando todas las preguntas del área como denominador, incluidas las
omitidas. Por ello, una omisión no cuenta como acierto. Los conteos de correctas, incorrectas y
omitidas se almacenan junto al puntaje.

## Implementación y límites

- La única implementación autorizada del cálculo vive en servidor, en
  `supabase/migrations/004_estimated_icfes_scoring.sql`; el navegador no calcula la nota.
- El cálculo se realiza al entregar, dentro de una transacción, y la entrega/resultados son
  idempotentes.
- Las entregas antiguas que quedaron en estado `enviado` se califican al consultar su resultado
  cuando el usuario es su propietario o administrador y la migración 004 está aplicada.
- El modelo actual conserva el puntaje global y los conteos, pero no una tabla de desglose por área.
  La puntuación por área se usa para la suma ponderada; no se persiste ni se muestra como resultado
  individual hasta que el modelo de datos disponga de un campo aprobado.
- Las migraciones SQL aún deben validarse contra el esquema real y probarse en Supabase de
  desarrollo antes de aplicarse a producción.
