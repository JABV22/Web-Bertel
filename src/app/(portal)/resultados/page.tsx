import { PortalTopbar } from "@/components/portal/PortalTopbar";
import { ResultsView } from "@/components/portal/ResultsView";

export const metadata = {
  title: "Resultados",
};

export default function ResultadosPage() {
  return (
    <>
      <PortalTopbar title="Simulacro Saber 11 — N.º 2" badge="Finalizado" />
      <ResultsView />
    </>
  );
}
