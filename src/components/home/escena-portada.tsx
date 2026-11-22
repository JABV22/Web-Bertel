"use client";

import { useEffect } from "react";
import { iniciarEscena } from "./escena";

export default function EscenaPortada() {
  useEffect(() => {
    const hero = document.querySelector("[data-hero-escena]");
    const relato = document.querySelector("[data-relato]");
    if (hero && relato) return iniciarEscena(hero, relato);
  }, []);

  return null;
}
