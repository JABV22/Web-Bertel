import Link from "next/link";

export default function Hero() {
  return (
    <section className="hero" id="inicio">
      <div className="envoltura hero__rejilla">
        <div className="hero__texto">
          <p className="etiqueta">Preparación Saber 11 y por materias</p>
          <h1 className="hero__titular">
            Tu próximo nivel <em>empieza aquí</em>.
          </h1>
          <p className="hero__apoyo">
            Prepárate, practica y comprende tus resultados con Bertel.
          </p>
          <div className="hero__acciones">
            <a className="btn btn--acento" href="#programas">
              Conocer los programas
            </a>
            <Link className="btn btn--linea" href="/ingreso">
              Ingresar como estudiante
            </Link>
          </div>
          <p className="hero__nota">
            <svg
              width="15"
              height="15"
              viewBox="0 0 16 16"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M8 1.5 2.5 4v3.6c0 3.4 2.3 6.5 5.5 7.4 3.2-.9 5.5-4 5.5-7.4V4L8 1.5Z"
                stroke="currentColor"
                strokeWidth="1.3"
                strokeLinejoin="round"
              />
            </svg>
            Simulacros dentro de la plataforma, con resultados explicables.
          </p>
        </div>

        {/* <!-- Escenario 3D: paneles de interfaz suspendidos --> */}
        <div className="hero__escena" data-hero-escena>
          <div className="respaldo" aria-hidden="true">
            <span className="respaldo__texto">Vista de la plataforma</span>
          </div>

          <div
            className="hero__pila"
            role="img"
            aria-label="Representación de la plataforma Bertel: paneles de progreso, de pregunta y de resultados suspendidos en perspectiva."
          >
            {/* <!-- Panel: progreso --> */}
            <article
              className="panel panel--a"
              data-profundidad="1.4"
              aria-hidden="true"
            >
              <div className="panel__barra">
                <i className="panel__punto"></i>
                <span className="panel__titulo">Progreso</span>
              </div>
              <div className="panel__cuerpo">
                <div className="progreso__fila">
                  <span className="progreso__cifra">—</span>
                  <span className="pastilla">Demostración</span>
                </div>
                <div className="barra">
                  <div className="barra__valor" style={{ width: "62%" }}></div>
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

            {/* <!-- Panel: pregunta --> */}
            <article
              className="panel panel--b"
              data-profundidad="1"
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
                  Según el texto, ¿cuál es la intención principal del autor en
                  el tercer párrafo?
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
                </ul>
              </div>
            </article>

            {/* <!-- Panel: resultado --> */}
            <article
              className="panel panel--c"
              data-profundidad=".7"
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
                      style={{ display: "block", color: "var(--texto-fuerte)" }}
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
                  <span className="pastilla pastilla--exito">Aciertos —</span>
                  <span className="pastilla pastilla--error">Errores —</span>
                  <span className="pastilla">Omitidas —</span>
                </div>
              </div>
            </article>
          </div>
        </div>
      </div>
    </section>
  );
}
