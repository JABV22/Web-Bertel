import Link from "next/link";
import { notFound } from "next/navigation";
import { getAssessmentResults } from "@/services/assessments";

export const metadata = {
  title: "Resultados",
};

export default async function ResultadosPage({
  searchParams,
}: {
  searchParams: Promise<{ prueba?: string | string[] }>;
}) {
  const { prueba } = await searchParams;
  const assessmentId = typeof prueba === "string" ? prueba : undefined;
  if (assessmentId && !/^[0-9a-f]{8}(?:-[0-9a-f]{4}){3}-[0-9a-f]{12}$/i.test(assessmentId)) notFound();
  const results = await getAssessmentResults({ assessmentId });

  return (
    <main id="principal" className="contenido">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-texto-fuerte">Resultados</h1>
        <p className="mt-2 text-sm text-gris-texto">
          Puntajes estimados de 0 a 500; no corresponden a resultados oficiales
          del ICFES.
        </p>
      </header>
      {results.length === 0 ? (
        <p className="border-y border-borde py-8 text-sm text-gris-texto">
          {assessmentId ? "Aún no hay intentos calificados para esta prueba." : "Aún no hay resultados para mostrar."}
        </p>
      ) : (
        <ul className="divide-y divide-borde border-y border-borde">
          {results.map((result) => (
            <li
              className="flex flex-wrap items-center justify-between gap-4 py-5"
              key={result.id}
            >
              <div>
                <h2 className="font-semibold text-texto-fuerte">
                  {result.title}
                </h2>
                <p className="mt-1 text-sm text-gris-texto">
                  {result.correct} correctas · {result.incorrect} incorrectas ·{" "}
                  {result.unanswered} omitidas
                </p>
              </div>
              <div className="flex items-center gap-5">
                <strong className="text-lg tabular-nums text-texto-fuerte">
                  {Number(result.score).toFixed(0)} / 500
                </strong>
                <Link
                  className="text-sm font-semibold text-bertel-azul hover:underline"
                  href={`/resultados/${result.attemptId}`}
                >
                  Ver detalle
                </Link>
              </div>
            </li>
          ))}
        </ul>
      )}
    </main>
  );
}
