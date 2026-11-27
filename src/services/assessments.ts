import { requireRole } from "@/services/auth";

async function getEnabledAssessments(supabase: Awaited<ReturnType<typeof requireRole>>["supabase"]) {
  const { data, error } = await supabase.rpc("bertel_available_assessments");
  if (error?.code === "PGRST202") return null;
  if (error) throw new Error("No fue posible verificar el acceso a las evaluaciones.");
  return new Set<string>((data ?? []).map((row: { id: string }) => row.id));
}

async function getTeacherPreviewPermissions(supabase: Awaited<ReturnType<typeof requireRole>>["supabase"]) {
  const { data, error } = await supabase.rpc("bertel_teacher_preview_permissions");
  if (error && error.code !== "PGRST202") throw new Error("No fue posible verificar el permiso de revisión.");
  return new Set<string>((data ?? []).map((row: { id: string }) => row.id));
}

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

  const [{ data, error }, enabled, reviewPermissions] = await Promise.all([
    query,
    getEnabledAssessments(supabase),
    roles.includes("profesor") && !roles.includes("admin") ? getTeacherPreviewPermissions(supabase) : null,
  ]);
  if (error) throw new Error("No fue posible cargar las evaluaciones disponibles.");

  const admin = roles.includes("admin");
  const student = roles.includes("estudiante");
  return (data ?? [])
    .filter((assessment) => admin || reviewPermissions?.has(assessment.id) ||
      (student && (enabled === null || enabled.has(assessment.id))))
    .map((assessment) => ({
    id: assessment.id,
    title: assessment.title,
    description: assessment.description,
    durationMinutes: assessment.duration_minutes,
    status: assessment.status,
    canReview: roles.includes("admin") || (roles.includes("profesor") && reviewPermissions?.has(assessment.id) === true),
    canStart: (roles.includes("admin") || roles.includes("estudiante")) &&
      (enabled === null || enabled.has(assessment.id)),
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

  const [{ data: assessments, error: assessmentsError }, enabled] = await Promise.all([
    assessmentsQuery,
    getEnabledAssessments(supabase),
  ]);

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
      accessEnabled: enabled === null || enabled.has(assessment.id),
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


type QuestionAsset = { id: string; asset_url: string; alt_text: string };

async function loadQuestionImages(
  supabase: Awaited<ReturnType<typeof requireRole>>["supabase"],
  assets: QuestionAsset[],
) {
  const storageOrigin = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const prefix = "/storage/v1/object/authenticated/";

  return Promise.all(assets.map(async (asset) => {
    const url = URL.canParse(asset.asset_url) ? new URL(asset.asset_url) : null;
    if (!url || url.protocol !== "https:") return { ...asset, asset_url: "" };
    if (!url.pathname.startsWith(prefix)) return asset;
    if (!storageOrigin || url.origin !== new URL(storageOrigin).origin) {
      return { ...asset, asset_url: "" };
    }

    const [bucket, ...segments] = url.pathname.slice(prefix.length).split("/");
    const path = segments.map(decodeURIComponent).join("/");
    const { data, error } = await supabase.storage.from(decodeURIComponent(bucket)).createSignedUrl(path, 3600);
    if (data?.signedUrl) return { ...asset, asset_url: data.signedUrl };

    if (error) console.warn("question image:", error.message);
    return { ...asset, asset_url: "" };
  }));
}


const questionContent = `
  id, statement,
  question_options (id, option_text, position),
  question_assets (id, asset_url, alt_text)
`;

export async function getAssessmentForReview(assessmentId: string) {
  const { supabase, roles } = await requireRole(["profesor", "admin"]);
  if (!/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(assessmentId)) return null;

  if (!roles.includes("admin") && !(await getTeacherPreviewPermissions(supabase)).has(assessmentId)) return null;

  const { data, error } = await supabase
    .from("assessments")
    .select(`id, title, assessment_questions (question_order, question:questions (${questionContent}))`)
    .eq("id", assessmentId)
    .maybeSingle();

  if (error) throw new Error("No fue posible cargar la prueba para revisar.");
  if (!data) return null;

  const { data: keyRows, error: keysError } = await supabase.rpc("bertel_preview_answer_keys", {
    p_assessment: assessmentId,
  });
  if (keysError?.code === "42501") return null;
  if (keysError && keysError.code !== "PGRST202") throw new Error("No fue posible cargar las claves de la prueba.");
  const keys = new Map<string, string>(
    (keyRows ?? []).map((row: { question_id: string; correct_option_id: string }) => [row.question_id, row.correct_option_id]),
  );

  const rows = (data.assessment_questions ?? []) as unknown as Array<{
    question_order: number;
    question: {
      id: string;
      statement: string;
      question_options: Array<{ id: string; option_text: string; position: number }>;
      question_assets: QuestionAsset[];
    } | null;
  }>;
  const questions = await Promise.all(rows
    .toSorted((a, b) => a.question_order - b.question_order)
    .map(async ({ question, question_order }) => {
      if (!question) return null;

      return {
        id: question.id,
        order: question_order,
        statement: question.statement,
        correctOptionId: keys.get(question.id) ?? null,
        assets: await loadQuestionImages(supabase, question.question_assets ?? []),
        options: (question.question_options ?? []).toSorted((a, b) => a.position - b.position),
      };
    }));
  return { id: data.id, title: data.title, questions: questions.filter((question) => question !== null) };
}

function loadSavedAnswers(supabase: Awaited<ReturnType<typeof requireRole>>["supabase"], attemptId: string) {
  return supabase.from("student_answers")
    .select("question_id, selected_option_id, is_correct")
    .eq("attempt_id", attemptId)
    .order("answered_at", { ascending: false, nullsFirst: false })
    .order("id", { ascending: false });
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
          question:questions!inner (${questionContent})
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
    const assessment = data.assessment as unknown as { id: string };
    const { data: allowed, error: accessError } = await supabase.rpc("bertel_can_access_assessment", {
      p_assessment: assessment.id,
    });
    if (accessError && accessError.code !== "PGRST202") {
      throw new Error("No fue posible verificar el acceso al simulacro.");
    }
    if (!accessError && allowed !== true) return null;
    const { data: answerData, error: answersError } = await supabase.rpc("get_attempt_answers", {
      p_attempt_id: attemptId,
    });
    if (answersError?.code === "PGRST202") {
      const saved = await loadSavedAnswers(supabase, attemptId);
      if (saved.error) throw new Error("No fue posible recuperar las respuestas guardadas.");
      const latestByQuestion = new Map<string, (typeof saved.data)[number]>();
      for (const row of saved.data) {
        if (!latestByQuestion.has(row.question_id)) latestByQuestion.set(row.question_id, row);
      }
      savedAnswers = Array.from(latestByQuestion.values());
    } else {
      if (answersError) throw new Error("No fue posible recuperar las respuestas guardadas.");
      savedAnswers = answerData ?? [];
    }
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
        question_assets: QuestionAsset[];
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
    questions: await Promise.all(assessment.assessment_questions
      .toSorted((left, right) => left.question_order - right.question_order)
      .map(async ({ question }) => ({
        id: question.id,
        statement: question.statement,
        assets: await loadQuestionImages(supabase, question.question_assets),
        selectedOptionId: answers.get(question.id) ?? null,
        options: question.question_options.toSorted((left, right) => left.position - right.position),
      }))),
  };
}

export async function getAssessmentResults({ ownOnly = false, assessmentId }: { ownOnly?: boolean; assessmentId?: string } = {}) {
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

  if (ownOnly || (!roles.includes("admin") && !roles.includes("profesor"))) {
    query = query.eq("attempt.student_id", user.id);
  }

  if (assessmentId) query = query.eq("attempt.assessment_id", assessmentId);

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
          title,
          assessment_questions (
            question_order,
            question:questions (
              id,
              statement,
              question_options (id, option_text, position),
              question_assets (id, asset_url, alt_text)
            )
          )
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
  if (error?.code === "PGRST116" || error?.code === "22P02") return null;
  if (error) throw new Error("No fue posible cargar el resultado.");
  if (!data) return null;

  const parseAttempt = (attemptData: typeof data) => attemptData as unknown as {
    id: string;
    student_id: string;
    status: string;
    submitted_at: string | null;
    assessment: {
      title: string;
      assessment_questions: Array<{
        question_order: number;
        question: {
          id: string;
          statement: string;
          question_options: Array<{ id: string; option_text: string; position: number }>;
          question_assets: QuestionAsset[];
        } | null;
      }>;
    };
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
    };
    }
  }

  if (attempt.status !== "clasificado" || !attempt.result) {
    return null;
  }

  type ReviewRow = {
    question_id: string;
    selected_option_id: string | null;
    correct_option_id?: string | null;
    is_correct: boolean | null;
  };
  const review = await supabase.rpc("get_graded_attempt_review", {
    p_attempt_id: attemptId,
  });
  let reviewRows: ReviewRow[] = review.data ?? [];
  let selectionsAvailable = !review.error;
  const isOwnerOrAdmin = attempt.student_id === user.id || roles.includes("admin");

  if (review.error) {
    console.warn("get_graded_attempt_review failed:", review.error.code);
    if (review.error.code === "PGRST202") {
      const legacy = await supabase.rpc("get_attempt_review", { p_attempt_id: attemptId });
      reviewRows = legacy.data ?? [];
      selectionsAvailable = !legacy.error;
    }
    if (!selectionsAvailable && isOwnerOrAdmin) {
      const saved = await loadSavedAnswers(supabase, attemptId);
      reviewRows = saved.data ?? [];
      selectionsAvailable = !saved.error;
    }
  }

  const answersByQuestion = new Map<string, ReviewRow>();
  for (const answer of reviewRows) {
    if (!answersByQuestion.has(answer.question_id)) answersByQuestion.set(answer.question_id, answer);
  }
  const reviewAvailable = selectionsAvailable;
  const questions = (await Promise.all(attempt.assessment.assessment_questions
    .toSorted((left, right) => left.question_order - right.question_order)
    .map(async ({ question, question_order }) => {
      if (!question) return [];
      const answer = answersByQuestion.get(question.id);
      const selectedOptionId = answer?.selected_option_id ?? null;
      const correctOptionId = answer?.correct_option_id ?? null;
      const isCorrect = correctOptionId && selectedOptionId
        ? selectedOptionId === correctOptionId
        : answer?.is_correct ?? null;
      return [{
        questionId: question.id,
        order: question_order,
        statement: question.statement,
        assets: await loadQuestionImages(supabase, question.question_assets),
        options: question.question_options.toSorted((left, right) => left.position - right.position),
        selectedOptionId,
        correctOptionId,
        answerStatus: !selectedOptionId
          ? (selectionsAvailable ? "Omitida" : null)
          : isCorrect === null
            ? "Sin calificación"
            : isCorrect ? "Correcta" : "Incorrecta",
      }];
    }))).flat();

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
    reviewAvailable,
    keysAvailable: questions.length > 0 && questions.every((question) =>
      question.options.some(({ id }) => id === question.correctOptionId)),
    questions,
  };
}
