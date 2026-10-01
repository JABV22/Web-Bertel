import Image from "next/image";

/**
 * Página de espera de la Fase 1.
 *
 * NO es la página de inicio del producto (P01 de WIREFRAMES.md §3).
 * Existe únicamente para verificar que el entorno arranca y compila, y para
 * dejar claro en qué punto está el proyecto. Se sustituye en la Fase 3.
 */

const FASES = [
  { n: 0, nombre: "Cotejo y plan ejecutable", estado: "cerrada" },
  { n: 1, nombre: "Base técnica y entorno", estado: "actual" },
  { n: 2, nombre: "Datos, autenticación y autorización", estado: "pendiente" },
  { n: 3, nombre: "Sitio público y contenidos administrables", estado: "pendiente" },
  { n: 4, nombre: "Banco de preguntas y construcción de pruebas", estado: "pendiente" },
  { n: 5, nombre: "Resolución de simulacros", estado: "pendiente" },
  { n: 6, nombre: "Calificación, revisión y seguimiento", estado: "pendiente" },
] as const;

const ESTILO_ESTADO: Record<string, string> = {
  cerrada: "bg-exito/10 text-exito",
  actual: "bg-bertel-oro-100 text-[#6B4E0A]",
  pendiente: "bg-superficie-alt text-gris-texto",
};

const ETIQUETA_ESTADO: Record<string, string> = {
  cerrada: "Cerrada",
  actual: "En curso",
  pendiente: "Pendiente",
};

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col justify-center px-6 py-20">
      <div className="mb-10 flex items-center gap-4">
        <Image
          src="/logo-bertel-marca.png"
          alt="Preicfés Bertel"
          width={56}
          height={56}
          priority
          className="h-14 w-14 object-contain"
        />
        <div>
          <p className="text-lg font-bold tracking-tight text-bertel-azul">
            Preicfés Bertel
          </p>
          <p className="text-sm text-gris-texto">Plataforma educativa</p>
        </div>
      </div>

      <p className="mb-3 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[.13em] text-gris-texto">
        <span className="h-0.5 w-6 rounded bg-bertel-oro" aria-hidden="true" />
        Fase 1 — Base técnica
      </p>

      <h1 className="mb-5 text-h1 font-bold leading-[1.04] tracking-tight text-texto-fuerte">
        El proyecto ya arranca y compila.
      </h1>

      <p className="mb-10 max-w-[46ch] text-guia leading-relaxed text-gris-texto">
        Esta no es la página de inicio del producto. Es una página de espera que
        confirma que el entorno funciona. La interfaz real se construye en la Fase 3,
        a partir de los wireframes aprobados.
      </p>

      <ol className="mb-10 divide-y divide-borde overflow-hidden rounded-lg border border-borde bg-superficie">
        {FASES.map((f) => (
          <li key={f.n} className="flex items-center gap-4 px-5 py-3">
            <span className="w-6 text-sm font-semibold tabular-nums text-gris-texto">
              {f.n}
            </span>
            <span className="flex-1 text-sm text-texto">{f.nombre}</span>
            <span
              className={`rounded-full px-3 py-1 text-xs font-semibold ${ESTILO_ESTADO[f.estado]}`}
            >
              {ETIQUETA_ESTADO[f.estado]}
            </span>
          </li>
        ))}
      </ol>

      <p className="text-sm text-gris-texto">
        Estado detallado en <code className="rounded bg-superficie-alt px-1.5 py-0.5 text-xs">docs/ESTADO.md</code>.
        Referencia visual navegable en <code className="rounded bg-superficie-alt px-1.5 py-0.5 text-xs">prototipo/</code>.
      </p>
    </main>
  );
}
