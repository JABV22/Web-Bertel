import Link from "next/link";

export default function Footer() {
  return (
    <footer className="pie">
      <div className="envoltura">
        <div className="pie__rejilla">
          <div>
            <p className="pie__marca">Preicfés Bertel</p>
            <p
              style={{
                margin: "var(--e3)",
                fontSize: "var(--t-pequeno)",
                maxWidth: "34ch",
              }}
            >
              Preparación para las pruebas Saber: estudia, practica y comprende
              tus resultados.
            </p>
          </div>
          <div>
            <h4>Programas</h4>
            <ul>
              <li>
                <a href="#programas">Saber 11</a>
              </li>
              <li>
                <a href="#programas">Refuerzo por materias</a>
              </li>
              <li>
                <a href="#programas">Instituciones</a>
              </li>
            </ul>
          </div>
          <div>
            <h4>Plataforma</h4>
            <ul>
              <li>
                <Link href="/ingreso">Ingresar</Link>
              </li>
              <li>
                <Link href="/panel">Panel del estudiante</Link>
              </li>
              <li>
                <Link href="/resultados">Resultados</Link>
              </li>
            </ul>
          </div>
          <div>
            <h4>Institucional</h4>
            <ul>
              <li>
                <a href="#nosotros">Quiénes somos</a>
              </li>
              <li>
                <a href="#resultados">Resultados</a>
              </li>
              <li>
                <a href="#contacto">Contacto</a>
              </li>
            </ul>
          </div>
        </div>

        <div className="pie__legal">
          <span>
            © <span id="anio">2026</span> Preicfés Bertel. Razón social
            pendiente de confirmar.
          </span>
          <span>Prototipo visual — contenido de demostración.</span>
        </div>
      </div>
    </footer>
  );
}
