export function BigTxtFileIcon() {
  return (
    <svg style={{ width: "var(--icon-desktop-w)", height: "var(--icon-desktop-h)" }} viewBox="0 0 52 64" fill="none" aria-hidden="true">
      <rect x="1" y="1" width="37" height="49" rx="2" fill="var(--bg-window)" stroke="var(--yellow)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L39 13" stroke="var(--yellow)" strokeOpacity="0.75" strokeWidth="1.5" />
      <path d="M27 1 L27 13 L39 13" fill="var(--yellow-dim)" stroke="var(--yellow)" strokeOpacity="0.6" strokeWidth="1" />
      <line x1="7" y1="22" x2="32" y2="22" stroke="var(--text-dim)" strokeWidth="1.5" />
      <line x1="7" y1="28" x2="32" y2="28" stroke="var(--text-dim)" strokeWidth="1.5" />
      <line x1="7" y1="34" x2="23" y2="34" stroke="var(--text-dim)" strokeWidth="1.5" />
      <rect x="0" y="42" width="52" height="22" rx="3" fill="var(--yellow)" />
      <text x="26" y="58" fontFamily="monospace" fontSize="13" fontWeight="800" fill="var(--text-on-yellow)" textAnchor="middle">TXT</text>
    </svg>
  );
}
