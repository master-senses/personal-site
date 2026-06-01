"use client";

import { useRef, useState, useCallback, useEffect } from "react";

export interface DraggableWindowProps {
  id: string;
  title: string;
  initialX: number;
  initialY: number;
  width: number;
  isOpen: boolean;
  zIndex: number;
  onFocus: (id: string) => void;
  onClose: (id: string) => void;
  accentBar?: boolean;
  centered?: boolean;
  titleRight?: React.ReactNode;
  children: React.ReactNode;
}

export default function DraggableWindow({
  id,
  title,
  initialX,
  initialY,
  width,
  isOpen,
  zIndex,
  onFocus,
  onClose,
  accentBar,
  centered = false,
  titleRight,
  children,
}: DraggableWindowProps) {
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [hasMoved, setHasMoved] = useState(false);
  const dragState = useRef<{
    startMouseX: number;
    startMouseY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);

  // Reset position when reopened
  const prevOpen = useRef(isOpen);
  useEffect(() => {
    if (!prevOpen.current && isOpen) {
      setPos({ x: initialX, y: initialY });
      setHasMoved(false);
    }
    prevOpen.current = isOpen;
  }, [isOpen, initialX, initialY]);

  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      // Only drag on left-click, ignore clicks on buttons inside titlebar
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).tagName === "BUTTON") return;

      onFocus(id);
      setHasMoved(true);
      dragState.current = {
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startPosX: pos.x,
        startPosY: pos.y,
      };

      const onMove = (ev: MouseEvent) => {
        if (!dragState.current) return;
        setPos({
          x: dragState.current.startPosX + (ev.clientX - dragState.current.startMouseX),
          y: Math.max(
            0,
            dragState.current.startPosY + (ev.clientY - dragState.current.startMouseY)
          ),
        });
      };

      const onUp = () => {
        dragState.current = null;
        document.removeEventListener("mousemove", onMove);
        document.removeEventListener("mouseup", onUp);
      };

      document.addEventListener("mousemove", onMove);
      document.addEventListener("mouseup", onUp);
      e.preventDefault();
    },
    [id, onFocus, pos.x, pos.y]
  );

  if (!isOpen) return null;

  const useCssCenter = centered && !hasMoved;

  return (
    <div
      style={{
        position: "absolute",
        left: useCssCenter ? "50%" : pos.x,
        top: pos.y,
        transform: useCssCenter ? "translateX(-50%)" : undefined,
        width,
        zIndex,
        borderRadius: 6,
        border: "2px solid var(--border)",
        background: "var(--bg-window)",
        boxShadow: "6px 6px 0px 0px rgba(0,0,0,0.85)",
        display: "flex",
        flexDirection: "column",
        maxHeight: "75vh",
      }}
      onMouseDown={() => onFocus(id)}
    >
      {/* Yellow accent stripe on focused window */}
      {accentBar && (
        <div
          style={{
            height: 3,
            background: "repeating-linear-gradient(-45deg, transparent, transparent 5px, rgba(249,189,43,0.15) 5px, rgba(249,189,43,0.15) 10px)",
            borderBottom: "2px solid var(--yellow)",
            borderRadius: "4px 4px 0 0",
          }}
        />
      )}

      {/* Title bar — drag handle */}
      <div
        onMouseDown={onTitleMouseDown}
        style={{
          background: "var(--titlebar)",
          borderBottom: "2px solid var(--border)",
          height: 40,
          display: "flex",
          alignItems: "center",
          gap: 8,
          padding: "0 12px",
          cursor: "grab",
          userSelect: "none",
          flexShrink: 0,
          borderRadius: accentBar ? 0 : "4px 4px 0 0",
        }}
      >
        {/* Traffic lights */}
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            aria-label="Close window"
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            style={{
              width: 11,
              height: 11,
              borderRadius: "50%",
              background: "var(--red)",
              border: "1px solid rgba(0,0,0,0.25)",
              cursor: "pointer",
              padding: 0,
            }}
          />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--orange)", border: "1px solid rgba(0,0,0,0.25)" }} />
          <div style={{ width: 11, height: 11, borderRadius: "50%", background: "var(--green)", border: "1px solid rgba(0,0,0,0.25)" }} />
        </div>

        {/* Title */}
        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: 13,
            fontFamily: "var(--font-geist-mono), monospace",
            color: "var(--text)",
            letterSpacing: "0.03em",
          }}
        >
          {title}
        </span>

        {/* Right slot */}
        {titleRight ? (
          <div style={{ flexShrink: 0 }}>{titleRight}</div>
        ) : (
          <div style={{ width: 37 }} />
        )}
      </div>

      {/* Content — scrollable */}
      <div style={{ overflowY: "auto", flex: 1 }}>{children}</div>
    </div>
  );
}
