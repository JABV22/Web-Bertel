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

export async function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const protectedPath = isProtectedPath(pathname);
  const loginUrl = new URL("/ingreso", request.url);
  loginUrl.searchParams.set("destino", pathname + search);

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!url || !key) {
    return protectedPath ? NextResponse.redirect(loginUrl) : NextResponse.next();
  }

  let response = NextResponse.next({ request });
  function redirectWithCookies(destination: URL) {
    const redirect = NextResponse.redirect(destination);
    for (const cookie of response.cookies.getAll()) redirect.cookies.set(cookie);
    return redirect;
  }

  // Cliente de Supabase para leer cookies y comprobar la autenticación del usuario en el servidor.
  const supabase = createServerClient(
    url,
    key,
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
  if (protectedPath && !user) {
    return redirectWithCookies(loginUrl);
  }

  // Reglas especiales para /prueba-supabase: solo admin y usuario activo puede entrar.
  if (request.nextUrl.pathname === "/prueba-supabase" && user) {
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
      return redirectWithCookies(deniedUrl);
    }
  }

  // Si el usuario ya se autenticó y entra a /ingreso, se lo redirige al portal correcto según rol y estado.
  if (request.nextUrl.pathname === "/ingreso" && user) {
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
    const destino = request.nextUrl.searchParams.get("destino");
    if (portalUrl.pathname !== "/sin-acceso" && destino?.startsWith("/") && URL.canParse(destino, request.url)) {
      const target = new URL(destino, request.url);
      if (target.origin === request.nextUrl.origin && isProtectedPath(target.pathname)) {
        return redirectWithCookies(target);
      }
    }
    return redirectWithCookies(portalUrl);
  }

  // Si ninguna regla activa redirige, se devuelve la respuesta normal para continuar la petición.
  return response;
}

export default proxy;

// Solo el ingreso y las rutas protegidas necesitan consultar la sesión.
export const config = {
  matcher: [
    "/ingreso",
    "/panel/:path*",
    "/simulacro/:path*",
    "/administracion/:path*",
    "/resultados/:path*",
    "/prueba-supabase/:path*",
  ],
};
