"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAssessmentAction } from "@/app/(portal)/simulacro/actions";

type Assessment = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  status: string;
  canStart: boolean;
  questionCount: number;
};

export function AssessmentList({ assessments }: { assessments: Assessment[] }) {
  const router = useRouter();
  const [startingId, setStartingId] = useState<string | null>(null);
  const [error, setError] = useState("");

  async function startAssessment(assessmentId: string) {
    setError("");
    setStartingId(assessmentId);
    try {
      const result = await startAssessmentAction(assessmentId);
      if (!result.ok) {
        setError(result.message);
        setStartingId(null);
        return;
      }
      router.push(`/simulacro/${result.attemptId}`);
    } catch {
      setError("No fue posible conectar para iniciar la evaluación.");
      setStartingId(null);
    }
  }

  return (
    <main id="principal" className="contenido">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-texto-fuerte">Evaluaciones</h1>
        <p className="mt-2 text-sm text-gris-texto">Las pruebas publicadas pueden iniciarse; el personal también puede consultar borradores y pruebas cerradas.</p>
      </header>
      {error && <p className="mb-5 rounded-lg bg-error/10 p-4 text-sm text-error" role="alert">{error}</p>}
      {assessments.length === 0 ? (
        <p className="border-t border-borde py-8 text-sm text-gris-texto">No hay evaluaciones para mostrar.</p>
      ) : (
        <ul className="divide-y divide-borde border-y border-borde">
          {assessments.map((assessment) => (
            <li className="flex flex-wrap items-center justify-between gap-5 py-5" key={assessment.id}>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-texto-fuerte">{assessment.title}</h2>
                {assessment.description && <p className="mt-1 text-sm text-gris-texto">{assessment.description}</p>}
                <p className="mt-2 text-xs text-gris-texto">
                  {assessment.questionCount} preguntas · {assessment.durationMinutes} minutos · {assessment.status}
                </p>
              </div>
              <button
                className="btn btn--sm"
                type="button"
                disabled={
                  startingId !== null ||
                  !assessment.canStart ||
                  assessment.status !== "published" ||
                  assessment.questionCount === 0
                }
                onClick={() => void startAssessment(assessment.id)}
              >
                {startingId === assessment.id
                  ? "Iniciando…"
                  : assessment.status !== "published"
                    ? "No disponible"
                    : !assessment.canStart
                      ? "Solo lectura"
                      : assessment.questionCount === 0
                        ? "Sin preguntas"
                        : "Comenzar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}