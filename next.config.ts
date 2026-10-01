import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /**
   * `next dev` reescribe un bloque propio dentro de CLAUDE.md en cada arranque.
   * CLAUDE.md es el documento rector del proyecto, escrito por el propietario:
   * una herramienta de compilación no debe modificarlo.
   *
   * El aviso que inyectaba (Next.js 16 introduce cambios de ruptura frente al
   * conocimiento previo de los agentes) se conserva en README.md, donde no
   * interfiere con las instrucciones del proyecto.
   */
  agentRules: false,
};

export default nextConfig;
