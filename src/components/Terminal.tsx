"use client";

import { useEffect, useRef, useState } from "react";

interface TerminalProps {
  onAboutOpen: () => void;
}

type LineKind = "command" | "output";

interface Line {
  kind: LineKind;
  text: string;
  green?: boolean;
}

type Step =
  | { kind: "type"; text: string; afterDelay?: number }
  | { kind: "output"; text: string; green?: boolean; afterDelay?: number; openAbout?: boolean }
  | { kind: "pause"; ms: number };

const CHAR_MIN = 55;
const CHAR_MAX = 130;

const STEPS: Step[] = [
  { kind: "pause", ms: 400 },
  { kind: "type", text: "ls ~/", afterDelay: 120 },
  {
    kind: "output",
    text: "about.txt  work/  projects/  research/  skills/",
    afterDelay: 700,
  },
  { kind: "type", text: "whoami", afterDelay: 150 },
  {
    kind: "output",
    text: "Hrishikesh Kalyanaraman",
    afterDelay: 300,
    openAbout: true,
  },
  { kind: "pause", ms: 500 },
  { kind: "type", text: "echo $STATUS", afterDelay: 150 },
  {
    kind: "output",
    text: "available for work  ●",
    green: true,
    afterDelay: 0,
  },
  { kind: "pause", ms: 400 },
];

function randDelay() {
  return CHAR_MIN + Math.random() * (CHAR_MAX - CHAR_MIN);
}

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}

export default function Terminal({ onAboutOpen }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState("");
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const onAboutOpenRef = useRef(onAboutOpen);

  onAboutOpenRef.current = onAboutOpen;

  useEffect(() => {
    let cancelled = false;

    async function run() {
      for (const step of STEPS) {
        if (cancelled) return;

        if (step.kind === "pause") {
          await wait(step.ms);
          continue;
        }

        if (step.kind === "type") {
          for (let i = 0; i <= step.text.length; i++) {
            if (cancelled) return;
            setTyping(step.text.slice(0, i));
            if (i < step.text.length) await wait(randDelay());
          }
          await wait(step.afterDelay ?? 200);
          setLines((prev) => [...prev, { kind: "command", text: step.text }]);
          setTyping("");
          continue;
        }

        if (step.kind === "output") {
          if (step.openAbout) onAboutOpenRef.current();
          setLines((prev) => [...prev, { kind: "output", text: step.text, green: step.green }]);
          await wait(step.afterDelay ?? 200);
        }
      }

      if (!cancelled) setDone(true);
    }

    run();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typing]);

  return (
    <div className="type-terminal" style={{ padding: "16px", minHeight: 180, maxHeight: "50vh", overflowY: "auto" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 12 }}>
          {line.kind === "command" ? (
            <>
              <span style={{ color: "var(--yellow)", userSelect: "none" }}>$</span>
              <span style={{ color: "var(--text)" }}>{line.text}</span>
            </>
          ) : (
            <>
              <span style={{ width: 9, flexShrink: 0 }} />
              <span style={{ color: line.green ? "var(--green)" : "var(--text)" }}>
                {line.text}
              </span>
            </>
          )}
        </div>
      ))}

      {!done && (
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: "var(--yellow)", userSelect: "none" }}>$</span>
          <span style={{ color: "var(--text)" }}>
            {typing}
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: "0.85em",
                background: "var(--text)",
                verticalAlign: "middle",
                marginLeft: 1,
                opacity: showCursor ? 1 : 0,
                transition: "opacity 0.05s",
              }}
            />
          </span>
        </div>
      )}

      {done && (
        <div style={{ display: "flex", gap: 12 }}>
          <span style={{ color: "var(--yellow)", userSelect: "none" }}>$</span>
          <span>
            <span
              style={{
                display: "inline-block",
                width: 7,
                height: "0.85em",
                background: "var(--yellow)",
                verticalAlign: "middle",
                marginLeft: 1,
                opacity: showCursor ? 1 : 0,
                transition: "opacity 0.05s",
              }}
            />
          </span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
}
