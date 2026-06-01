"use client";

import { useEffect, useState } from "react";

const LINES = [
  { prompt: "$ ", text: "whoami", delay: 300 },
  { prompt: "  ", text: "Hrishikesh Kalyanaraman", delay: 900, output: true },
  { prompt: "$ ", text: "cat role.txt", delay: 1600 },
  { prompt: "  ", text: "Software Engineer @ Eli Lilly", delay: 2200, output: true },
  { prompt: "  ", text: "B.S. Computer Science · UIUC", delay: 2400, output: true },
  { prompt: "$ ", text: "cat certs.txt", delay: 3100 },
  { prompt: "  ", text: "AWS Certified Cloud Practitioner", delay: 3700, output: true },
  { prompt: "  ", text: "AWS Certified AI Practitioner", delay: 3900, output: true },
  { prompt: "$ ", text: "echo $STATUS", delay: 4600 },
  { prompt: "  ", text: "available for work ●", delay: 5200, output: true, green: true },
  { prompt: "$ ", text: "_", delay: 5900, cursor: true },
];

export default function Terminal() {
  const [visible, setVisible] = useState(0);

  useEffect(() => {
    const timers = LINES.map((line, i) =>
      setTimeout(() => setVisible(i + 1), line.delay)
    );
    return () => timers.forEach(clearTimeout);
  }, []);

  return (
    <div
      className="font-mono text-sm leading-relaxed"
      style={{ padding: "16px 20px" }}
    >
      {LINES.slice(0, visible).map((line, i) => (
        <div key={i} className="flex gap-3 items-start">
          <span
            style={{
              color: line.output ? "transparent" : "var(--yellow)",
              userSelect: "none",
            }}
          >
            {line.prompt}
          </span>
          <span
            style={{
              color: line.cursor
                ? "var(--text)"
                : line.output
                ? line.green
                  ? "var(--green)"
                  : "var(--text-muted)"
                : "var(--text)",
            }}
          >
            {line.text}
            {line.cursor && (
              <span
                className="inline-block ml-0.5"
                style={{
                  width: 8,
                  height: 14,
                  background: "var(--yellow)",
                  verticalAlign: "middle",
                  animation: "blink 1s step-end infinite",
                }}
              />
            )}
          </span>
        </div>
      ))}

      <style>{`
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0; }
        }
      `}</style>
    </div>
  );
}
