const SUBJECTS = [
  { name: "Lectura crítica", progress: 74 },
  { name: "Matemáticas", progress: 58 },
  { name: "Sociales", progress: 66 },
];

export function DemoProgress() {
  return (
    <aside className="acceso__aparte" aria-hidden="true">
      <article className="panel">
        <div className="panel__barra">
          <i className="panel__punto" />
          <span className="panel__titulo">Mi progreso</span>
        </div>
        <div className="panel__cuerpo">
          <div className="progreso__fila">
            <span className="progreso__cifra">—</span>
            <span className="pastilla">Demostración</span>
          </div>
          <div className="barra"><div className="barra__valor" style={{ width: "62%" }} /></div>
          <ul className="lista-materias">
            {SUBJECTS.map(({ name, progress }) => (
              <li key={name}>
                <div><span>{name}</span><span>—</span></div>
                <div className="barra">
                  <div className="barra__valor" style={{ width: `${progress}%` }} />
                </div>
              </li>
            ))}
          </ul>
        </div>
      </article>
      <p className="acceso__lema">Prepárate, practica y comprende tus resultados.</p>
    </aside>
  );
}
