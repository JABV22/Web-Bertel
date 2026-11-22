import { AdministrationView } from "@/components/portal/AdministrationView";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { getAdminAssessments } from "@/services/assessments";

export const metadata = {
  title: "Administración",
};

export default async function AdministracionPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string | string[]; estado?: string | string[] }>;
}) {
  const [assessments, filters] = await Promise.all([getAdminAssessments(), searchParams]);
  const search = typeof filters.q === "string" ? filters.q.trim() : "";
  const status = typeof filters.estado === "string" && ["draft", "published", "closed"].includes(filters.estado)
    ? filters.estado
    : "";
  const normalize = (value: string) => value.toLocaleLowerCase("es").normalize("NFD").replace(/\p{Diacritic}/gu, "");
  const filtered = assessments.filter((assessment) =>
    (!status || assessment.status === status) &&
    (!search || normalize(assessment.title).includes(normalize(search)))
  );

  return (
    <>
      <PortalTopbar title="Pruebas" initials="AD" />
      <AdministrationView assessments={filtered} sources={assessments.filter((item) => item.questionCount > 0)} search={search} status={status} />
    </>
  );
}
