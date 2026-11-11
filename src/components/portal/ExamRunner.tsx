"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import {
  saveAssessmentAnswerAction,
  submitAssessmentAction,
} from "@/app/(portal)/simulacro/actions";

type ExamQuestion = {
  id: string;
  statement: string;
  selectedOptionId: string | null;
  options: Array<{ id: string; option_text: string; position: number }>;
};

type ExamRunnerProps = {
  attemptId: string;
  title: string;
  expiresAt: string;
  questions: ExamQuestion[];
};

function formatTime(seconds: number | null) {
  if (seconds === null) return "--:--";
  const minutes = Math.floor(seconds / 60)
    .toString()
    .padStart(2, "0");
  const remainingSeconds = (seconds % 60).toString().padStart(2, "0");
  return `${minutes}:${remainingSeconds}`;
}

export function ExamRunner({
  attemptId,
  title,
  expiresAt,
  questions,
}: ExamRunnerProps) {
  const router = useRouter();
  const finishing = useRef(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState(
    () =>
      new Map(
        questions.map((question) => [question.id, question.selectedOptionId]),
      ),
  );
  const [remainingSeconds, setRemainingSeconds] = useState<number | null>(null);
  const [pendingQuestionId, setPendingQuestionId] = useState<string | null>(
    null,
  );
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveError, setSaveError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const currentQuestion = questions[currentIndex];

  useEffect(() => {
    const updateRemaining = () => {
      setRemainingSeconds(
        Math.max(0, Math.ceil((Date.parse(expiresAt) - Date.now()) / 1000)),
      );
    };
    updateRemaining();
    const intervalId = window.setInterval(updateRemaining, 1000);
    return () => window.clearInterval(intervalId);
  }, [expiresAt]);

  useEffect(() => {
    if (remainingSeconds !== 0 || finishing.current) return;
    finishing.current = true;
    setIsSubmitting(true);
    void submitAssessmentAction(attemptId)
      .then((result) => {
        if (result.ok) {
          router.replace(`/resultados/${attemptId}`);
        } else {
          setSubmitError(result.message);
          finishing.current = false;
          setIsSubmitting(false);
        }
      })
      .catch(() => {
        setSubmitError("No fue posible confirmar la entrega. Intenta de nuevo.");
        finishing.current = false;
        setIsSubmitting(false);
      });
  }, [attemptId, remainingSeconds, router]);

  async function saveAnswer(questionId: string, selectedOptionId: string) {
    const previousAnswer = answers.get(questionId) ?? null;
    const nextAnswers = new Map(answers);
    nextAnswers.set(questionId, selectedOptionId);
    setAnswers(nextAnswers);
    setPendingQuestionId(questionId);
    setSaveError("");

    let saveFailed = false;
    let errorMessage = "No se pudo guardar la respuesta. Intenta de nuevo.";
    try {
      const result = await saveAssessmentAnswerAction({
        attemptId,
        questionId,
        selectedOptionId,
      });
      if (!result.ok) {
        saveFailed = true;
        errorMessage = result.message;
      }
    } catch {
      saveFailed = true;
    }

    if (saveFailed) {
      const restoredAnswers = new Map(nextAnswers);
      if (previousAnswer === null) restoredAnswers.delete(questionId);
      else restoredAnswers.set(questionId, previousAnswer);
      setAnswers(restoredAnswers);
      setSaveError(errorMessage);
    }
    setPendingQuestionId(null);
  }

  async function finishAttempt() {
    if (finishing.current || pendingQuestionId) return;
    if (!window.confirm("¿Entregar definitivamente esta evaluación?")) return;
    finishing.current = true;
    setIsSubmitting(true);
    setSubmitError("");
    let result: Awaited<ReturnType<typeof submitAssessmentAction>>;
    try {
      result = await submitAssessmentAction(attemptId);
    } catch {
      finishing.current = false;
      setIsSubmitting(false);
      setSubmitError("No fue posible confirmar la entrega. Intenta de nuevo.");
      return;
    }
    if (result.ok) {
      router.replace(`/resultados/${attemptId}`);
      return;
    }
    finishing.current = false;
    setIsSubmitting(false);
    setSubmitError(result.message);
  }

  if (!currentQuestion) {
    return (
      <main className="contenido">
        <p role="alert">Esta evaluación no contiene preguntas.</p>
      </main>
    );
  }

  return (
    <main id="principal" className="contenido">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4 border-b border-borde pb-5">
        <div>
          <h1 className="text-xl font-bold text-texto-fuerte">{title}</h1>
          <p className="mt-1 text-sm text-gris-texto">
            {questions.length} preguntas
          </p>
        </div>
        <p
          className="text-lg font-semibold tabular-nums text-texto-fuerte"
          aria-live="polite"
        >
          Tiempo restante: {formatTime(remainingSeconds)}
        </p>
      </header>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_16rem]">
        <section aria-labelledby="question-title">
          <p className="mb-4 text-sm font-semibold text-bertel-azul">
            Pregunta {currentIndex + 1} de {questions.length}
          </p>
          <h2
            id="question-title"
            className="mb-6 text-lg font-semibold leading-7 text-texto-fuerte"
          >
            {currentQuestion.statement}
          </h2>
          <fieldset
            disabled={
              pendingQuestionId !== null ||
              isSubmitting ||
              remainingSeconds === 0
            }
          >
            <legend className="sr-only">Selecciona una respuesta</legend>
            <ul className="space-y-3">
              {currentQuestion.options.map((option, index) => (
                <li key={option.id}>
                  <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-borde p-4 hover:border-bertel-azul">
                    <input
                      className="mt-1 accent-bertel-azul"
                      type="radio"
                      name={`question-${currentQuestion.id}`}
                      value={option.id}
                      checked={answers.get(currentQuestion.id) === option.id}
                      onChange={() =>
                        void saveAnswer(currentQuestion.id, option.id)
                      }
                    />
                    <span className="font-semibold text-texto-fuerte">
                      {String.fromCharCode(65 + index)}.
                    </span>
                    <span className="text-sm leading-6 text-texto">
                      {option.option_text}
                    </span>
                  </label>
                </li>
              ))}
            </ul>
          </fieldset>

          <div className="mt-6 min-h-6 text-sm" aria-live="polite">
            {pendingQuestionId === currentQuestion.id && (
              <span>Guardando respuesta…</span>
            )}
            {!pendingQuestionId && answers.get(currentQuestion.id) && (
              <span>Respuesta guardada</span>
            )}
            {saveError && (
              <p className="text-error" role="alert">
                {saveError}
              </p>
            )}
          </div>

          <nav
            className="mt-6 flex justify-between gap-3"
            aria-label="Navegación de preguntas"
          >
            <button
              className="btn btn--linea"
              type="button"
              disabled={
                currentIndex === 0 || pendingQuestionId !== null || isSubmitting
              }
              onClick={() => setCurrentIndex((index) => index - 1)}
            >
              Anterior
            </button>
            {currentIndex < questions.length - 1 ? (
              <button
                className="btn"
                type="button"
                disabled={pendingQuestionId !== null || isSubmitting}
                onClick={() => setCurrentIndex((index) => index + 1)}
              >
                Siguiente
              </button>
            ) : (
              <button
                className="btn btn--acento"
                type="button"
                disabled={isSubmitting || pendingQuestionId !== null}
                onClick={() => void finishAttempt()}
              >
                {isSubmitting ? "Entregando…" : "Finalizar y entregar"}
              </button>
            )}
          </nav>
          {submitError && (
            <p className="mt-4 text-sm text-error" role="alert">
              {submitError}
            </p>
          )}
        </section>

        <aside aria-label="Navegación de preguntas">
          <h2 className="mb-3 font-semibold text-texto-fuerte">Preguntas</h2>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => (
              <button
                key={question.id}
                className={`aspect-square rounded border text-sm font-semibold ${index === currentIndex ? "border-bertel-azul bg-bertel-azul text-white" : "border-borde bg-superficie text-texto-fuerte"}`}
                type="button"
                aria-label={`Pregunta ${index + 1}${answers.get(question.id) ? ", respondida" : ", sin responder"}`}
                aria-current={index === currentIndex ? "step" : undefined}
                disabled={pendingQuestionId !== null || isSubmitting}
                onClick={() => setCurrentIndex(index)}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            className="btn btn--acento mt-6 w-full"
            type="button"
            disabled={isSubmitting || pendingQuestionId !== null}
            onClick={() => void finishAttempt()}
          >
            {isSubmitting ? "Entregando…" : "Finalizar y entregar"}
          </button>
        </aside>
      </div>
    </main>
  );
}
