type PanelHeaderProps = {
  greeting: string;
  grade: string;
  initials: string;
};

export function PanelHeader({ greeting, grade, initials }: PanelHeaderProps) {
  return (
    <header className="barra-sup">
      <h1>{greeting}</h1>
      <span className="pastilla">{grade}</span>
      <span className="avatar" aria-label={`Iniciales de ${greeting}`}>
        {initials}
      </span>
    </header>
  );
}
