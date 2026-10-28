const SUBJECTS = [
  { name: "Lectura crítica", progress: 74 },
  { name: "Matemáticas", progress: 58 },
  { name: "Sociales", progress: 66 },
];

export function DemoProgress() {
  return (
    <aside className="hidden max-w-md flex-1 text-white lg:block" aria-hidden="true">
      <div className="rounded-2xl bg-white/10 p-6 shadow-[var(--shadow-panel)] backdrop-blur-sm">
        <div className="mb-8 flex items-center gap-2 border-b border-white/15 pb-4">
          <span className="h-2.5 w-2.5 rounded-full bg-bertel-oro" />
          <span className="text-sm font-semibold">Mi progreso</span>
        </div>
        <div className="mb-8 flex items-center justify-between">
          <span className="text-5xl font-bold">—</span>
          <span className="rounded-full bg-white/15 px-3 py-1 text-xs">Demostración</span>
        </div>
        <div className="h-2 overflow-hidden rounded-full bg-white/15">
          <div className="h-full w-[62%] rounded-full bg-bertel-oro" />
        </div>
        <ul className="mt-8 space-y-5">
          {SUBJECTS.map((subject) => (
            <li key={subject.name}>
              <div className="mb-2 flex justify-between text-xs text-white/75">
                <span>{subject.name}</span>
                <span>—</span>
              </div>
              <div className="h-1.5 overflow-hidden rounded-full bg-white/15">
                <div
                  className="h-full rounded-full bg-bertel-oro"
                  style={{ width: `${subject.progress}%` }}
                />
              </div>
            </li>
          ))}
        </ul>
      </div>
      <p className="mt-6 text-center text-sm text-white/75">
        Prepárate, practica y comprende tus resultados.
      </p>
    </aside>
  );
}
