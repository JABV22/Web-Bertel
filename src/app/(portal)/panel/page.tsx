import Link from "next/link";
import { EmptyHistory } from "@/components/panel/EmptyHistory";
import { PanelHeader } from "@/components/panel/PanelHeader";
import {
  PANEL_NOTICE,
  type TestCardData,
} from "@/components/panel/mockData";
import { SummaryCards } from "@/components/panel/SummaryCards";
import { TestCard } from "@/components/panel/TestCard";
import { requireRole } from "@/services/auth";
import { getAssessmentResults, getPanelAssessments } from "@/services/assessments";

export const metadata = {
  title: "Panel del estudiante",
  robots: { index: false, follow: false },
};

export default async function PanelPage() {
  const { profile: userProfileCurret, roles } = await requireRole([
    "estudiante",
    "admin",
    "profesor",
  ]);
  let grade = "Sin curso";
  if (userProfileCurret?.courseEnrollments?.length > 0) {
    grade = userProfileCurret.courseEnrollments.reduce((acc, enrollment) => {
      return acc + " " + enrollment.courses.name;
    }, "");
  }

  const panelStudentData = {
    greeting: `Hola, ${userProfileCurret?.first_name ?? "estudiante"}`,
    grade: grade,
    initials: `${userProfileCurret?.first_name?.[0] ?? "E"}${
      userProfileCurret?.last_name?.[0] ?? "S"
    }`,
  };

  const [assessments, recentResults] = await Promise.all([
    getPanelAssessments(),
    getAssessmentResults({ ownOnly: true }),
  ]);
  const panelTests: TestCardData[] = assessments.map((assessment) => {
    const isInProgress = assessment.studentStatus === "in-progress" && assessment.accessEnabled;
    const isSubmitted = assessment.studentStatus === "submitted";
    const isCompleted = assessment.studentStatus === "completed";
    const canStart = assessment.accessEnabled && (roles.includes("admin") || roles.includes("estudiante"));
    const isUnpublished = assessment.assessmentStatus !== "published";
    const hasQuestions = assessment.questionCount > 0;
    const status: TestCardData["status"] = isInProgress
      ? "in-progress"
      : isSubmitted
        ? "submitted"
        : isCompleted
          ? "completed"
          : isUnpublished || !canStart || !hasQuestions
            ? "unavailable"
            : "available";

    return {
      id: assessment.id,
      status,
      statusLabel: isInProgress
        ? "En curso"
        : isSubmitted
          ? "Entrega recibida · nota pendiente"
          : isCompleted
            ? "Finalizada"
            : isUnpublished
              ? assessment.assessmentStatus === "draft"
                ? "Borrador"
                : "Cerrada"
              : !hasQuestions
                ? "Sin preguntas"
                : canStart ? "Disponible" : !assessment.accessEnabled ? "Acceso deshabilitado" : "Solo lectura",
      title: assessment.title,
      meta: `${assessment.questionCount} preguntas · ${assessment.durationMinutes} minutos`,
      ...(assessment.description
        ? { description: assessment.description }
        : {}),
      actionLabel: isInProgress
        ? "Continuar"
        : isSubmitted
          ? "Ver estado"
          : isCompleted
            ? "Ver resultados"
            : status === "unavailable"
              ? "No disponible"
              : "Ver prueba",
      actionHref:
        isInProgress && assessment.attemptId
          ? `/simulacro/${assessment.attemptId}`
          : (isSubmitted || isCompleted) && assessment.attemptId
            ? `/resultados/${assessment.attemptId}`
            : status === "unavailable"
              ? "#"
              : `/simulacro#prueba-${assessment.id}`,
      ...(isSubmitted || isCompleted
        ? { actionVariant: "secondary" as const }
        : {}),
    };
  });

  const availableCount = assessments.filter(
    (assessment) => assessment.assessmentStatus === "published" && assessment.accessEnabled && assessment.questionCount > 0,
  ).length;
  const lastScore = recentResults[0]?.score;
  return (
    <>
      <PanelHeader {...panelStudentData} />
      <main id="principal" className="contenido">
        <SummaryCards items={[
          { label: "Pruebas publicadas", value: String(availableCount) },
          { label: "Resultados recientes", value: String(recentResults.length) },
          { label: "Último resultado", value: lastScore == null ? "—" : `${Number(lastScore).toLocaleString("es-CO", { maximumFractionDigits: 2 })} / 500` },
        ]} />

        <div
          className="mt-6 flex gap-3 rounded-lg border border-bertel-oro-100 bg-bertel-oro-100/40 px-4 py-3 text-sm leading-6 text-[#6B4E0A]"
          role="note"
        >
          <span aria-hidden="true" className="font-bold">
            i
          </span>
          <p>{PANEL_NOTICE}</p>
        </div>

        <div className="mb-5 mt-10 flex items-center justify-between gap-4">
          <h2 className="text-xl font-bold text-texto-fuerte">Evaluaciones</h2>
          <Link
            href="/simulacro"
            className="text-sm font-semibold text-bertel-azul hover:underline"
          >
            Ver todas
          </Link>
        </div>

        <section
          className="grid gap-5 md:grid-cols-2"
          aria-label="Evaluaciones"
        >
          {panelTests.length === 0 ? (
            <p className="col-span-full border-y border-borde py-8 text-sm text-gris-texto">
              No hay evaluaciones publicadas disponibles en este momento.
            </p>
          ) : (
            panelTests.map((test) => <TestCard key={test.id} test={test} />)
          )}
        </section>

        <div className="mb-5 mt-12 flex items-center justify-between">
          <h2 className="text-xl font-bold text-texto-fuerte">Historial</h2>
        </div>
        {recentResults.length === 0 ? <EmptyHistory /> : (
          <ul className="divide-y divide-borde border-y border-borde">
            {recentResults.map((result) => (
              <li key={result.id} className="flex flex-wrap items-center justify-between gap-2 py-4">
                <Link href={`/resultados/${result.attemptId}`} className="font-semibold text-bertel-azul hover:underline">
                  {result.title}
                </Link>
                <span className="text-sm text-gris-texto">
                  {Number(result.score).toLocaleString("es-CO", { maximumFractionDigits: 2 })} / 500
                </span>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}
