"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { createClient } from "@/lib/supabase/client";

const NAV_ITEMS = [
  { href: "/panel", label: "Inicio" },
  { href: "/simulacro", label: "Mis pruebas" },
  { href: "/resultados", label: "Resultados" },
  { href: "/administracion", label: "Administración" },
];

export function PanelSidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [signOutError, setSignOutError] = useState("");

  async function handleSignOut() {
    setIsSigningOut(true);
    setSignOutError("");

    try {
      const { error } = await createClient().auth.signOut({ scope: "local" });
      if (error) {
        setSignOutError("No fue posible cerrar la sesión. Intenta de nuevo.");
        setIsSigningOut(false);
        return;
      }

      router.replace("/ingreso");
      router.refresh();
    } catch {
      setSignOutError("No fue posible cerrar la sesión. Intenta de nuevo.");
      setIsSigningOut(false);
    }
  }

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

      <div className="lateral__pie">
        <button
          className="lateral__salir"
          type="button"
          onClick={handleSignOut}
          disabled={isSigningOut}
        >
          {isSigningOut ? "Cerrando sesión..." : "Cerrar sesión"}
        </button>
        {signOutError && <p role="alert">{signOutError}</p>}
      </div>
    </nav>
  );
}
