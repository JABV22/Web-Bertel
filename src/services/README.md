# src/services

Acceso a datos y contratos con Supabase (ARCH §7, capa de infraestructura).

`auth.ts` expone `getCurrentUser()` y `requireRole()` para consultar la identidad y verificar
permisos desde código de servidor. `assessments.ts` carga evaluaciones/resultados y delega inicio,
guardado y entrega a RPC de Supabase; las claves nunca se consultan desde el cliente.
