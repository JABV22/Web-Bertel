import { optionLetter } from "@/components/portal/QuestionAnswerSummary";
import { QuestionImages } from "@/components/portal/QuestionImages";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getAttemptResult } from "@/services/assessments";

export default async function AttemptResultPage({
  params,
  searchParams,
}: {
  params: Promise<{ attemptId: string }>;
  searchParams: Promise<{ preguntas?: string | string[] }>;
}) {
  const [{ attemptId }, { preguntas }] = await Promise.all([params, searchParams]);
  const result = await getAttemptResult(attemptId);
  if (!result) notFound();

  if (result.status === "enviado") {
    return (
      <main id="principal" className="contenido">
        <Link
          className="mb-6 inline-block text-sm font-semibold text-bertel-azul hover:underline"
          href="/resultados"
        >
          Volver a resultados
        </Link>
        <header className="mb-8 border-b border-borde pb-5">
          <p className="text-sm text-gris-texto">Entrega recibida</p>
          <h1 className="mt-2 text-2xl font-bold text-texto-fuerte">
            {result.title}
          </h1>
        </header>
        <p role="status" className="max-w-2xl text-sm leading-6 text-gris-texto">
          Tus respuestas quedaron registradas. El puntaje estimado de práctica
          estará disponible cuando la plataforma termine de calificar este
          intento; no es un resultado oficial del ICFES.
        </p>
        <Link
          className="btn mt-6 inline-flex"
          href="/simulacro"
        >
          Iniciar otro intento
        </Link>
      </main>
    );
  }

  const filters = [
    { value: null, label: "Todas" },
    { value: "Incorrecta", label: "Incorrectas", query: "incorrectas" },
    { value: "Omitida", label: "Omitidas", query: "omitidas" },
  ];
  const filter = result.reviewAvailable ? filters.find(({ query }) => query === preguntas)?.value ?? null : null;
  const questions = filter ? result.questions.filter((question) => question.answerStatus === filter) : result.questions;

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
          Resultado · puntaje estimado
        </p>
        <h1 className="mt-2 text-2xl font-bold text-texto-fuerte">
          {result.title}
        </h1>
        <p className="mt-3 text-3xl font-bold tabular-nums text-bertel-azul">
          {Number(result.score).toLocaleString("es-CO", { maximumFractionDigits: 2 })} / 500
        </p>
        <p className="mt-2 text-sm text-gris-texto">
          Puntaje estimado de práctica; no es un resultado oficial del ICFES.
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
      <section className="mt-8" aria-labelledby="review-title">
        <h2 id="review-title" className="mb-4 text-lg font-bold text-texto-fuerte">
          Preguntas de la prueba
        </h2>
        {!result.reviewAvailable && (
          <p role="status" className="mb-5 text-sm text-gris-texto">
            La revisión de respuestas no está disponible en este momento.
          </p>
        )}
        {result.reviewAvailable && !result.keysAvailable && (
          <p role="status" className="mb-5 text-sm text-gris-texto">
            Se muestran las respuestas registradas. Algunas claves de corrección aún no están disponibles.
          </p>
        )}
        {result.reviewAvailable && (
          <nav className="mb-5 flex flex-wrap gap-2" aria-label="Filtrar preguntas">
            {filters.map(({ value, label, query }) => (
              <Link
                key={label}
                href={query ? `?preguntas=${query}#review-title` : `/resultados/${attemptId}#review-title`}
                aria-current={value === filter ? "page" : undefined}
                className={`btn btn--sm ${value === filter ? "" : "btn--linea"}`}
              >
                {label}
              </Link>
            ))}
          </nav>
        )}
        {questions.length === 0 ? (
          <p className="text-sm text-gris-texto">
            {filter ? "No hay preguntas en este filtro." : "Las preguntas no están disponibles para este intento."}
          </p>
        ) : (
          <ol className="grid gap-5">
            {questions.map((question) => (
              <li key={question.questionId} className="rounded-xl border border-borde bg-superficie p-5 sm:p-6">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <h3 className="text-base font-bold text-texto-fuerte">Pregunta {question.order}</h3>
                  {question.answerStatus && <span className="pastilla">{question.answerStatus}</span>}
                </div>
                <p className="whitespace-pre-wrap break-words text-texto">{question.statement}</p>
                <QuestionImages assets={question.assets} />
                <ul className="mt-4 grid gap-2">
                  {question.options.map((option, index) => {
                    const selected = option.id === question.selectedOptionId;
                    const correct = option.id === question.correctOptionId;
                    return (
                      <li
                        key={option.id}
                        className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border px-3 py-2 ${correct ? "border-exito bg-exito/10" : selected ? "border-bertel-azul bg-superficie-alt" : "border-borde"}`}
                      >
                        <span className="min-w-0 whitespace-pre-wrap break-words">
                          <span className="font-bold">{optionLetter(index)}.</span>
                          {option.option_text !== optionLetter(index) && ` ${option.option_text}`}
                        </span>
                        {(selected || correct) && (
                          <span className="flex flex-wrap gap-2">
                            {selected && (
                              <span className="rounded-full bg-bertel-azul px-2 py-1 text-xs font-semibold text-white">
                                Respuesta marcada
                              </span>
                            )}
                            {correct && (
                              <span className="rounded-full bg-exito px-2 py-1 text-xs font-semibold text-white">
                                Respuesta correcta
                              </span>
                            )}
                          </span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </li>
            ))}
          </ol>
        )}
      </section>
    </main>
  );
}
