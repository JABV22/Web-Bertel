"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/panel", label: "Inicio" },
  { href: "/simulacro", label: "Mis pruebas" },
  { href: "/resultados", label: "Resultados" },
  { href: "/administracion", label: "Administración" },
];

export function PanelSidebar() {
  const pathname = usePathname();

  return (
    <nav className="lateral" aria-label="Portal">
      <Link href="/" className="marca">
        <Image
          src="/logo-bertel.png"
          alt=""
          width={42}
          height={42}
          className="object-contain"
        />
        <span className="marca__texto">
          Preicfés Bertel
          <span>Portal</span>
        </span>
      </Link>

      <ul className="menu-lateral">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;

          return (
            <li key={item.href}>
              <Link href={item.href} aria-current={isActive ? "page" : undefined}>
                {item.label}
              </Link>
            </li>
          );
        })}
      </ul>

      <p className="lateral__pie">Prototipo — Fase de diseño</p>
    </nav>
  );
}
