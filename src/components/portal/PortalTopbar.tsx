type PortalTopbarProps = {
  title: string;
  badge?: string;
  initials?: string;
  action?: React.ReactNode;
};

export function PortalTopbar({ title, badge, initials = "ES", action }: PortalTopbarProps) {
  return (
    <header className="barra-sup">
      <h1>{title}</h1>
      {action}
      {badge && <span className="pastilla">{badge}</span>}
      <span className="avatar" aria-hidden="true">{initials}</span>
    </header>
  );
}
