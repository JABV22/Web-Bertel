import { optionLetter } from "./QuestionAnswerSummary";

export function ReviewOptions({
  options,
  correctOptionId,
  selectedOptionId,
}: {
  options: readonly { id: string; option_text: string }[];
  correctOptionId: string | null;
  selectedOptionId?: string | null;
}) {
  const hasKey = options.some(({ id }) => id === correctOptionId);

  return (
    <>
      <ul className="mt-4 grid gap-2">
        {options.map((option, index) => {
          const letter = optionLetter(index);
          const selected = option.id === selectedOptionId;
          const correct = option.id === correctOptionId;
          return (
            <li
              key={option.id}
              className={`flex flex-wrap items-center justify-between gap-x-4 gap-y-2 rounded-lg border px-3 py-2 ${correct ? "border-exito bg-exito/10" : selected ? "border-bertel-azul bg-superficie-alt" : "border-borde"}`}
            >
              <span className="min-w-0 whitespace-pre-wrap break-words">
                <strong>{letter}.</strong>
                {option.option_text !== letter && ` ${option.option_text}`}
              </span>
              {(selected || correct) && (
                <span className="flex flex-wrap gap-2">
                  {selected && (
                    <span className="rounded-full bg-bertel-azul px-2 py-1 text-xs font-semibold text-white">
                      Respuesta marcada
                    </span>
                  )}
                  {correct && (
                    <span className="rounded-full bg-exito px-2 py-1 text-xs font-semibold text-white">
                      Respuesta correcta
                    </span>
                  )}
                </span>
              )}
            </li>
          );
        })}
      </ul>
      {!hasKey && <p className="mt-3 text-sm text-gris-texto">Clave de corrección no disponible para esta pregunta.</p>}
    </>
  );
}
