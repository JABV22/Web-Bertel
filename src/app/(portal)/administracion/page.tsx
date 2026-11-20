import { AdministrationView } from "@/components/portal/AdministrationView";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { getAdminAssessments } from "@/services/assessments";

export const metadata = {
  title: "Administración",
};

export default async function AdministracionPage() {
  const assessments = await getAdminAssessments();

  return (
    <>
      <PortalTopbar
        title="Pruebas"
        initials="AD"
        action={
          <button className="btn btn--sm" type="button">
            Nueva prueba
          </button>
        }
      />
      <AdministrationView assessments={assessments} />
    </>
  );
}
