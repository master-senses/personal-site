"use client";

import { useRef, useState, useCallback, useEffect } from "react";

const MIN_WIDTH = 320;
const MIN_HEIGHT = 200;

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

type ResizeEdge = "se" | "e" | "s";

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
  const windowRef = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [hasMoved, setHasMoved] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number | null }>({ w: width, h: null });
  const dragState = useRef<{
    startMouseX: number;
    startMouseY: number;
    startPosX: number;
    startPosY: number;
  } | null>(null);
  const resizeState = useRef<{
    edge: ResizeEdge;
    startMouseX: number;
    startMouseY: number;
    startW: number;
    startH: number;
    anchorX: number;
    anchorY: number;
  } | null>(null);

  // Reset position and size when reopened
  const prevOpen = useRef(isOpen);
  useEffect(() => {
    if (!prevOpen.current && isOpen) {
      setPos({ x: initialX, y: initialY });
      setHasMoved(false);
      setSize({ w: width, h: null });
    }
    prevOpen.current = isOpen;
  }, [isOpen, initialX, initialY, width]);

  const pinCenteredWindow = useCallback(() => {
    const el = windowRef.current;
    if (!el || !el.offsetParent) return;
    const rect = el.getBoundingClientRect();
    const parentRect = (el.offsetParent as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left - parentRect.left, y: rect.top - parentRect.top });
    setHasMoved(true);
  }, []);

  const onTitleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return;
      if ((e.target as HTMLElement).tagName === "BUTTON") return;

      onFocus(id);
      if (centered && !hasMoved) pinCenteredWindow();
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
    [id, onFocus, pos.x, pos.y, centered, hasMoved, pinCenteredWindow]
  );

  const getAnchoredPosition = useCallback(() => {
    const el = windowRef.current;
    if (!el?.offsetParent) return { x: pos.x, y: pos.y };
    const rect = el.getBoundingClientRect();
    const parentRect = (el.offsetParent as HTMLElement).getBoundingClientRect();
    return {
      x: rect.left - parentRect.left,
      y: rect.top - parentRect.top,
    };
  }, [pos.x, pos.y]);

  const onResizePointerDown = useCallback(
    (e: React.PointerEvent, edge: ResizeEdge) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      onFocus(id);

      const handle = e.currentTarget as HTMLElement;
      handle.setPointerCapture(e.pointerId);

      const anchored = getAnchoredPosition();
      if (centered && !hasMoved) {
        setPos(anchored);
        setHasMoved(true);
      }

      const el = windowRef.current;
      const currentH = size.h ?? el?.offsetHeight ?? MIN_HEIGHT;
      const currentW = size.w;

      setSize({ w: currentW, h: currentH });

      resizeState.current = {
        edge,
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startW: currentW,
        startH: currentH,
        anchorX: anchored.x,
        anchorY: anchored.y,
      };

      const onMove = (ev: PointerEvent) => {
        if (!resizeState.current) return;
        const {
          edge: resizeEdge,
          startMouseX,
          startMouseY,
          startW,
          startH,
          anchorX,
          anchorY,
        } = resizeState.current;
        const dx = ev.clientX - startMouseX;
        const dy = ev.clientY - startMouseY;

        let newW = startW;
        let newH = startH;

        if (resizeEdge === "se" || resizeEdge === "e") {
          newW = Math.max(MIN_WIDTH, startW + dx);
        }
        if (resizeEdge === "se" || resizeEdge === "s") {
          newH = Math.max(MIN_HEIGHT, startH + dy);
        }

        const parent = el?.offsetParent as HTMLElement | null;
        const maxW = parent
          ? parent.clientWidth - anchorX - 8
          : window.innerWidth - anchorX - 8;
        const maxH = parent
          ? parent.clientHeight - anchorY - 8
          : window.innerHeight - anchorY - 8;
        newW = Math.min(newW, maxW);
        newH = Math.min(newH, maxH);

        setSize({ w: newW, h: newH });
      };

      const onUp = (ev: PointerEvent) => {
        resizeState.current = null;
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
    },
    [id, onFocus, size.h, size.w, centered, hasMoved, getAnchoredPosition]
  );

  if (!isOpen) return null;

  const useCssCenter = centered && !hasMoved;
  const explicitHeight = size.h !== null;

  return (
    <div
      ref={windowRef}
      className="draggable-window"
      style={{
        position: "absolute",
        left: useCssCenter ? "50%" : pos.x,
        top: pos.y,
        transform: useCssCenter ? "translateX(-50%)" : undefined,
        width: size.w,
        height: explicitHeight ? size.h! : undefined,
        minHeight: MIN_HEIGHT,
        maxHeight: explicitHeight ? undefined : "75vh",
        zIndex,
        borderRadius: 6,
        border: "2px solid var(--border)",
        background: "var(--bg-window)",
        boxShadow: "var(--shadow-window)",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
      }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest(".window-resize-layer, .window-resize-edge, .window-resize-handle")) return;
        onFocus(id);
      }}
    >
      {accentBar && (
        <div
          className="window-accent-bar"
          style={{
            height: 3,
            background: "repeating-linear-gradient(-45deg, transparent, transparent 5px, var(--yellow-dim) 5px, var(--yellow-dim) 10px)",
            borderBottom: "2px solid var(--yellow)",
            borderRadius: "4px 4px 0 0",
          }}
        />
      )}

      <div
        onMouseDown={onTitleMouseDown}
        style={{
          background: "var(--titlebar)",
          borderBottom: "2px solid var(--border)",
          height: 36,
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
        <div style={{ display: "flex", gap: 6, flexShrink: 0 }}>
          <button
            type="button"
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

        <span
          style={{
            flex: 1,
            textAlign: "center",
            fontSize: "var(--font-sm)",
            fontFamily: "var(--font-mono), monospace",
            color: "var(--text)",
            letterSpacing: "0.02em",
            lineHeight: "var(--leading-snug)",
          }}
        >
          {title}
        </span>

        {titleRight ? (
          <div style={{ flexShrink: 0 }}>{titleRight}</div>
        ) : (
          <div style={{ width: 37 }} />
        )}
      </div>

      <div style={{ overflowY: "auto", flex: 1, minHeight: 0, position: "relative" }}>{children}</div>

      {/* Resize overlay — above scroll content */}
      <div className="window-resize-layer" aria-hidden="true">
        <div
          className="window-resize-edge window-resize-edge-e"
          onPointerDown={(e) => onResizePointerDown(e, "e")}
        />
        <div
          className="window-resize-edge window-resize-edge-s"
          onPointerDown={(e) => onResizePointerDown(e, "s")}
        />
        <div
          className="window-resize-handle"
          onPointerDown={(e) => onResizePointerDown(e, "se")}
        />
      </div>
    </div>
  );
}
