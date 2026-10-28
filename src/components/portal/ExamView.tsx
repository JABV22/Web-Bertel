import { DemoNotice } from "./DemoNotice";
import { DEMO_QUESTION_NUMBERS } from "./demoData";

export function ExamView() {
  return (
    <>
      <header className="examen__barra">
        <span className="examen__titulo">Simulacro Saber 11 — N.º 3</span>
        <span className="guardado guardado--ok">✓ Respuestas guardadas</span>
        <span className="reloj">◷ <span className="sr">Tiempo restante: </span>28:14</span>
      </header>
      <main className="contenido">
        <DemoNotice tone="aviso">Referencia de los estados de autoguardado que debe implementar la Fase 5: <strong>pendiente</strong>, <strong>guardando</strong>, <strong>guardado</strong> y <strong>error</strong>, cada uno distinguible sin depender del color.</DemoNotice>
        <div className="flex flex-wrap gap-5 mb-8">
          <span className="guardado guardado--pendiente">○ Cambios sin guardar</span><span className="guardado guardado--guardando">◍ Guardando…</span><span className="guardado guardado--ok">✓ Respuestas guardadas</span><span className="guardado guardado--error">✕ No se pudo guardar — reintentando</span>
        </div>
        <div className="examen">
          <section className="pregunta-larga" id="pregunta" aria-labelledby="num-pregunta">
            <p className="pregunta-larga__num" id="num-pregunta">Pregunta 12 de 50 · Lectura crítica</p>
            <p className="pregunta-larga__texto">El autor sostiene que la lectura crítica no consiste únicamente en comprender lo que un texto dice, sino en reconocer desde dónde lo dice. En el tercer párrafo introduce el caso de un editorial de prensa para mostrar cómo una misma noticia admite lecturas distintas según el énfasis que reciba cada dato.</p>
            <p className="pregunta-larga__texto font-semibold">Según el texto, ¿cuál es la intención principal del autor en el tercer párrafo?</p>
            <ul className="opciones-examen">
              {["Cuestionar la postura que había defendido en el párrafo anterior.", "Ampliar su argumento mediante un ejemplo concreto.", "Introducir una definición técnica del concepto de lectura crítica.", "Resumir la idea central desarrollada a lo largo del texto."].map((answer, index) => (
                <li key={answer}><label className="opcion-examen"><input type="radio" name="p12" value={String.fromCharCode(65 + index)} defaultChecked={index === 1} /><span>{answer}</span></label></li>
              ))}
            </ul>
            <div className="pie-examen"><button className="btn btn--linea" type="button">← Anterior</button><button className="btn btn--linea" type="button">Marcar para revisar</button><button className="btn" type="button">Siguiente →</button></div>
          </section>
          <aside className="tarjeta navegador" aria-label="Navegación por preguntas">
            <h3>Preguntas</h3><div className="rejilla-num">{DEMO_QUESTION_NUMBERS.map((number) => <a className={`num ${number <= 12 ? "num--hecha" : ""} ${number === 12 ? "num--actual" : ""}`} href="#pregunta" aria-current={number === 12 ? "true" : undefined} key={number}>{number}</a>)}</div>
            <div className="leyenda"><span><i style={{ background: "var(--bertel-azul)", borderColor: "var(--bertel-azul)" }} /> Respondida</span><span><i /> Sin responder</span><span><i style={{ outline: "2px solid var(--bertel-oro)", outlineOffset: "1px" }} /> Pregunta actual</span></div>
            <button className="btn btn--acento" type="button" style={{ width: "100%", marginTop: "var(--e5)" }}>Finalizar y entregar</button>
            <p className="ayuda" style={{ marginTop: "var(--e3)" }}>La entrega es definitiva. Una doble pulsación produce un único cierre.</p>
          </aside>
        </div>
      </main>
    </>
  );
}
