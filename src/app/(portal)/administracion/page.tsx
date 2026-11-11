import { AdministrationView } from "@/components/portal/AdministrationView";
import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { requireRole } from "@/services/auth";

export const metadata = {
  title: "Administración",
};

export default async function AdministracionPage() {
  await requireRole(["admin"]);

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
      <AdministrationView />
    </>
  );
}
