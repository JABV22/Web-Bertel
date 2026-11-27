import Link from "next/link";
import { notFound } from "next/navigation";
import { QuestionImages } from "@/components/portal/QuestionImages";
import { ReviewOptions } from "@/components/portal/ReviewOptions";
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
        <p className="mt-2 text-sm text-gris-texto">Vista previa del simulacro y sus claves de corrección.</p>
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
              <ReviewOptions options={question.options} correctOptionId={question.correctOptionId} />
            </li>
          ))}
        </ol>
      )}
    </main>
  );
}
