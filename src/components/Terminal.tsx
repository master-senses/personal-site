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

type AnyStep =
  | { kind: "type"; text: string; afterDelay?: number }
  | { kind: "output"; text: string; green?: boolean; afterDelay?: number; onShow?: () => void }
  | { kind: "pause"; ms: number };

const CHAR_MIN = 55;
const CHAR_MAX = 130;

function randDelay() {
  return CHAR_MIN + Math.random() * (CHAR_MAX - CHAR_MIN);
}

export default function Terminal({ onAboutOpen }: TerminalProps) {
  const [lines, setLines] = useState<Line[]>([]);
  const [typing, setTyping] = useState(""); // current command being typed
  const [showCursor, setShowCursor] = useState(true);
  const [done, setDone] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  const appendLine = (line: Line) =>
    setLines((prev) => [...prev, line]);

  useEffect(() => {
    if (startedRef.current) return;
    startedRef.current = true;

    const steps: AnyStep[] = [
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
        onShow: onAboutOpen,
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

    let cancelled = false;

    async function run() {
      for (const step of steps) {
        if (cancelled) return;

        if (step.kind === "pause") {
          await wait(step.ms);
          continue;
        }

        if (step.kind === "type") {
          // type chars one by one
          for (let i = 0; i <= step.text.length; i++) {
            if (cancelled) return;
            setTyping(step.text.slice(0, i));
            if (i < step.text.length) await wait(randDelay());
          }
          await wait(step.afterDelay ?? 200);

          // commit as a full line
          appendLine({ kind: "command", text: step.text });
          setTyping("");
          continue;
        }

        if (step.kind === "output") {
          step.onShow?.();
          appendLine({ kind: "output", text: step.text, green: step.green });
          await wait(step.afterDelay ?? 200);
        }
      }

      if (!cancelled) setDone(true);
    }

    run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // blinking cursor when not typing
  useEffect(() => {
    const id = setInterval(() => setShowCursor((v) => !v), 530);
    return () => clearInterval(id);
  }, []);

  // auto-scroll to bottom
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines, typing]);

  return (
    <div className="type-terminal" style={{ padding: "24px", minHeight: 240, maxHeight: "60vh", overflowY: "auto" }}>
      {lines.map((line, i) => (
        <div key={i} style={{ display: "flex", gap: 10 }}>
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

      {/* Currently typing row */}
      {!done && (
        <div style={{ display: "flex", gap: 10 }}>
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

      {/* Idle cursor after sequence done */}
      {done && (
        <div style={{ display: "flex", gap: 10 }}>
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

function wait(ms: number) {
  return new Promise<void>((r) => setTimeout(r, ms));
}
