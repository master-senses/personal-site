interface WindowProps {
  title: string;
  children: React.ReactNode;
  className?: string;
  titleRight?: React.ReactNode;
  accentBar?: boolean;
}

export default function Window({
  title,
  children,
  className = "",
  titleRight,
  accentBar = false,
}: WindowProps) {
  return (
    <div className={`window ${className}`}>
      {accentBar && (
        <div
          className="h-1 stripe-yellow"
          style={{ borderBottom: "2px solid var(--yellow)" }}
        />
      )}
      <div className="window-titlebar">
        <div className="traffic-lights">
          <div
            className="traffic-light"
            style={{ background: "var(--red)" }}
            aria-hidden="true"
          />
          <div
            className="traffic-light"
            style={{ background: "var(--orange)" }}
            aria-hidden="true"
          />
          <div
            className="traffic-light"
            style={{ background: "var(--green)" }}
            aria-hidden="true"
          />
        </div>
        <span className="window-title">{title}</span>
        {titleRight && (
          <div className="ml-auto shrink-0">{titleRight}</div>
        )}
        {!titleRight && <div style={{ width: 37 }} />}
      </div>
      {children}
    </div>
  );
}
