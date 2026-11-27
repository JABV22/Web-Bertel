"use server";

import { createClient as createSupabaseClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { requireRole } from "@/services/auth";

type Feedback = { ok: boolean; message: string };
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;
const roles = ["admin", "profesor", "estudiante"];

function field(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

const messages: Record<string, string> = {
  EMAIL_ALREADY_REGISTERED: "El correo ya est\u00e1 registrado. Busca al usuario en el listado.",
  DOCUMENT_ALREADY_REGISTERED: "La c\u00e9dula ya est\u00e1 registrada.",
  CANNOT_CHANGE_OWN_ROLE: "Tu rol debe cambiarlo otro administrador.",
  INVALID_USER_DATA: "Revisa los datos de registro.",
  INVALID_ROLE: "El rol no es v\u00e1lido.",
  STUDENT_ROLE_REQUIRED: "Asigna primero el rol Estudiante.",
  TEACHER_ROLE_REQUIRED: "Asigna primero el rol Profesor.",
};

const managementPath = "/administracion/usuarios";

function failed(message: string, code?: string): Feedback {
  return {
    ok: false,
    message: code === "PGRST202" ? "Falta aplicar la migraci\u00f3n 008 en Supabase."
      : messages[message] ?? (code === "23505" ? "Ya hay un registro con estos datos." : "No fue posible completar la operaci\u00f3n."),
  };
}

export async function registerUser(_previous: Feedback, data: FormData): Promise<Feedback> {
  const { supabase } = await requireRole(["admin"]);
  const email = field(data, "email").toLowerCase();
  const document = field(data, "document");
  const role = field(data, "role");
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || email.length > 254 ||
      !/^\d{4,20}$/.test(document) || !roles.includes(role)) {
    return failed("INVALID_USER_DATA");
  }

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  const projectUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const productionHost = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ??
    (productionHost ? `https://${productionHost}` : "http://localhost:3000");
  if (!key || !projectUrl || !URL.canParse(projectUrl) || !URL.canParse(siteUrl)) {
    return { ok: false, message: "Falta configurar el servicio de invitaciones en el servidor." };
  }

  const { data: ticket, error } = await supabase.rpc("bertel_admin_prepare_user", {
    p_email: email, p_document: document, p_role: role,
  });
  if (error || typeof ticket !== "string") return failed(error?.message ?? "", error?.code);

  const inviteClient = createSupabaseClient(projectUrl, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });

  let delivered = false;
  try {
    const invite = await inviteClient.auth.admin.inviteUserByEmail(email, {
      data: { bertel_registration_ticket: ticket },
      redirectTo: new URL("/auth/confirmar", siteUrl).href,
    });
    delivered = !invite.error;
  } catch {
    // Reconcile with the database even if the Auth request timed out.
  }

  const { data: registeredId, error: checkError } = await supabase.rpc("bertel_admin_registration_result", {
    p_ticket: ticket,
    p_email: email,
  });

  if (checkError) return { ok: false, message: "No se pudo confirmar el registro. Busca el correo antes de volver a enviarlo." };
  if (!registeredId) {
    return { ok: false, message: "Supabase no complet\u00f3 el registro. Revisa la configuraci\u00f3n de invitaciones y correo." };
  }
  revalidatePath(managementPath);
  return {
    ok: true,
    message: delivered ? "Cuenta registrada. Se envi\u00f3 la invitaci\u00f3n."
      : "Cuenta registrada. El env\u00edo de la invitaci\u00f3n no se pudo confirmar.",
  };
}

export async function updateUserAccess(_previous: Feedback, data: FormData): Promise<Feedback> {
  const { supabase } = await requireRole(["admin"]);
  const user = field(data, "user");
  const action = field(data, "action");
  const role = field(data, "role");
  const resource = field(data, "resource");
  if (!uuid.test(user)) return failed("INVALID_USER_DATA");

  let mutation;
  if (action === "role" && roles.includes(role)) {
    mutation = supabase.rpc("bertel_admin_set_role", { p_user: user, p_role: role });
  } else if (uuid.test(resource) && ["course_enable", "course_enroll", "course_disable", "course_assign_teacher", "course_remove_teacher"].includes(action)) {
    mutation = supabase.rpc("bertel_admin_set_course", { p_user: user, p_course: resource, p_action: action.slice(7) });
  } else if (uuid.test(resource) && ["preview_enable", "preview_disable"].includes(action)) {
    const { error } = await supabase.rpc("bertel_admin_set_teacher_preview", {
      p_teacher: user, p_assessment: resource, p_enabled: action === "preview_enable",
    });
    if (error?.code === "PGRST202") return { ok: false, message: "Aplica la migración 009 en Supabase." };
    if (error) return failed(error.message, error.code);
    revalidatePath(managementPath);
    revalidatePath("/simulacro");
    revalidatePath(`/simulacro/revision/${resource}`);
    return { ok: true, message: "Permiso de revisión actualizado." };
  } else if (uuid.test(resource) && ["assessment_enable", "assessment_disable"].includes(action)) {
    mutation = supabase.rpc("bertel_admin_set_assessment", {
      p_user: user, p_assessment: resource, p_enabled: action === "assessment_enable",
    });
  } else {
    return { ok: false, message: "Selecciona una operaci\u00f3n v\u00e1lida." };
  }

  const { error } = await mutation;
  if (error) return failed(error.message, error.code);
  revalidatePath(managementPath);
  revalidatePath("/panel");
  revalidatePath("/simulacro");
  return { ok: true, message: "Cambios guardados." };
}
