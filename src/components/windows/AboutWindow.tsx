export default function AboutWindow() {
  const rows = [
    { key: "name",      value: "Hrishikesh Kalyanaraman" },
    { key: "role",      value: "Software Engineer" },
    { key: "company",   value: "Eli Lilly and Company" },
    { key: "education", value: "B.S. Computer Science · UIUC" },
    { key: "github",    value: "github.com/master-senses",                  href: "https://github.com/master-senses" },
    { key: "linkedin",  value: "linkedin.com/in/hk39",                      href: "https://www.linkedin.com/in/hk39/" },
    { key: "email",     value: "hrishikeshkalyanaraman@gmail.com",          href: "mailto:hrishikeshkalyanaraman@gmail.com" },
    { key: "status",    value: "available for work  ●",                     green: true },
  ];

  return (
    <div className="txt-window" style={{ padding: "16px" }}>
      <div className="type-caption" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)", textTransform: "uppercase", fontWeight: 600, letterSpacing: "var(--tracking-caption)" }}>
        about.txt — plain text
      </div>
      {rows.map(({ key, value, href, green }) => (
        <div key={key} style={{ display: "grid", gridTemplateColumns: "112px 1fr", gap: 20, padding: "12px 0", borderBottom: "1px solid rgba(255,255,255,0.05)", alignItems: "baseline" }}>
          <span className="type-label" style={{ color: "var(--yellow)", textTransform: "lowercase" }}>{key}</span>
          {href ? (
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} className="type-body" style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 500, minWidth: 0, wordBreak: "break-word" }}>
              {value}
            </a>
          ) : (
            <span className="type-body" style={{ color: green ? "var(--green)" : "var(--text)", fontWeight: green ? 600 : 400, minWidth: 0, wordBreak: "break-word" }}>{value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
