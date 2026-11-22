import { requireRole } from "@/services/auth";

export async function getAvailableAssessments() {
  const { supabase, roles } = await requireRole([
    "estudiante",
    "profesor",
    "admin",
  ]);
  let query = supabase
    .from("assessments")
    .select("id, title, description, duration_minutes, status, created_at, assessment_questions(question_id)")
    .order("created_at", { ascending: false });

  if (!roles.includes("admin") && !roles.includes("profesor")) {
    query = query.eq("status", "published");
  }

  const { data, error } = await query;
  if (error) throw new Error("No fue posible cargar las evaluaciones disponibles.");

  return (data ?? []).map((assessment) => ({
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    durationMinutes: assessment.duration_minutes,
    status: assessment.status,
    canStart: roles.includes("admin") || roles.includes("estudiante"),
    questionCount: new Set(
      (assessment.assessment_questions ?? []).map((item) => item.question_id),
    ).size,
  }));
}

export async function getPanelAssessments() {
  const { supabase, user, roles } = await requireRole([
    "estudiante",
    "profesor",
    "admin",
  ]);

  let assessmentsQuery = supabase
    .from("assessments")
    .select(
      "id, title, description, duration_minutes, status, created_at, assessment_questions(question_id)",
    )
    .order("created_at", { ascending: false });

  if (!roles.includes("admin") && !roles.includes("profesor")) {
    assessmentsQuery = assessmentsQuery.eq("status", "published");
  }

  const { data: assessments, error: assessmentsError } = await assessmentsQuery;

  if (assessmentsError) {
    throw new Error("No fue posible cargar las evaluaciones del panel.");
  }

  const assessmentIds = (assessments ?? []).map((assessment) => assessment.id);

  const { data: attempts, error: attemptsError } =
    assessmentIds.length > 0
      ? await supabase
          .from("assessment_attempts")
          .select("id, assessment_id, status, started_at, submitted_at")
          .eq("student_id", user.id)
          .in("assessment_id", assessmentIds)
          .order("started_at", { ascending: false })
      : { data: [], error: null };

  if (attemptsError) {
    throw new Error("No fue posible cargar los intentos del estudiante.");
  }

  // Los intentos vienen del más reciente al más antiguo.
  const latestAttemptByAssessment = new Map<
    string,
    NonNullable<typeof attempts>[number]
  >();

  for (const attempt of attempts ?? []) {
    if (!latestAttemptByAssessment.has(attempt.assessment_id)) {
      latestAttemptByAssessment.set(attempt.assessment_id, attempt);
    }
  }

  return (assessments ?? []).map((assessment) => {
    const attempt = latestAttemptByAssessment.get(assessment.id) ?? null;

    return {
      id: assessment.id,
      title: assessment.title,
      description: assessment.description,
      durationMinutes: assessment.duration_minutes,
      assessmentStatus: assessment.status,
      questionCount: new Set(
        (assessment.assessment_questions ?? []).map(
          (question) => question.question_id,
        ),
      ).size,
      attemptId: attempt?.id ?? null,
      attemptStatus: attempt?.status ?? null,
      studentStatus:
        attempt?.status === "en_progreso"
          ? "in-progress"
          : attempt?.status === "enviado"
            ? "submitted"
            : attempt?.status === "clasificado"
            ? "completed"
            : "available",
    };
  });
}

export async function getAdminAssessments() {
  const { supabase } = await requireRole(["admin"]);
  const { data, error } = await supabase
    .from("assessments")
    .select(
      "id, title, description, duration_minutes, status, assessment_questions(question_id)",
    )
    .order("created_at", { ascending: false });

  if (error) throw new Error("No fue posible cargar las evaluaciones.");

  return (data ?? []).map((assessment) => ({
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    durationMinutes: assessment.duration_minutes,
    status: assessment.status,
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
  const { supabase, user, roles } = await requireRole([
    "estudiante",
    "profesor",
    "admin",
  ]);
  const loadAttempt = () =>
    supabase
      .from("assessment_attempts")
      .select(`
        id,
        student_id,
        status,
        submitted_at,
        assessment:assessments!inner (
          title
        ),
        result:assessment_results (
          total_score,
          correct_count,
          incorrect_count,
          unanswered_count,
          computed_at
        )
      `)
      .eq("id", attemptId)
      .single();

  let { data, error } = await loadAttempt();
  if (error?.code === "PGRST116") return null;
  if (error) throw new Error("No fue posible cargar el resultado.");
  if (!data) return null;

  const parseAttempt = (attemptData: typeof data) => attemptData as unknown as {
    id: string;
    student_id: string;
    status: string;
    submitted_at: string | null;
    assessment: { title: string };
    result: {
      total_score: number;
      correct_count: number;
      incorrect_count: number;
      unanswered_count: number;
      computed_at: string;
    } | null;
  };
  let attempt = parseAttempt(data);

  if (attempt.status === "enviado") {
    if (attempt.student_id === user.id || roles.includes("admin")) {
      const { error: scoringError } = await supabase.rpc(
        "submit_assessment_attempt",
        { p_attempt_id: attemptId },
      );
      if (scoringError) {
        throw new Error("No fue posible calcular el puntaje de esta entrega.");
      }

      ({ data, error } = await loadAttempt());
      if (error) throw new Error("No fue posible cargar el resultado actualizado.");
      if (!data) return null;
      attempt = parseAttempt(data);
    }

    if (attempt.status === "enviado") {
    return {
      id: attempt.id,
      status: "enviado" as const,
      submittedAt: attempt.submitted_at,
      title: attempt.assessment.title,
      score: null,
      correct: null,
      incorrect: null,
      unanswered: null,
      computedAt: null,
      review: [],
    };
    }
  }

  if (attempt.status !== "clasificado" || !attempt.result) {
    return null;
  }

  const { data: review, error: reviewError } = await supabase.rpc("get_attempt_review", {
    p_attempt_id: attemptId,
  });
  if (reviewError) throw new Error("No fue posible cargar la revisión de respuestas.");
  const reviewRows = (review ?? []) as Array<{
    question_id: string;
    is_correct: boolean | null;
  }>;

  return {
    id: attempt.id,
    studentId: attempt.student_id,
    status: "clasificado" as const,
    submittedAt: attempt.submitted_at,
    title: attempt.assessment.title,
    score: attempt.result.total_score,
    correct: attempt.result.correct_count,
    incorrect: attempt.result.incorrect_count,
    unanswered: attempt.result.unanswered_count,
    computedAt: attempt.result.computed_at,
    review: reviewRows.map((answer) => ({
      questionId: answer.question_id,
      isCorrect: answer.is_correct,
    })),
  };
}
