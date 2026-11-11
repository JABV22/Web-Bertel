import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type BertelRole = "admin" | "profesor" | "estudiante";

export async function getCurrentUser(): Promise<User | null> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error) {
    if (error.name === "AuthSessionMissingError") {
      return null;
    }

    throw error;
  }

  return user;
}

export async function requireRole(allowedRoles: readonly BertelRole[]) {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  console.log("-------------------1");

  if (authError || !user) {
    redirect("/ingreso");
  }

  const [{ data: profile, error: profileError }, { data: userRoles, error: rolesError }] =
    await Promise.all([
      supabase.from("profiles").select("status").eq("id", user.id).single(),
      supabase.from("user_roles").select("roles!inner(name)").eq("user_id", user.id),
    ]);

    console.log("-------------------2");

  if (rolesError) {
    throw new Error("No fue posible verificar los permisos de la cuenta.");
  }

  if (profileError || profile?.status !== "active") {
    redirect("/sin-acceso");
  }
console.log("-------------------3");
  const roleNames = (userRoles ?? []).map((userRole) => {
    const role = userRole.roles as unknown as { name: BertelRole };
    return role.name;
  });

  if (!roleNames.includes("admin") && !allowedRoles.some((role) => roleNames.includes(role))) {
    redirect("/sin-acceso");
  }
console.log("-------------------4");
  return { supabase, user, roles: roleNames };
}
