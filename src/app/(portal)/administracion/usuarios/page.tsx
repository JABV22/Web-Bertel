import Link from "next/link";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { UserRegistrationForm, UserManagementForms, type UserAccess } from "@/components/portal/UserManagementForms";
import { requireRole } from "@/services/auth";

export const metadata = { title: "Usuarios" };

type DirectoryUser = {
  id: string;
  email: string | null;
  name: string | null;
  document_number: string | null;
  roles: string[];
};

export default async function AdminUsersPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; usuario?: string }>;
}) {
  const [{ supabase, user }, params] = await Promise.all([requireRole(["admin"]), searchParams]);
  const search = typeof params.q === "string" ? params.q.trim().slice(0, 120) : "";
  const { data, error } = await supabase.rpc("bertel_admin_users", { p_search: search });
  const users: DirectoryUser[] = data ?? [];
  const selected = users.find((person) => person.id === params.usuario);
  const access = selected
    ? await supabase.rpc("bertel_admin_user_access", { p_user: selected.id })
    : null;

  return (
    <>
      <PortalTopbar title="Usuarios" initials="AD" />
      <main className="contenido" id="principal">
        <Link href="/administracion" className="mb-5 inline-block font-semibold text-bertel-azul">Volver a Administración</Link>
        {error ? (
          <p role="alert">
            {error.code === "PGRST202" ? "Aplica la migración 008 en Supabase para habilitar la gestión de usuarios." : "No se pudo cargar el listado de usuarios."}
          </p>
        ) : (
          <>
            <UserRegistrationForm />
            <form action="/administracion/usuarios" className="filtros mb-5" role="search">
              <div className="campo">
                <label htmlFor="search-users">Buscar por correo, nombre o cédula</label>
                <input className="entrada" type="search" name="q" id="search-users" defaultValue={search} maxLength={120} />
              </div>
              <button className="btn btn--sm btn--linea">Buscar</button>
            </form>
            <div className="grid items-start gap-6 lg:grid-cols-2">
              <section aria-labelledby="users-heading">
                <h2 className="mb-3 text-lg font-bold" id="users-heading">Usuarios</h2>
                {users.length === 0 ? <p>No se encontraron usuarios.</p> : (
                  <ul className="divide-y divide-borde rounded-lg border border-borde bg-superficie">
                    {users.map((person) => {
                      const query = new URLSearchParams({ usuario: person.id });
                      if (search) query.set("q", search);
                      return (
                        <li key={person.id}>
                          <Link href={`?${query}`} aria-current={selected?.id === person.id ? "page" : undefined}
                            className={`block p-3 hover:bg-superficie-alt ${selected?.id === person.id ? "bg-superficie-alt" : ""}`}>
                            <span className="block break-words font-semibold">{person.name || person.email || "Usuario sin nombre"}</span>
                            <span className="block break-words text-sm text-gris-texto">{person.name && person.email ? `${person.email} · ` : ""}{person.roles.join(", ") || "Sin rol"}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </section>
              {selected && (
                <section className="rounded-xl border border-borde bg-superficie p-4" aria-labelledby="account-heading">
                  <h2 id="account-heading" className="break-words text-lg font-bold">{selected.name || selected.email || "Usuario"}</h2>
                  <p className="mt-2 text-sm text-gris-texto">Cédula {selected.document_number || "sin registrar"}</p>
                  {access?.error ? <p role="alert">No se pudieron consultar los accesos.</p> : access?.data && (
                    <UserManagementForms key={selected.id} userId={selected.id} roles={selected.roles}
                      canChangeRole={selected.id !== user.id} access={access.data as UserAccess} />
                  )}
                </section>
              )}
            </div>
          </>
        )}
      </main>
    </>
  );
}
