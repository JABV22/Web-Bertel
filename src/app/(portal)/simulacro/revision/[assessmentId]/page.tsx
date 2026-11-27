import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionImages } from "@/components/portal/QuestionImages";
import { optionLetter } from "@/components/portal/QuestionAnswerSummary";
import { ReviewOptions } from "@/components/portal/ReviewOptions";
import { getControlledAssessmentReview } from "@/services/controlled-assessment-review";
import { isControlledAssessment } from "@/services/controlled-assessments";
import { getAssessmentForReview } from "@/services/assessments";

export const metadata = { title: "Revisar prueba" };

export default async function AssessmentReviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ assessmentId: string }>;
  searchParams: Promise<{ pagina?: string; vista?: string }>;
}) {
  const { assessmentId } = await params;
  const { pagina, vista } = await searchParams;
  const requested = Number(pagina ?? 1);
  const detail = isControlledAssessment(assessmentId)
    ? await getControlledAssessmentReview(assessmentId, Number.isSafeInteger(requested) ? requested : 1)
    : null;
  const assessment = detail ?? await getAssessmentForReview(assessmentId);
  if (!assessment) notFound();
  const showKeys = detail !== null && vista === "respuestas";
  const correct = new Map(assessment.questions.map((question) => [question.id, question.correctOptionId]));
  const sections = new Map(detail?.questions.map((question) => [question.id, question.section]));
  const reviewUrl = (page: number, keys: boolean) => `/simulacro/revision/${assessment.id}?pagina=${page}${keys ? "&vista=respuestas" : ""}`;

  return (
    <main id="principal" className="contenido">
      <Link className="text-sm font-semibold text-bertel-azul hover:underline" href={detail ? "/administracion" : `/simulacro#prueba-${assessment.id}`}>
        {detail ? "Volver a Administración" : "Volver a Mis pruebas"}
      </Link>
      <header className="my-6 border-b border-borde pb-5">
        <p className="text-sm text-gris-texto">Revisión de la prueba</p>
        <h1>{assessment.title}</h1>
        {detail && <Link prefetch={false} className="btn btn--sm btn--linea mt-4" href={reviewUrl(detail.page, !showKeys)}>
          {showKeys ? "Ver preguntas" : "Revisar respuestas correctas"}
        </Link>}
        <Link className="btn btn--sm btn--linea mt-4" href={`/resultados?prueba=${assessment.id}`}>
          Ver intentos calificados
        </Link>
      </header>
      {assessment.questions.length === 0 ? (
        <p className="text-sm text-gris-texto">Esta prueba no tiene preguntas disponibles.</p>
      ) : (
        <ol className="grid gap-5">
          {assessment.questions.map((question) => (
            <li key={question.id} className="rounded-xl border border-borde bg-superficie p-5 sm:p-6">
              <h2 className="mb-3 text-lg font-bold">Pregunta {question.order}</h2>
              {sections.get(question.id) && <p className="text-sm text-gris-texto">{sections.get(question.id)}</p>}
              <p className="whitespace-pre-wrap break-words">{question.statement}</p>
              <QuestionImages assets={question.assets} />
              {!detail || showKeys ? (
                <ReviewOptions options={question.options} correctOptionId={correct.get(question.id) ?? null} />
              ) : <ul className="mt-4 grid gap-2">
                {question.options.map((option, index) => (
                  <li key={option.id} className="rounded-lg border border-borde px-3 py-2">
                    <strong>{optionLetter(index)}.</strong>
                    {option.option_text !== optionLetter(index) && ` ${option.option_text}`}
                  </li>
                ))}
              </ul>}
            </li>
          ))}
        </ol>
      )}
      {detail && detail.pageCount > 1 && (
        <nav aria-label="Páginas de preguntas" className="mt-5 flex items-center gap-4">
          {detail.page > 1 && <Link prefetch={false} href={reviewUrl(detail.page - 1, showKeys)}>Anterior</Link>}
          <span>Página {detail.page} de {detail.pageCount}</span>
          {detail.page < detail.pageCount && <Link prefetch={false} href={reviewUrl(detail.page + 1, showKeys)}>Siguiente</Link>}
        </nav>
      )}
    </main>
  );
}
