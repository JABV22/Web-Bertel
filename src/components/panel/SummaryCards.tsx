import type { PanelSummary } from "./mockData";

export function SummaryCards({ items }: { items: PanelSummary[] }) {
  return (
    <section
      aria-label="Resumen de actividad"
      className="grid grid-cols-2 gap-px overflow-hidden rounded-xl border border-borde bg-borde sm:grid-cols-4"
    >
      {items.map((item) => (
        <div key={item.label} className="bg-superficie px-4 py-5 sm:px-5">
          <p className="text-2xl font-bold tabular-nums text-texto-fuerte">{item.value}</p>
          <p className="mt-1 text-xs leading-5 text-gris-texto">{item.label}</p>
        </div>
      ))}
    </section>
  );
}
