# supabase/

## Migraciones

`migrations/001_exam_authorization.sql` agrega roles, políticas RLS y funciones transaccionales
para iniciar, responder y calificar evaluaciones sobre el esquema de Supabase entregado por el
propietario el 2026-11-09.

Esta migración **no crea las tablas de origen** y no se puede usar para iniciar una base vacía.
Primero hay que confirmar que el proyecto Supabase objetivo tiene las tablas y columnas exactas del
esquema adjunto. La migración no se ha aplicado ni validado contra una instancia remota.

Antes de aplicarla:

1. Respaldar la base y comprobar el esquema remoto frente al adjunto.
2. Aplicarla primero en un proyecto de desarrollo/staging con datos de prueba.
3. Probar acceso de cada rol y envío/calificación antes de producción.
4. Preparar una reversión operativa; habilitar RLS puede bloquear clientes que dependían del acceso
   anterior y retirar políticas no es una reversión suficiente de los datos.

La migración inserta los roles que falten y no modifica respuestas ni resultados existentes. Sí crea
políticas, funciones y triggers, por lo que su efecto sobre la base debe revisarse antes de aplicarla.

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
