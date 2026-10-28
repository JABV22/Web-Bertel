export function EmptyHistory() {
  return (
    <section className="rounded-xl border border-dashed border-borde-fuerte bg-superficie px-6 py-10 text-center">
      <h3 className="text-base font-bold text-texto-fuerte">Todavía no hay historial</h3>
      <p className="mx-auto mt-2 max-w-prose text-sm leading-6 text-gris-texto">
        Cuando termines una prueba, aquí aparecerán tus intentos con su fecha,
        puntuación y desglose por componente.
      </p>
    </section>
  );
}
