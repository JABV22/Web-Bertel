"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import logo from "@/prototipo/assets/logo-bertel.png";

const enlaces = [
  { href: "#programas", label: "Programas" },
  { href: "#resultados", label: "Resultados" },
  { href: "#nosotros", label: "Nosotros" },
  { href: "#contacto", label: "Contacto" },
];

export default function Header() {
  const [abierto, setAbierto] = useState(false);
  const boton = useRef<HTMLButtonElement>(null);

  return (
    <header
      className="cabecera"
      onKeyDown={(event) => {
        if (event.key === "Escape" && abierto) {
          setAbierto(false);
          boton.current?.focus();
        }
      }}
    >
      <div className="cabecera__fila">
        <a className="marca" href="#inicio" onClick={() => setAbierto(false)}>
          <Image src={logo} alt="" width={34} height={34} />
          <span className="marca__texto">
            Preicfés Bertel<span>Preparación Saber</span>
          </span>
        </a>
        <nav className="cabecera__nav" aria-label="Principal">
          <ul className="nav">
            {enlaces.map(({ href, label }) => (
              <li key={href}><a href={href}>{label}</a></li>
            ))}
          </ul>
        </nav>
        <div className="cabecera__acciones">
          <Link className="btn btn--sm" href="/ingreso">Ingresar</Link>
          <button
            ref={boton}
            className="menu-btn"
            type="button"
            aria-expanded={abierto}
            aria-controls="menu-movil"
            aria-label={abierto ? "Cerrar menú" : "Abrir menú"}
            onClick={() => setAbierto(!abierto)}
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" aria-hidden="true">
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
      <nav id="menu-movil" className="menu-movil" aria-label="Navegación móvil" hidden={!abierto}>
        {enlaces.map(({ href, label }) => (
          <a key={href} href={href} onClick={() => setAbierto(false)}>{label}</a>
        ))}
        <Link href="/ingreso" onClick={() => setAbierto(false)}>Ingresar al portal</Link>
      </nav>
    </header>
  );
}
