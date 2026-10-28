import { DemoNotice } from "./DemoNotice";
import { DEMO_COMPONENTS, DEMO_QUESTIONS } from "./demoData";

export function ResultsView() {
  return (
    <main className="contenido" id="principal">
      <section className="resultado-cabeza">
        <div className="aro-grande" style={{ "--v": 0 } as React.CSSProperties} role="img" aria-label="Puntuación pendiente de cálculo">
          <div><strong>—</strong><span>Puntuación</span></div>
        </div>
        <div>
          <h2 className="text-h3 mb-2">Tu resultado</h2>
          <p className="text-sm text-gris-texto">
            El desglose muestra aciertos, errores y omisiones de forma que puedan explicarse y verificarse frente a las respuestas guardadas.
          </p>
          <div className="desglose">
            <span className="pastilla pastilla--exito">Aciertos —</span>
            <span className="pastilla pastilla--error">Errores —</span>
            <span className="pastilla">Omitidas —</span>
          </div>
        </div>
      </section>

      <DemoNotice>
        No se muestra ninguna escala 0–500 ni se presenta el resultado como puntaje ICFES oficial. Cualquier escala interna requiere definición y metodología autorizadas.
      </DemoNotice>

      <div className="titulo-bloque" style={{ marginTop: "var(--e7)" }}><h2>Por componente</h2></div>
      <div className="grafico" style={{ marginTop: 0 }}>
        <div className="grafico__barras">
          {DEMO_COMPONENTS.map((component) => (
            <div className="grafico__fila" key={component}>
              <span>{component}</span><div className="grafico__pista"><div className="grafico__valor" style={{ width: "0%" }} /></div><span className="grafico__num">—</span>
            </div>
          ))}
        </div>
        <p className="grafico__pie">La anchura de cada barra corresponde al valor exacto calculado por el servidor.</p>
      </div>

      <div className="titulo-bloque" style={{ marginTop: "var(--e8)" }}>
        <h2>Revisión pregunta a pregunta</h2><span className="pastilla">Se libera según la política del producto</span>
      </div>
      <div className="tabla-envoltura">
        <table className="tabla-resultado">
          <caption className="sr">Detalle de respuestas del intento</caption>
          <thead><tr><th>N.º</th><th>Componente</th><th>Tu respuesta</th><th>Estado</th></tr></thead>
          <tbody>
            {DEMO_QUESTIONS.map((question) => (
              <tr key={question.number}><td>{question.number}</td><td>{question.component}</td><td>{question.answer}</td><td><span className={`pastilla ${question.kind === "success" ? "pastilla--exito" : question.kind === "error" ? "pastilla--error" : ""}`}>{question.status}</span></td></tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="ayuda" style={{ marginTop: "var(--e4)" }}>La clave de respuesta correcta sólo se entrega al cliente en el momento de revisión autorizado.</p>
    </main>
  );
}
