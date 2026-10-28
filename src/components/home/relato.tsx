export default function Relato() {
  return (
    <section className="relato" data-relato aria-labelledby="relato-titulo">
      <h2 id="relato-titulo" className="sr">
        Cómo funciona la experiencia Bertel
      </h2>

      <div className="relato__pista" data-pista>
        <div className="relato__escenario">
          <div className="relato__rejilla">
            <div className="relato__mensajes tema-oscuro">
              <article className="paso" data-paso data-activo="true">
                <p className="paso__indice">01 — Descubrir</p>
                <h2>Prepárate con un propósito.</h2>
                <p>
                  Un plan claro, con materias, tiempos y metas que se entienden
                  desde el primer día.
                </p>
              </article>

              <article className="paso" data-paso data-activo="false">
                <p className="paso__indice">02 — Practicar</p>
                <h2>Pon a prueba lo que sabes.</h2>
                <p>
                  Simulacros resueltos dentro de la plataforma, con el formato y
                  el ritmo de la prueba real.
                </p>
              </article>

              <article className="paso" data-paso data-activo="false">
                <p className="paso__indice">03 — Comprender</p>
                <h2>Comprende tus aciertos y errores.</h2>
                <p>
                  Cada resultado se explica: qué respondiste, qué falló y en qué
                  componente conviene insistir.
                </p>
              </article>

              <article className="paso" data-paso data-activo="false">
                <p className="paso__indice">04 — Avanzar</p>
                <h2>Da el siguiente paso con Bertel.</h2>
                <p>
                  El progreso queda registrado y guía la siguiente etapa de
                  preparación.
                </p>
              </article>

              <ul className="relato__pasos" aria-hidden="true">
                <li>
                  <i data-medidor></i>
                </li>
                <li>
                  <i data-medidor></i>
                </li>
                <li>
                  <i data-medidor></i>
                </li>
                <li>
                  <i data-medidor></i>
                </li>
              </ul>
            </div>

            <div className="relato__vista">
              <span className="halo" aria-hidden="true"></span>
              <div
                className="relato__pila"
                role="img"
                aria-label="La plataforma se aproxima, los paneles se separan para destacar una pregunta, la vista evoluciona hacia el resultado y finalmente la composición se estabiliza."
              >
                <article
                  className="panel"
                  data-panel="progreso"
                  aria-hidden="true"
                >
                  <div className="panel__barra">
                    <i className="panel__punto"></i>
                    <span className="panel__titulo">Mi progreso</span>
                  </div>
                  <div className="panel__cuerpo">
                    <div className="progreso__fila">
                      <span className="progreso__cifra">—</span>
                      <span className="pastilla">Demostración</span>
                    </div>
                    <div className="barra">
                      <div
                        className="barra__valor"
                        style={{ width: "62%" }}
                      ></div>
                    </div>
                    <ul className="lista-materias">
                      <li>
                        <div>
                          <span>Lectura crítica</span>
                          <span>—</span>
                        </div>
                        <div className="barra">
                          <div
                            className="barra__valor"
                            style={{ width: "74%" }}
                          ></div>
                        </div>
                      </li>
                      <li>
                        <div>
                          <span>Matemáticas</span>
                          <span>—</span>
                        </div>
                        <div className="barra">
                          <div
                            className="barra__valor"
                            style={{ width: "58%" }}
                          ></div>
                        </div>
                      </li>
                      <li>
                        <div>
                          <span>Sociales</span>
                          <span>—</span>
                        </div>
                        <div className="barra">
                          <div
                            className="barra__valor"
                            style={{ width: "66%" }}
                          ></div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </article>

                <article
                  className="panel"
                  data-panel="pregunta"
                  aria-hidden="true"
                >
                  <div className="panel__barra">
                    <i className="panel__punto"></i>
                    <span className="panel__titulo">Simulacro</span>
                  </div>
                  <div className="panel__cuerpo">
                    <div className="pregunta__meta">
                      <span className="pastilla">Pregunta 12 de 50</span>
                      <span className="pastilla pastilla--acento">28:14</span>
                    </div>
                    <p className="pregunta__enunciado">
                      Según el texto, ¿cuál es la intención principal del autor
                      en el tercer párrafo?
                    </p>
                    <ul className="opciones">
                      <li className="opcion">
                        <span className="opcion__letra">A</span> Cuestionar una
                        postura previa.
                      </li>
                      <li className="opcion opcion--elegida">
                        <span className="opcion__letra">B</span> Ampliar el
                        argumento con un ejemplo.
                      </li>
                      <li className="opcion">
                        <span className="opcion__letra">C</span> Introducir una
                        definición técnica.
                      </li>
                      <li className="opcion">
                        <span className="opcion__letra">D</span> Resumir la idea
                        del texto.
                      </li>
                    </ul>
                  </div>
                </article>

                <article
                  className="panel"
                  data-panel="resultado"
                  aria-hidden="true"
                >
                  <div className="panel__barra">
                    <i className="panel__punto"></i>
                    <span className="panel__titulo">Resultado</span>
                  </div>
                  <div className="panel__cuerpo">
                    <div className="resultado__cabeza">
                      <div
                        className="aro"
                        style={{ "--v": 72 } as React.CSSProperties}
                      >
                        <span>—</span>
                      </div>
                      <div>
                        <strong
                          style={{
                            display: "block",
                            color: "var(--texto-fuerte)",
                          }}
                        >
                          Simulacro finalizado
                        </strong>
                        <span
                          style={{
                            fontSize: "var(--t-micro)",
                            color: "var(--texto-suave)",
                          }}
                        >
                          Revisión disponible
                        </span>
                      </div>
                    </div>
                    <div className="marcador">
                      <span className="pastilla pastilla--exito">
                        Aciertos —
                      </span>
                      <span className="pastilla pastilla--error">
                        Errores —
                      </span>
                      <span className="pastilla">Omitidas —</span>
                    </div>
                    <ul className="lista-materias">
                      <li>
                        <div>
                          <span>Lectura crítica</span>
                          <span>—</span>
                        </div>
                        <div className="barra">
                          <div
                            className="barra__valor"
                            style={{ width: "74%" }}
                          ></div>
                        </div>
                      </li>
                      <li>
                        <div>
                          <span>Matemáticas</span>
                          <span>—</span>
                        </div>
                        <div className="barra">
                          <div
                            className="barra__valor"
                            style={{ width: "58%" }}
                          ></div>
                        </div>
                      </li>
                    </ul>
                  </div>
                </article>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
