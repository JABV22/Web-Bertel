# src/services

Acceso a datos y contratos con Supabase (ARCH §7, capa de infraestructura).

`auth.ts` expone `getCurrentUser()` para consultar la identidad autenticada
desde código de servidor. Los errores reales de Supabase se propagan; la
ausencia normal de sesión devuelve `null` ez xd.
