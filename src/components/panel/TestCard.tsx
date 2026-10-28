import Link from "next/link";
import type { TestCardData } from "./mockData";

const STATUS_STYLES: Record<TestCardData["status"], string> = {
  available: "bg-bertel-oro-100 text-[#6B4E0A]",
  "in-progress": "bg-superficie-alt text-gris-texto",
  completed: "bg-exito/10 text-exito",
  unavailable: "bg-superficie-alt text-gris-texto",
};

export function TestCard({ test }: { test: TestCardData }) {
  const isUnavailable = test.status === "unavailable";

  return (
    <article className="flex min-h-64 flex-col rounded-xl border border-borde bg-superficie p-5 shadow-[var(--shadow-s1)]">
      <span className={`mb-4 self-start rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLES[test.status]}`}>
        {test.statusLabel}
      </span>
      <h3 className="text-base font-bold leading-snug text-texto-fuerte">{test.title}</h3>
      <p className="mt-2 text-sm text-gris-texto">{test.meta}</p>

      {test.description && <p className="mt-4 text-sm leading-6 text-gris-texto">{test.description}</p>}

      {test.progress !== undefined && (
        <div className="mt-4">
          <div className="h-2 overflow-hidden rounded-full bg-superficie-alt" aria-label={`${test.progress}% completado`}>
            <div className="h-full rounded-full bg-bertel-oro" style={{ width: `${test.progress}%` }} />
          </div>
          <p className="mt-2 text-xs text-gris-texto">{test.progressLabel}</p>
        </div>
      )}

      <div className="mt-auto flex items-center gap-3 pt-5">
        {isUnavailable ? (
          <button
            type="button"
            disabled
            className="cursor-not-allowed rounded-lg bg-bertel-azul px-4 py-2 text-sm font-semibold text-white/50"
          >
            {test.actionLabel}
          </button>
        ) : (
          <Link
            href={test.actionHref}
            className={`rounded-lg px-4 py-2 text-sm font-semibold transition-colors ${
              test.actionVariant === "secondary"
                ? "border border-borde-fuerte text-bertel-azul hover:bg-superficie-alt"
                : "bg-bertel-azul text-white hover:bg-bertel-azul-700"
            }`}
          >
            {test.actionLabel}
          </Link>
        )}
        {test.attemptsLabel && <span className="text-xs text-gris-texto">{test.attemptsLabel}</span>}
      </div>
    </article>
  );
}
