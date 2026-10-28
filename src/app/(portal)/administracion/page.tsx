import { AdministrationView } from "@/components/portal/AdministrationView";
import { PortalTopbar } from "@/components/portal/PortalTopbar";

export const metadata = {
  title: "Administración",
};

export default function AdministracionPage() {
  return (
    <>
      <PortalTopbar
        title="Pruebas"
        initials="AD"
        action={<button className="btn btn--sm" type="button">Nueva prueba</button>}
      />
      <AdministrationView />
    </>
  );
}
