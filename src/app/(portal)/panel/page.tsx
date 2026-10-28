import Link from "next/link";
import { EmptyHistory } from "@/components/panel/EmptyHistory";
import { PanelHeader } from "@/components/panel/PanelHeader";
import {
  PANEL_NOTICE,
  PANEL_SUMMARY,
  PANEL_TESTS,
} from "@/components/panel/mockData";
import { SummaryCards } from "@/components/panel/SummaryCards";
import { TestCard } from "@/components/panel/TestCard";
import { PANEL_STUDENT } from "@/components/panel/mockData";

export const metadata = {
  title: "Panel del estudiante",
  robots: { index: false, follow: false },
};

export default function PanelPage() {
  return (
    <>
      <PanelHeader {...PANEL_STUDENT} />
      <main id="principal" className="contenido">
      <SummaryCards items={PANEL_SUMMARY} />

      <div className="mt-6 flex gap-3 rounded-lg border border-bertel-oro-100 bg-bertel-oro-100/40 px-4 py-3 text-sm leading-6 text-[#6B4E0A]" role="note">
        <span aria-hidden="true" className="font-bold">i</span>
        <p>{PANEL_NOTICE}</p>
      </div>

      <div className="mb-5 mt-10 flex items-center justify-between gap-4">
        <h2 className="text-xl font-bold text-texto-fuerte">Pruebas disponibles</h2>
        <Link href="/simulacro" className="text-sm font-semibold text-bertel-azul hover:underline">
          Ver todas
        </Link>
      </div>

      <section className="grid gap-5 md:grid-cols-2" aria-label="Pruebas disponibles">
        {PANEL_TESTS.map((test) => <TestCard key={test.id} test={test} />)}
      </section>

      <div className="mb-5 mt-12 flex items-center justify-between">
        <h2 className="text-xl font-bold text-texto-fuerte">Historial</h2>
      </div>
      <EmptyHistory />
      </main>
    </>
  );
}
