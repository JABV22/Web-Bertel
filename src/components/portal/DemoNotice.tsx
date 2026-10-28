type DemoNoticeProps = {
  children: React.ReactNode;
  tone?: "info" | "aviso";
};

export function DemoNotice({ children, tone = "info" }: DemoNoticeProps) {
  return (
    <div className={`alerta alerta--${tone}`} role="note">
      <span aria-hidden="true">{tone === "aviso" ? "⚠" : "ℹ"}</span>
      <span>{children}</span>
    </div>
  );
}
