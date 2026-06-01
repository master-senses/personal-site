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
    <div style={{ fontFamily: "var(--font-geist-mono), monospace", fontSize: 15, padding: "18px 22px" }}>
      <div style={{ color: "var(--text)", marginBottom: 16, paddingBottom: 12, borderBottom: "1px solid var(--border)", fontSize: 13, textTransform: "uppercase", letterSpacing: "0.08em" }}>
        about.txt — plain text
      </div>
      {rows.map(({ key, value, href, green }) => (
        <div key={key} style={{ display: "grid", gridTemplateColumns: "120px 1fr", gap: 14, padding: "7px 0", borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
          <span style={{ color: "var(--yellow)", opacity: 0.9 }}>{key}</span>
          {href ? (
            <a href={href} target={href.startsWith("http") ? "_blank" : undefined} rel={href.startsWith("http") ? "noopener noreferrer" : undefined} style={{ color: "var(--text)", textDecoration: "none" }}>
              {value}
            </a>
          ) : (
            <span style={{ color: green ? "var(--green)" : "var(--text)" }}>{value}</span>
          )}
        </div>
      ))}
    </div>
  );
}
