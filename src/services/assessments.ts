import { requireRole } from "@/services/auth";

export async function getAvailableAssessments() {
  const { supabase } = await requireRole(["estudiante", "profesor", "admin"]);
  const { data, error } = await supabase
    .from("assessments")
    .select("id, title, description, duration_minutes, created_at, assessment_questions(question_id)")
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) throw new Error("No fue posible cargar las evaluaciones disponibles.");

  return (data ?? []).map((assessment) => ({
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    durationMinutes: assessment.duration_minutes,
    questionCount: new Set(
      (assessment.assessment_questions ?? []).map((item) => item.question_id),
    ).size,
  }));
}

export async function getAttempt(attemptId: string) {
  const { supabase, user, roles } = await requireRole(["estudiante", "profesor", "admin"]);
  let query = supabase
    .from("assessment_attempts")
    .select(`
      id,
      status,
      expires_at,
      assessment:assessments!inner (
        id,
        title,
        assessment_questions (
          question_id,
          question_order,
          question:questions!inner (
            id,
            statement,
            question_options (id, option_text, position)
          )
        )
      )
    `)
    .eq("id", attemptId);

  if (!roles.includes("admin")) {
    query = query.eq("student_id", user.id);
  }

  const { data, error } = await query.single();

  if (error || !data) return null;

  let savedAnswers: Array<{ question_id: string; selected_option_id: string | null }> = [];
  if (data.status === "en_progreso") {
    const { data: answerData, error: answersError } = await supabase.rpc("get_attempt_answers", {
      p_attempt_id: attemptId,
    });
    if (answersError) throw new Error("No fue posible recuperar las respuestas guardadas.");
    savedAnswers = answerData ?? [];
  }

  const assessment = data.assessment as unknown as {
    title: string;
    assessment_questions: Array<{
      question_id: string;
      question_order: number;
      question: {
        id: string;
        statement: string;
        question_options: Array<{ id: string; option_text: string; position: number }>;
      };
    }>;
  };
  const answers = new Map(
    savedAnswers.map((answer) => [answer.question_id, answer.selected_option_id]),
  );

  return {
    id: data.id,
    status: data.status,
    expiresAt: data.expires_at,
    title: assessment.title,
    questions: assessment.assessment_questions
      .toSorted((left, right) => left.question_order - right.question_order)
      .map(({ question }) => ({
        id: question.id,
        statement: question.statement,
        selectedOptionId: answers.get(question.id) ?? null,
        options: question.question_options.toSorted((left, right) => left.position - right.position),
      })),
  };
}

export async function getAssessmentResults() {
  const { supabase, user, roles } = await requireRole([
    "estudiante",
    "profesor",
    "admin",
  ]);
  let query = supabase
    .from("assessment_results")
    .select(`
      id,
      total_score,
      correct_count,
      incorrect_count,
      unanswered_count,
      computed_at,
      attempt:assessment_attempts!inner (
        id,
        student_id,
        submitted_at,
        assessment:assessments!inner (title)
      )
    `)
    .order("computed_at", { ascending: false })
    .limit(50);

  if (roles.includes("estudiante") && !roles.includes("admin") && !roles.includes("profesor")) {
    query = query.eq("attempt.student_id", user.id);
  }

  const { data, error } = await query;
  if (error) throw new Error("No fue posible cargar los resultados.");

  return (data ?? []).map((row) => {
    const attempt = row.attempt as unknown as {
      id: string;
      submitted_at: string | null;
      assessment: { title: string };
    };
    return {
      id: row.id,
      attemptId: attempt.id,
      title: attempt.assessment.title,
      score: row.total_score,
      correct: row.correct_count,
      incorrect: row.incorrect_count,
      unanswered: row.unanswered_count,
      submittedAt: attempt.submitted_at,
    };
  });
}

export async function getAttemptResult(attemptId: string) {
  const { supabase } = await requireRole(["estudiante", "profesor", "admin"]);
  const { data, error } = await supabase
    .from("assessment_attempts")
    .select(`
      id,
      student_id,
      status,
      submitted_at,
      assessment:assessments!inner (
        title
      ),
      result:assessment_results!inner (
        total_score,
        correct_count,
        incorrect_count,
        unanswered_count,
        computed_at
      )
    `)
    .eq("id", attemptId)
    .single();

  if (error || !data) return null;

  const { data: review, error: reviewError } = await supabase.rpc("get_attempt_review", {
    p_attempt_id: attemptId,
  });
  if (reviewError) throw new Error("No fue posible cargar la revisión de respuestas.");
  const reviewRows = (review ?? []) as Array<{
    question_id: string;
    is_correct: boolean | null;
  }>;

  const assessment = data.assessment as unknown as {
    title: string;
  };
  const result = data.result as unknown as {
    total_score: number;
    correct_count: number;
    incorrect_count: number;
    unanswered_count: number;
    computed_at: string;
  };

  return {
    id: data.id,
    studentId: data.student_id,
    status: data.status,
    submittedAt: data.submitted_at,
    title: assessment.title,
    score: result.total_score,
    correct: result.correct_count,
    incorrect: result.incorrect_count,
    unanswered: result.unanswered_count,
    computedAt: result.computed_at,
    review: reviewRows.map((answer) => ({
      questionId: answer.question_id,
      isCorrect: answer.is_correct,
    })),
  };
}