export default function AboutWindow() {
  const rows = [
    { key: "name",      value: "Hrishikesh Kalyanaraman" },
    { key: "role",      value: "Software Engineer" },
    { key: "company",   value: "Eli Lilly and Company" },
    { key: "education", value: "B.S. Computer Science · UIUC" },
    { key: "github",    value: "github.com/master-senses",                  href: "https://github.com/master-senses" },
    { key: "linkedin",  value: "linkedin.com/in/hrishikeshkalyanaraman",    href: "https://linkedin.com/in/hrishikeshkalyanaraman" },
    { key: "email",     value: "hrishikeshkalyanaraman@gmail.com",          href: "mailto:hrishikeshkalyanaraman@gmail.com" },
    { key: "status",    value: "available for work  ●",                     green: true },
  ];

  return (
    <div className="type-body-mono" style={{ padding: "20px 24px" }}>
      <div className="type-caption" style={{ marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)", textTransform: "uppercase" }}>
        about.txt — plain text
      </div>
      {rows.map(({ key, value, href, green }) => (
        <div key={key} style={{ display: "grid", gridTemplateColumns: "128px 1fr", gap: 16, padding: "8px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span className="type-label" style={{ color: "var(--yellow)" }}>{key}</span>
          {href ? (
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ color: "var(--blue)", textDecoration: "none", fontWeight: 500 }}>
              {value}
            </a>
          ) : (
            <span style={{ color: green ? "var(--green)" : "var(--text)", fontWeight: 500 }}>{value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
