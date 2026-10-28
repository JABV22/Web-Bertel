import Image from "next/image";
import Link from "next/link";

export default function Header() {
  return (
    <header className="cabecera">
      <div className="cabecera__fila">
        <a className="marca" href="#inicio">
          <Image src="/logo-bertel.png" alt="Preicfés Bertel" width={34} height={34} />
          <span className="marca__texto">
            Preicfés Bertel<span>Preparación Saber</span>
          </span>
        </a>

        <nav aria-label="Principal">
          <ul className="nav">
            <li>
              <a href="#programas">Programas</a>
            </li>
            <li>
              <a href="#resultados">Resultados</a>
            </li>
            <li>
              <a href="#nosotros">Nosotros</a>
            </li>
            <li>
              <a href="#contacto">Contacto</a>
            </li>{" "}
          </ul>
        </nav>
        <div className="cabecera__acciones">
          {/* <!-- Acceso al portal disponible desde el inicio y durante todo el recorrido --> */}
          <Link className="btn btn--sm" href="/ingreso">
            {" "}
            Ingresar
          </Link>
          <button
            className="menu-btn"
            type="button"
            data-menu
            aria-expanded="false"
            aria-controls="menu-movil"
            aria-label="Abrir menú"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 20 20"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M3 6h14M3 10h14M3 14h14"
                stroke="currentColor"
                strokeWidth="1.7"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>
      </div>
    </header>
  );
}
