import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { SESSION_MAX_AGE_SECONDS } from "@/lib/supabase/session";

// Rutas que requieren autenticación para que el middleware pueda redirigir a ingreso si falta sesión.
const protectedPaths = [
  "/panel",
  "/simulacro",
  "/administracion",
  "/resultados",
  "/prueba-supabase",
];

// Verifica si la ruta actual está protegida o si pertenece a una subruta protegida.
function isProtectedPath(pathname: string) {
  return protectedPaths.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`),
  );
}

// Middleware principal: valida la sesión de Supabase y aplica reglas de acceso por ruta.
export async function proxy(request: NextRequest) {
  // Se crea la respuesta base que continuará la petición si no hay redirección.
  let response = NextResponse.next({ request });

  // Cliente de Supabase para leer cookies y comprobar la autenticación del usuario en el servidor.
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookieOptions: { maxAge: SESSION_MAX_AGE_SECONDS },
      cookies: {
        // Lee todas las cookies del request para mantener sincronizado el estado del usuario.
        getAll() {
          return request.cookies.getAll();
        },
        // Guarda cookies nuevas/cambiadas en la respuesta y también en la request para seguir el flujo.
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({ request });
          
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
        },
      },
    },
  );

  // Obtiene el usuario actual a partir de la sesión autenticada en Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Si la ruta es protegida y el usuario no está autenticado, se fuerza a ingresar.
  if (isProtectedPath(request.nextUrl.pathname) && !user) {
    console.log("Ruta protegida sin sesión, redirigiendo a ingreso.");
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = "/ingreso";
    loginUrl.search = "";
    return NextResponse.redirect(loginUrl);
  }

  // Reglas especiales para /prueba-supabase: solo admin y usuario activo puede entrar.
  if (request.nextUrl.pathname === "/prueba-supabase" && user) {
    console.log("Verificando acceso a /prueba-supabase para usuario:", user.id);
    const [{ data: profile }, { data: userRoles }] = await Promise.all([
      supabase.from("profiles").select("status").eq("id", user.id).maybeSingle(),
      supabase.from("user_roles").select("roles!inner(name)").eq("user_id", user.id),
    ]);
    const isAdmin = userRoles?.some((userRole) => {
      const role = userRole.roles as unknown as { name: string };
      return role.name === "admin";
    });
    if (profile?.status !== "active" || !isAdmin) {
      const deniedUrl = request.nextUrl.clone();
      deniedUrl.pathname = "/sin-acceso";
      deniedUrl.search = "";
      return NextResponse.redirect(deniedUrl);
    }
  }

  // Si el usuario ya se autenticó y entra a /ingreso, se lo redirige al portal correcto según rol y estado.
  if (request.nextUrl.pathname === "/ingreso" && user) {
    console.log("Usuario autenticado accediendo a /ingreso, redirigiendo al portal correspondiente.");
    const [{ data: userRoles }, { data: profile }] = await Promise.all([
      supabase.from("user_roles").select("roles!inner(name)").eq("user_id", user.id),
      supabase.from("profiles").select("status").eq("id", user.id).maybeSingle(),
    ]);
    const roleNames = (userRoles ?? []).map((userRole) => {
      const role = userRole.roles as unknown as { name: string };
      return role.name;
    });
    const portalUrl = request.nextUrl.clone();
    portalUrl.pathname = profile?.status !== "active"
      ? "/sin-acceso"
      : roleNames.includes("admin")
        ? "/administracion"
        : roleNames.includes("profesor")
          ? "/resultados"
          : roleNames.includes("estudiante")
            ? "/panel"
            : "/sin-acceso";
    portalUrl.search = "";
    return NextResponse.redirect(portalUrl);
  }

  // Si ninguna regla activa redirige, se devuelve la respuesta normal para continuar la petición.
  return response;
}

export default proxy;

// Configuración del middleware para ejecutarse en todas las rutas relevantes excepto assets y archivos estáticos.
export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)",
  ],
};
