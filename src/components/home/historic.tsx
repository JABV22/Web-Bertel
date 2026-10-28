export default function Historic() {
  return (
    <section
      className="seccion"
      id="resultados"
      style={{ background: "var(--superficie-alt)" }}
    >
      <div className="envoltura">
        <p className="etiqueta">Resultados</p>
        <h2>Cifras que se pueden verificar.</h2>
        <p className="guia">
          Esta sección se alimenta desde la administración de la plataforma.
          Hasta que se carguen los resultados verificados, los valores se
          muestran vacíos: no se publican cifras estimadas ni de ejemplo.
        </p>

        <div className="resultados__rejilla">
          <div className="cifra">
            <p className="cifra__valor">—</p>
            <p className="cifra__etiqueta">Estudiantes acompañados</p>
            <p className="cifra__fuente">Pendiente de dato verificado</p>
          </div>
          <div className="cifra">
            <p className="cifra__valor">—</p>
            <p className="cifra__etiqueta">Instituciones atendidas</p>
            <p className="cifra__fuente">Pendiente de dato verificado</p>
          </div>
          <div className="cifra">
            <p className="cifra__valor">—</p>
            <p className="cifra__etiqueta">Simulacros aplicados</p>
            <p className="cifra__fuente">Pendiente de dato verificado</p>
          </div>
        </div>

        <div className="grafico">
          <h3>Promedio por componente</h3>
          <p
            className="cifra__fuente"
            style={{
              marginTop: "var(--e2)",
            }}
          >
            Estructura de componentes de la prueba Saber 11. Valores pendientes
            de carga.
          </p>
          <div className="grafico__barras">
            <div className="grafico__fila">
              <span>Lectura crítica</span>
              <div className="grafico__pista">
                <div className="grafico__valor" style={{ width: "0%" }}></div>
              </div>
              <span className="grafico__num">—</span>
            </div>
            <div className="grafico__fila">
              <span>Matemáticas</span>
              <div className="grafico__pista">
                <div className="grafico__valor" style={{ width: "0%" }}></div>
              </div>
              <span className="grafico__num">—</span>
            </div>
            <div className="grafico__fila">
              <span>Sociales y ciudadanas</span>
              <div className="grafico__pista">
                <div className="grafico__valor" style={{ width: "0%" }}></div>
              </div>
              <span className="grafico__num">—</span>
            </div>
            <div className="grafico__fila">
              <span>Ciencias naturales</span>
              <div className="grafico__pista">
                <div className="grafico__valor" style={{ width: "0%" }}></div>
              </div>
              <span className="grafico__num">—</span>
            </div>
            <div className="grafico__fila">
              <span>Inglés</span>
              <div className="grafico__pista">
                <div className="grafico__valor" style={{ width: "0%" }}></div>
              </div>
              <span className="grafico__num">—</span>
            </div>
          </div>
          <p className="grafico__pie">
            Cada barra representa el valor exacto cargado, sin redondeos de
            presentación. Se mostrarán periodo, contexto y procedencia junto a
            las cifras.
          </p>
        </div>
      </div>
    </section>
  );
}
