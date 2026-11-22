import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionImages } from "@/components/portal/QuestionImages";
import { optionLetter } from "@/components/portal/QuestionAnswerSummary";
import { getAssessmentForReview } from "@/services/assessments";

export const metadata = { title: "Revisar prueba" };

export default async function AssessmentReviewPage({
  params,
}: {
  params: Promise<{ assessmentId: string }>;
}) {
  const { assessmentId } = await params;
  const assessment = await getAssessmentForReview(assessmentId);
  if (!assessment) notFound();

  return (
    <main id="principal" className="contenido">
      <Link className="text-sm font-semibold text-bertel-azul hover:underline" href={`/simulacro#prueba-${assessment.id}`}>
        Volver a Mis pruebas
      </Link>
      <header className="my-6 border-b border-borde pb-5">
        <p className="text-sm text-gris-texto">Revisión de la prueba</p>
        <h1>{assessment.title}</h1>
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
              <p className="whitespace-pre-wrap break-words">{question.statement}</p>
              <QuestionImages assets={question.assets} />
              <ul className="mt-4 grid gap-2">
                {question.options.map((option, index) => (
                  <li key={option.id} className="rounded-lg border border-borde px-3 py-2">
                    <strong>{optionLetter(index)}.</strong>
                    {option.option_text !== optionLetter(index) && ` ${option.option_text}`}
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
