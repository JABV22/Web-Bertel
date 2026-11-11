import Link from "next/link";
import { getAssessmentResults } from "@/services/assessments";

export const metadata = {
  title: "Resultados",
};

export default async function ResultadosPage() {
  const results = await getAssessmentResults();

  return (
    <main id="principal" className="contenido">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-texto-fuerte">Resultados</h1>
        <p className="mt-2 text-sm text-gris-texto">
          Puntajes porcentuales calculados a partir de las respuestas guardadas.
        </p>
      </header>
      {results.length === 0 ? (
        <p className="border-y border-borde py-8 text-sm text-gris-texto">
          Aún no hay resultados para mostrar.
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
                  {Number(result.score).toFixed(2)}%
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
