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

type ResizeEdge = "n" | "s" | "e" | "w" | "ne" | "nw" | "se" | "sw";

const RESIZE_WEST = new Set<ResizeEdge>(["w", "nw", "sw"]);
const RESIZE_EAST = new Set<ResizeEdge>(["e", "ne", "se"]);
const RESIZE_NORTH = new Set<ResizeEdge>(["n", "nw", "ne"]);
const RESIZE_SOUTH = new Set<ResizeEdge>(["s", "sw", "se"]);

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

        const parent = el?.offsetParent as HTMLElement | null;
        const parentW = parent?.clientWidth ?? window.innerWidth;
        const parentH = parent?.clientHeight ?? window.innerHeight;
        const margin = 8;

        const rightEdge = anchorX + startW;
        const bottomEdge = anchorY + startH;

        let newW = startW;
        let newH = startH;
        let newX = anchorX;
        let newY = anchorY;

        if (RESIZE_EAST.has(resizeEdge)) {
          newW = Math.max(MIN_WIDTH, startW + dx);
          newW = Math.min(newW, parentW - anchorX - margin);
        }

        if (RESIZE_WEST.has(resizeEdge)) {
          newW = Math.max(MIN_WIDTH, startW - dx);
          newX = rightEdge - newW;
          if (newX < 0) {
            newX = 0;
            newW = rightEdge;
          }
          newW = Math.min(newW, parentW - margin);
          newX = rightEdge - newW;
        }

        if (RESIZE_SOUTH.has(resizeEdge)) {
          newH = Math.max(MIN_HEIGHT, startH + dy);
          newH = Math.min(newH, parentH - anchorY - margin);
        }

        if (RESIZE_NORTH.has(resizeEdge)) {
          newH = Math.max(MIN_HEIGHT, startH - dy);
          newY = bottomEdge - newH;
          if (newY < 0) {
            newY = 0;
            newH = bottomEdge;
          }
          newH = Math.min(newH, parentH - margin);
          newY = bottomEdge - newH;
        }

        setSize({ w: newW, h: newH });
        if (RESIZE_WEST.has(resizeEdge) || RESIZE_NORTH.has(resizeEdge)) {
          setPos({ x: newX, y: newY });
        }
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
      className="window draggable-window"
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
        display: "flex",
        flexDirection: "column",
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
            background: "repeating-linear-gradient(-45deg, transparent, transparent 5px, var(--surface-active-strong) 5px, var(--surface-active-strong) 10px)",
          }}
        />
      )}

      <div
        onMouseDown={onTitleMouseDown}
        className="window-titlebar window-titlebar-draggable"
        style={{
          borderRadius: accentBar ? 0 : "4px 4px 0 0",
        }}
      >
        <div className="traffic-lights" style={{ flexShrink: 0 }}>
          <button
            aria-label="Close window"
            onClick={(e) => { e.stopPropagation(); onClose(id); }}
            className="traffic-light traffic-light-button"
            style={{
              background: "var(--red)",
            }}
          />
          <div className="traffic-light" style={{ background: "var(--orange)" }} />
          <div className="traffic-light" style={{ background: "var(--green)" }} />
        </div>

        <span
          className="window-title"
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
        <div className="window-resize-edge window-resize-edge-n" onPointerDown={(e) => onResizePointerDown(e, "n")} />
        <div className="window-resize-edge window-resize-edge-s" onPointerDown={(e) => onResizePointerDown(e, "s")} />
        <div className="window-resize-edge window-resize-edge-e" onPointerDown={(e) => onResizePointerDown(e, "e")} />
        <div className="window-resize-edge window-resize-edge-w" onPointerDown={(e) => onResizePointerDown(e, "w")} />
        <div className="window-resize-handle window-resize-handle-nw" onPointerDown={(e) => onResizePointerDown(e, "nw")} />
        <div className="window-resize-handle window-resize-handle-ne" onPointerDown={(e) => onResizePointerDown(e, "ne")} />
        <div className="window-resize-handle window-resize-handle-sw" onPointerDown={(e) => onResizePointerDown(e, "sw")} />
        <div className="window-resize-handle window-resize-handle-se" onPointerDown={(e) => onResizePointerDown(e, "se")} />
      </div>
    </div>
  );
}
