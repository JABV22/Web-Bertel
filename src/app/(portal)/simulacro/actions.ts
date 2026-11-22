"use server";

import { requireRole } from "@/services/auth";

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function startAssessmentAction(assessmentId: string) {
  if (!UUID_PATTERN.test(assessmentId)) {
    return { ok: false as const, message: "La evaluación solicitada no es válida." };
  }

  const { supabase } = await requireRole(["estudiante"]);
  const { data, error } = await supabase.rpc("start_assessment", {
    p_assessment_id: assessmentId,
  });

  if (error || !data) {
    return { ok: false as const, message: "No fue posible iniciar la evaluación." };
  }

  const result = data as { attempt_id?: string };
  if (!result.attempt_id) {
    return { ok: false as const, message: "El servidor no confirmó el intento." };
  }

  return { ok: true as const, attemptId: result.attempt_id };
}

export async function saveAssessmentAnswerAction(input: {
  attemptId: string;
  questionId: string;
  selectedOptionId: string | null;
}) {
  if (
    !UUID_PATTERN.test(input.attemptId) ||
    !UUID_PATTERN.test(input.questionId) ||
    (input.selectedOptionId !== null && !UUID_PATTERN.test(input.selectedOptionId))
  ) {
    return { ok: false as const, message: "La respuesta enviada no es válida." };
  }

  const { supabase } = await requireRole(["estudiante"]);
  const { error } = await supabase.rpc("save_assessment_answer", {
    p_attempt_id: input.attemptId,
    p_question_id: input.questionId,
    p_selected_option_id: input.selectedOptionId,
  });

  if (error) {
    return { ok: false as const, message: "No se pudo guardar la respuesta. Intenta de nuevo." };
  }

  return { ok: true as const };
}

export async function submitAssessmentAction(attemptId: string) {
  if (!UUID_PATTERN.test(attemptId)) {
    return { ok: false as const, message: "El intento solicitado no es válido." };
  }

  const { supabase } = await requireRole(["estudiante"]);
  const { data, error } = await supabase.rpc("submit_assessment_attempt", {
    p_attempt_id: attemptId,
  });

  if (error || !data) {
    return { ok: false as const, message: "No fue posible confirmar la entrega." };
  }

  return { ok: true as const };
}