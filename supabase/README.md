# supabase/

## Migraciones

`migrations/001_exam_authorization.sql`, `002_admin_assessment_access.sql`,
`003_multiple_attempts_pending_scoring.sql` y `004_estimated_icfes_scoring.sql`
agregan roles, políticas RLS y funciones
transaccionales sobre las tablas descritas en el diccionario de datos
entregado por el propietario el 2026-11-18. El resumen de relaciones está en
[`docs/DICCIONARIO_DATOS.md`](../docs/DICCIONARIO_DATOS.md).

Esta migración **no crea las tablas de origen** y no se puede usar para iniciar una base vacía.
Primero hay que confirmar que el proyecto Supabase objetivo tiene las tablas y columnas exactas de
DOC-05. Las migraciones no se han aplicado ni validado contra una instancia remota.

Antes de aplicarla:

1. Respaldar la base y comprobar el esquema remoto frente al adjunto.
2. Aplicarla primero en un proyecto de desarrollo/staging con datos de prueba.
3. Probar acceso de cada rol, inicio/entrega de intentos y la calificación según DOC-06 antes de
   producción.
4. Preparar una reversión operativa; habilitar RLS puede bloquear clientes que dependían del acceso
   anterior y retirar políticas no es una reversión suficiente de los datos.

Con DOC-05 y la migración 003, valida al menos estos casos en desarrollo:

- Dos inicios simultáneos mientras el intento sigue vigente devuelven el mismo intento.
- La entrega repetida conserva un único resultado en `assessment_results`.
- Después de la entrega o vencimiento se puede iniciar un nuevo intento con otro UUID.
- El ejemplo 70, 80, 65, 75 y 60 por área produce 358 puntos estimados.

Las migraciones insertan los roles que falten y no modifican respuestas ni resultados existentes.
Sí crean políticas, funciones y triggers, por lo que su efecto sobre la base debe revisarse antes
de aplicarlas. La migración 004 implementa el puntaje estimado ponderado de 0–500 con el detalle
documentado en `docs/CALIFICACION.md`.

Para asignar el primer rol, crea primero el perfil si aún no existe y luego ejecuta desde el SQL
Editor confiable de Supabase, sustituyendo el marcador por el UUID real de `auth.users`:

```sql
insert into public.profiles (id, status)
values ('<AUTH_USER_UUID>'::uuid, 'active')
on conflict (id) do nothing;

insert into public.user_roles (user_id, role_id)
select '<AUTH_USER_UUID>'::uuid, id
from public.roles
where name = 'admin'
on conflict (user_id, role_id) do nothing;
```

Usa `profesor` o `estudiante` para las demás cuentas. Nunca permitas que una persona seleccione o
modifique su propio rol desde el formulario de perfil.

## Revisión de intentos calificados

En un entorno donde ya están aplicadas las migraciones 001 a 004, aplica las
siguientes migraciones en orden:

1. `005_graded_attempt_review.sql` instala la consulta de revisión.
2. `006_assessment_admin_and_images.sql` instala el flujo administrativo y el
   acceso a imágenes vinculadas en Storage.
3. `007_graded_review_role_lookup.sql` actualiza la consulta de revisión para
   usar las asignaciones de roles de la base directamente.

Si 005 y 006 ya se aplicaron, ejecuta solo 007. Subir el código a Git no
ejecuta estas migraciones en Supabase por sí mismo.

La revisión usa `get_graded_attempt_review` para cada intento calificado. La
seleccion y la clave se consultan por separado, de modo que una pregunta
omitida también muestra su opción correcta cuando existe una clave en
`private.answer_keys`. Comprueba un acierto, un error y una omisión después
del despliegue. La clave queda reservada a revisiones autorizadas de intentos
calificados.

## Gestión de usuarios

Aplica `008_admin_user_management.sql` después de 007 y antes de desplegar la
pantalla **Administración > Gestionar usuarios**. Conserva las matrículas y los
resultados existentes al deshabilitar accesos.

Para enviar invitaciones, configura `SUPABASE_SERVICE_ROLE_KEY` como variable
privada del servidor y `NEXT_PUBLIC_SITE_URL` con el dominio de la aplicación.
La clave de servicio solo se usa en la acción de registro del servidor.
Configura SMTP en Supabase Auth y agrega la URL completa
`https://TU-DOMINIO/auth/confirmar` a **Redirect URLs**. En **Email Templates >
Invite user**, usa el siguiente enlace en la plantilla:

```html
<a href="{{ .RedirectTo }}?token_hash={{ .TokenHash }}&amp;type=invite">Activa tu cuenta</a>
```

Cada cuenta nueva necesita asignación individual para presentar simulacros.
Las cuentas anteriores mantienen su acceso a pruebas publicadas hasta que se
configure una excepción. Los profesores conservan el permiso de revisión académica,
que puede deshabilitarse por simulacro. Las claves de intentos se consultan
solo al revisar intentos calificados y autorizados.

Habilitar un curso para un estudiante sin matrícula crea una prematrícula.
Matricular cambia su estado a `matriculado`. Deshabilitar conserva el estado
de matrícula y retira el acceso del portal. Para profesores, la asignación
usa la relación docente del curso. Un permiso de simulacro requiere que la
prueba esté publicada para empezar o reanudar un intento.

## Revisión previa de simulacros

Aplica `009_teacher_preview_permissions.sql` después de 008. Administración
puede revisar cualquier simulacro con su clave desde el listado de pruebas.
En **Gestionar usuarios**, el permiso de revisión previa se concede por
profesor y simulacro, independientemente de la asignación a estudiantes.
Los permisos explícitos ya concedidos a docentes se conservan. Los demás
simulacros requieren una concesión expresa para que un profesor vea sus claves
antes de que existan intentos.
