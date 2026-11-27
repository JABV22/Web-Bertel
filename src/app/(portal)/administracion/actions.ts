"use server";

import { revalidatePath } from "next/cache";
import { requireRole } from "@/services/auth";

type Feedback = { ok: boolean; message: string };
const uuid = /^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i;

function field(data: FormData, name: string) {
  const value = data.get(name);
  return typeof value === "string" ? value.trim() : "";
}

export async function createDraft(_previous: Feedback, data: FormData): Promise<Feedback> {
  const { supabase } = await requireRole(["admin"]);
  const source = field(data, "source");
  const title = field(data, "title");
  const description = field(data, "description");
  const duration = Number(field(data, "duration"));
  if (!uuid.test(source) || !title || title.length > 200 || description.length > 2000 ||
      !Number.isInteger(duration) || duration < 1 || duration > 480) {
    return { ok: false, message: "Revisa la prueba base, el nombre y la duraci\u00f3n." };
  }

  const { error } = await supabase.rpc("create_assessment_draft", {
    p_source: source, p_title: title, p_description: description, p_duration: duration,
  });

  if (error) {
    return {
      ok: false,
      message: error.code === "PGRST202"
        ? "La base de datos a\u00fan requiere la migraci\u00f3n de administraci\u00f3n."
        : error.message === "EMPTY_SOURCE"
          ? "La prueba base no tiene preguntas."
          : "No fue posible guardar el borrador.",
    };
  }

  revalidatePath("/administracion");
  return { ok: true, message: `Borrador creado: ${title}.` };
}

const publicationErrors: Record<string, string> = {
  PUBLICATION_RECIPIENTS_REQUIRED: "Selecciona al menos un estudiante o profesor.",
  INVALID_PUBLICATION_RECIPIENTS: "Alguna cuenta seleccionada ya no tiene el rol requerido o está inactiva.",
  NOT_AUTHORIZED: "Tu cuenta no tiene permiso para publicar.",
  NOT_A_DRAFT: "La prueba ya no est\u00e1 en borrador.",
  ASSESSMENT_HAS_NO_QUESTIONS: "Agrega preguntas antes de publicar.",
  INVALID_QUESTIONS: "Hay preguntas sin enunciado o con menos de dos opciones.",
  ASSESSMENT_HAS_INVALID_ANSWER_KEYS: "Faltan claves de correcci\u00f3n o hay claves que no coinciden con sus opciones.",
  MISSING_QUESTION_IMAGES: "Hay preguntas con im\u00e1genes faltantes o referencias de Storage que no coinciden.",
};

export async function publishAssessment(_previous: Feedback, data: FormData): Promise<Feedback> {
  const { supabase } = await requireRole(["admin"]);
  const id = field(data, "id");
  if (!uuid.test(id)) return { ok: false, message: "La prueba solicitada no es v\u00e1lida." };
  const students = data.getAll("students");
  const teachers = data.getAll("teachers");
  if (![...students, ...teachers].every((value) => typeof value === "string" && uuid.test(value))) {
    return { ok: false, message: "La selección de usuarios no es válida." };
  }
  const { error } = await supabase.rpc("bertel_publish_for_users", {
    p_assessment: id,
    p_students: Array.from(new Set(students)),
    p_teachers: Array.from(new Set(teachers)),
  });
  if (error) return {
    ok: false,
    message: error.code === "PGRST202"
      ? "La base de datos a\u00fan requiere la migraci\u00f3n de administraci\u00f3n."
      : publicationErrors[error.message] ?? "No fue posible publicar la prueba.",
  };

  revalidatePath("/administracion");
  revalidatePath("/panel");
  revalidatePath("/simulacro");
  return { ok: true, message: "Prueba publicada para los usuarios seleccionados." };
}
