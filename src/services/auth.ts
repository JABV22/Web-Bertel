import type { User } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type BertelRole = "admin" | "profesor" | "estudiante";

type CourseEnrollment = {
  courses: { name: string };
};

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

  if (authError || !user) {
    redirect("/ingreso");
  }

  const [
    { data: profile, error: profileError },
    { data: userRoles, error: rolesError },
    { data: courseEnrollments, error: coursesError },
  ] = await Promise.all([
    supabase
      .from("profiles")
      .select("first_name, last_name, status")
      .eq("id", user.id)
      .single(),
    supabase.from("user_roles").select("roles!inner(name)").eq("user_id", user.id),
    supabase
      .from("course_enrollments")
      .select(
        "course_id, group_id, status, courses!inner(id, name, status, program_id, academic_period_id)",
      )
      .eq("student_id", user.id),
  ]);

  if (rolesError || coursesError) {
    throw new Error("No fue posible verificar los permisos de la cuenta.");
  }

  if (profileError || profile?.status !== "active") {
    redirect("/sin-acceso");
  }
  const roleNames = (userRoles ?? []).map((userRole) => {
    const role = userRole.roles as unknown as { name: BertelRole };
    return role.name;
  });

  if (!roleNames.includes("admin") && !allowedRoles.some((role) => roleNames.includes(role))) {
    redirect("/sin-acceso");
  }
  const profileWithEnrollments = {
    ...profile,
    courseEnrollments: (courseEnrollments ?? []) as unknown as CourseEnrollment[],
  };

  return {
    supabase,
    user,
    roles: roleNames,
    profile: profileWithEnrollments,
    courseEnrollments,
  };
}
