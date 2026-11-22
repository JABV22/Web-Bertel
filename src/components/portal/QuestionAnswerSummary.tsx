export function optionLetter(index: number) {
  return String.fromCharCode(65 + index);
}

export function describeOption(
  options: readonly { id: string }[],
  optionId: string | null | undefined,
  emptyLabel: string,
) {
  const index = options.findIndex((option) => option.id === optionId);
  return index < 0 ? emptyLabel : optionLetter(index);
}

export function QuestionAnswerSummary({
  selected,
  correct,
}: {
  selected: string;
  correct?: string;
}) {
  return (
    <dl className={`mb-4 grid gap-2 ${correct === undefined ? "" : "sm:grid-cols-2"}`}>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-bertel-azul bg-superficie-alt px-4 py-3">
        <dt className="text-sm font-semibold text-bertel-azul">Respuesta marcada</dt>
        <dd className="font-bold text-bertel-azul">{selected}</dd>
      </div>
      {correct !== undefined && (
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-exito bg-exito/10 px-4 py-3">
          <dt className="text-sm font-semibold text-exito">Respuesta correcta</dt>
          <dd className="font-bold text-exito">{correct}</dd>
        </div>
      )}
    </dl>
  );
}
