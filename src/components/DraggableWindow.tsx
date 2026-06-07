"use client";

import { useRef, useState, useCallback, useLayoutEffect, useEffect } from "react";

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
  const contentRef = useRef<HTMLDivElement>(null);
  const [iframeShield, setIframeShield] = useState(false);
  const [pos, setPos] = useState({ x: initialX, y: initialY });
  const [hasMoved, setHasMoved] = useState(false);
  const [size, setSize] = useState<{ w: number; h: number | null }>({ w: width, h: null });
  const [centeredX, setCenteredX] = useState<number | null>(null);
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

  const prevIsOpenRef = useRef(isOpen);
  if (!prevIsOpenRef.current && isOpen) {
    setPos({ x: initialX, y: initialY });
    setHasMoved(false);
    setSize({ w: width, h: null });
    setCenteredX(null);
  }
  prevIsOpenRef.current = isOpen;

  const pinCenteredWindow = useCallback(() => {
    const el = windowRef.current;
    if (!el || !el.offsetParent) return;
    const rect = el.getBoundingClientRect();
    const parentRect = (el.offsetParent as HTMLElement).getBoundingClientRect();
    setPos({ x: rect.left - parentRect.left, y: rect.top - parentRect.top });
    setHasMoved(true);
  }, []);

  const centerWindow = useCallback(() => {
    const el = windowRef.current;
    const parent = el?.offsetParent as HTMLElement | null;
    if (!el || !parent) return;
    setCenteredX(Math.round((parent.clientWidth - el.offsetWidth) / 2));
  }, []);

  useLayoutEffect(() => {
    if (!isOpen || !centered || hasMoved) return;
    centerWindow();
    window.addEventListener("resize", centerWindow);
    return () => window.removeEventListener("resize", centerWindow);
  }, [isOpen, centered, hasMoved, size.w, centerWindow]);

  useLayoutEffect(() => {
    if (!isOpen) {
      setIframeShield(false);
      return;
    }
    setIframeShield(!!contentRef.current?.querySelector("iframe"));
  }, [isOpen, children]);

  useEffect(() => {
    if (!isOpen || !iframeShield) return;
    const onDocPointerDown = (e: PointerEvent) => {
      if (!windowRef.current?.contains(e.target as Node)) {
        setIframeShield(!!contentRef.current?.querySelector("iframe"));
      }
    };
    document.addEventListener("pointerdown", onDocPointerDown);
    return () => document.removeEventListener("pointerdown", onDocPointerDown);
  }, [isOpen, iframeShield]);

  const onTitlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      if (e.button !== 0) return;
      e.stopPropagation();
      e.preventDefault();
      onFocus(id);

      const handle = e.currentTarget as HTMLElement;
      handle.setPointerCapture(e.pointerId);

      if (centered && !hasMoved) pinCenteredWindow();
      setHasMoved(true);
      dragState.current = {
        startMouseX: e.clientX,
        startMouseY: e.clientY,
        startPosX: pos.x,
        startPosY: pos.y,
      };

      const onMove = (ev: PointerEvent) => {
        if (!dragState.current) return;
        setPos({
          x: dragState.current.startPosX + (ev.clientX - dragState.current.startMouseX),
          y: Math.max(
            0,
            dragState.current.startPosY + (ev.clientY - dragState.current.startMouseY)
          ),
        });
      };

      const onUp = (ev: PointerEvent) => {
        dragState.current = null;
        handle.releasePointerCapture(ev.pointerId);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
        handle.removeEventListener("pointercancel", onUp);
      };

      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);
      handle.addEventListener("pointercancel", onUp);
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

  const isCentering = centered && !hasMoved;
  const useCssCenter = isCentering && centeredX === null;
  const explicitHeight = size.h !== null;

  return (
    <div
      ref={windowRef}
      className="draggable-window draggable-window-shell"
      data-explicit-height={explicitHeight ? "true" : "false"}
      style={{
        left: isCentering ? (centeredX ?? "50%") : pos.x,
        top: pos.y,
        transform: useCssCenter ? "translateX(-50%)" : undefined,
        width: size.w,
        height: explicitHeight ? size.h! : undefined,
        zIndex,
      }}
      onMouseDown={(e) => {
        if ((e.target as HTMLElement).closest(".window-resize-layer, .window-resize-edge, .window-resize-handle, .window-drag-handle")) {
          return;
        }
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
        data-accent={accentBar ? "true" : "false"}
        className="window-titlebar"
      >
        <button
          type="button"
          className="window-drag-handle"
          aria-label={`Drag ${title}`}
          onPointerDown={onTitlePointerDown}
        >
          {title}
        </button>

        {titleRight ? (
          <div style={{ flexShrink: 0 }}>{titleRight}</div>
        ) : null}

        <button
          type="button"
          className="window-close"
          aria-label="Close window"
          onClick={(e) => {
            e.stopPropagation();
            onClose(id);
          }}
        >
          ×
        </button>
      </div>

      <div ref={contentRef} style={{ overflowY: "auto", flex: 1, minHeight: 0, position: "relative" }}>
        {children}
        {iframeShield ? (
          <div
            className="iframe-focus-shield"
            aria-hidden="true"
            onPointerDown={(e) => {
              e.stopPropagation();
              onFocus(id);
              setIframeShield(false);
            }}
          />
        ) : null}
      </div>

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
