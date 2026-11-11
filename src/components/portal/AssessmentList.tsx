"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { startAssessmentAction } from "@/app/(portal)/simulacro/actions";

type Assessment = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
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
        <h1 className="text-2xl font-bold text-texto-fuerte">Evaluaciones disponibles</h1>
        <p className="mt-2 text-sm text-gris-texto">Selecciona una evaluación publicada para comenzar.</p>
      </header>
      {error && <p className="mb-5 rounded-lg bg-error/10 p-4 text-sm text-error" role="alert">{error}</p>}
      {assessments.length === 0 ? (
        <p className="border-t border-borde py-8 text-sm text-gris-texto">No tienes evaluaciones publicadas disponibles.</p>
      ) : (
        <ul className="divide-y divide-borde border-y border-borde">
          {assessments.map((assessment) => (
            <li className="flex flex-wrap items-center justify-between gap-5 py-5" key={assessment.id}>
              <div className="min-w-0 flex-1">
                <h2 className="font-semibold text-texto-fuerte">{assessment.title}</h2>
                {assessment.description && <p className="mt-1 text-sm text-gris-texto">{assessment.description}</p>}
                <p className="mt-2 text-xs text-gris-texto">
                  {assessment.questionCount} preguntas · {assessment.durationMinutes} minutos
                </p>
              </div>
              <button
                className="btn btn--sm"
                type="button"
                disabled={startingId !== null || assessment.questionCount === 0}
                onClick={() => void startAssessment(assessment.id)}
              >
                {startingId === assessment.id ? "Iniciando…" : "Comenzar"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}