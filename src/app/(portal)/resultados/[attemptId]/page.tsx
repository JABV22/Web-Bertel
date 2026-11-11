import Link from "next/link";
import { notFound } from "next/navigation";
import { getAttemptResult } from "@/services/assessments";

export default async function AttemptResultPage({
  params,
}: {
  params: Promise<{ attemptId: string }>;
}) {
  const { attemptId } = await params;
  const result = await getAttemptResult(attemptId);
  if (!result) notFound();

  return (
    <main id="principal" className="contenido">
      <Link
        className="mb-6 inline-block text-sm font-semibold text-bertel-azul hover:underline"
        href="/resultados"
      >
        Volver a resultados
      </Link>
      <header className="mb-8 border-b border-borde pb-5">
        <p className="text-sm text-gris-texto">
          Resultado · porcentaje de aciertos
        </p>
        <h1 className="mt-2 text-2xl font-bold text-texto-fuerte">
          {result.title}
        </h1>
        <p className="mt-3 text-3xl font-bold tabular-nums text-bertel-azul">
          {Number(result.score).toFixed(2)}%
        </p>
      </header>
      <dl className="grid gap-4 border-b border-borde pb-6 sm:grid-cols-3">
        <div>
          <dt className="text-sm text-gris-texto">Correctas</dt>
          <dd className="mt-1 text-xl font-semibold">{result.correct}</dd>
        </div>
        <div>
          <dt className="text-sm text-gris-texto">Incorrectas</dt>
          <dd className="mt-1 text-xl font-semibold">{result.incorrect}</dd>
        </div>
        <div>
          <dt className="text-sm text-gris-texto">Omitidas</dt>
          <dd className="mt-1 text-xl font-semibold">{result.unanswered}</dd>
        </div>
      </dl>
      {result.review.length > 0 && (
        <section className="mt-8" aria-labelledby="review-title">
          <h2
            id="review-title"
            className="mb-4 text-lg font-bold text-texto-fuerte"
          >
            Revisión de respuestas
          </h2>
          <ul className="divide-y divide-borde border-y border-borde">
            {result.review.map((answer, index) => (
              <li
                className="flex justify-between gap-4 py-3"
                key={answer.questionId}
              >
                <span>Pregunta {index + 1}</span>
                <span className="font-semibold">
                  {answer.isCorrect === null
                    ? "Omitida"
                    : answer.isCorrect
                      ? "Correcta"
                      : "Incorrecta"}
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
    </main>
  );
}
