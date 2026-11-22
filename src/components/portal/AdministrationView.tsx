import { DemoNotice } from "./DemoNotice";
import { DEMO_CONTENT } from "./demoData";

type AdminAssessment = {
  id: string;
  title: string;
  description: string | null;
  durationMinutes: number;
  status: string;
  questionCount: number;
};

export function AdministrationView({
  assessments,
}: {
  assessments: AdminAssessment[];
}) {
  return (
    <main className="contenido" id="principal">
      <DemoNotice tone="aviso">Una prueba sin preguntas calificables no debe poder publicarse, y editar una pregunta no puede alterar intentos ya iniciados. Ambas reglas se implementan en la Fase 4.</DemoNotice>
      <form className="filtros" role="search"><div className="campo"><label htmlFor="f-buscar">Buscar</label><input className="entrada" id="f-buscar" type="search" placeholder="Nombre de la prueba" /></div><div className="campo"><label htmlFor="f-estado">Estado</label><select className="entrada" id="f-estado"><option>Todos</option><option>Borrador</option><option>Publicada</option><option>Cerrada</option></select></div><div className="campo"><label htmlFor="f-tipo">Tipo</label><select className="entrada" id="f-tipo"><option>Todos</option><option>Saber 11</option><option>Por materia</option></select></div><button className="btn btn--sm btn--linea" type="submit">Filtrar</button></form>
      <div className="tabla-envoltura"><table className="tabla"><caption className="sr">Listado de pruebas</caption><thead><tr><th>Prueba</th><th>Preguntas</th><th>Duración</th><th>Estado</th></tr></thead><tbody>{assessments.length === 0 ? <tr><td colSpan={4}>No hay evaluaciones registradas.</td></tr> : assessments.map((assessment) => <tr key={assessment.id}><td><strong>{assessment.title}</strong>{assessment.description && <p className="mt-1 text-sm text-gris-texto">{assessment.description}</p>}</td><td>{assessment.questionCount}</td><td>{assessment.durationMinutes} min</td><td><span className={`pastilla ${assessment.status === "published" ? "pastilla--exito" : ""}`}>{assessment.status}</span></td></tr>)}</tbody></table></div>
      <div className="paginacion"><span>{assessments.length} pruebas</span></div>
      <div className="titulo-bloque" style={{ marginTop: "var(--e8)" }}><h2>Contenidos del sitio público</h2><span className="pastilla">Se publican sin desplegar código</span></div>
      <div className="tabla-envoltura"><table className="tabla"><caption className="sr">Contenidos editables del sitio público</caption><thead><tr><th>Contenido</th><th>Sección</th><th>Estado</th><th>Actualizado</th><th><span className="sr">Acciones</span></th></tr></thead><tbody>{DEMO_CONTENT.map((content) => <tr key={content.name}><td><strong>{content.name}</strong></td><td>{content.section}</td><td><span className="pastilla">{content.status}</span></td><td>—</td><td><div className="acciones"><button className="btn btn--sm btn--linea" type="button">Editar</button></div></td></tr>)}</tbody></table></div>
    </main>
  );
}
