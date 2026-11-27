import { DraftForm, PublishForm } from "./AssessmentAdminForms";
import Link from "next/link";

type AdminAssessment = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  status: string;
  questionCount: number;
};

const statusLabels: Record<string, string> = {
  draft: "Borrador",
  published: "Publicada",
  closed: "Cerrada",
};

export function AdministrationView({
  assessments,
  sources,
  search,
  status,
}: {
  assessments: AdminAssessment[];
  sources: AdminAssessment[];
  search: string;
  status: string;
}) {
  return (
    <main className="contenido" id="principal">
      <DraftForm sources={sources} />
      <form action="/administracion" method="get" className="filtros" role="search">
        <div className="campo">
          <label htmlFor="f-buscar">Buscar</label>
          <input
            className="entrada"
            id="f-buscar"
            name="q"
            type="search"
            placeholder="Nombre de la prueba"
            defaultValue={search}
          />
        </div>
        <div className="campo">
          <label htmlFor="f-estado">Estado</label>
          <select className="entrada" id="f-estado" name="estado" defaultValue={status}>
            <option value="">Todos</option>
            {Object.entries(statusLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>
        <button className="btn btn--sm btn--linea" type="submit">Filtrar</button>
        {(search || status) && <Link href="/administracion">Limpiar filtros</Link>}
      </form>

      <div className="tabla-envoltura">
        <table className="tabla">
          <caption className="sr">Listado de pruebas</caption>
          <thead>
            <tr><th>Prueba</th><th>Preguntas</th><th>Duración</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {assessments.length === 0 ? (
              <tr><td colSpan={5}>No hay evaluaciones que mostrar.</td></tr>
            ) : assessments.map((assessment) => (
              <tr key={assessment.id}>
                <td>
                  <strong>{assessment.title}</strong>
                  {assessment.description && <p className="mt-1 text-sm text-gris-texto">{assessment.description}</p>}
                </td>
                <td>{assessment.questionCount}</td>
                <td>{assessment.durationMinutes} min</td>
                <td>
                  <span className={`pastilla ${assessment.status === "published" ? "pastilla--exito" : ""}`}>
                    {statusLabels[assessment.status] ?? assessment.status}
                  </span>
                </td>
                <td>
                  <Link className="btn btn--sm btn--linea mb-2" href={`/simulacro/revision/${assessment.id}`}>
                    Revisar simulacro
                  </Link>
                  {assessment.status === "draft" && <PublishForm assessmentId={assessment.id} />}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="paginacion"><span>{assessments.length} pruebas</span></div>
    </main>
  );
}
