import { useRef, useState, type HTMLAttributes, type RefObject } from "react";
import type { skillPosition, DragState } from "../../../shared/types/skills";

const DRAG_THRESHOLD = 4; //px the pointer must travel before a press counts as a drag (else its a click)
const NODE_HALF_WIDTH = 80; //nodes are 160px wide and centred on their point
const NODE_HALF_HEIGHT = 35; //roughly half the node height

interface UseNodeDragOptions {
  canvasRef: RefObject<HTMLElement | null>;
  onCommit: (id: string, position: skillPosition) => Promise<void>; //saves new position - throws to signal failure
  onError?: (error: unknown) => void;
}

export function useNodeDrag({
  canvasRef,
  onCommit,
  onError,
}: UseNodeDragOptions) {
  const [overrides, setOverrides] = useState<Record<string, skillPosition>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const drag = useRef<DragState | null>(null);
  const suppressClick = useRef(false);

  function clamp(p: skillPosition): skillPosition {
    const el = canvasRef.current;
    if (!el) return { x: Math.round(p.x), y: Math.round(p.y) };
    const { width, height } = el.getBoundingClientRect();
    const maxX = Math.max(width - NODE_HALF_WIDTH, NODE_HALF_WIDTH);
    const maxY = Math.max(height - NODE_HALF_HEIGHT, NODE_HALF_HEIGHT);
    return {
      x: Math.round(Math.min(Math.max(p.x, NODE_HALF_WIDTH), maxX)),
      y: Math.round(Math.min(Math.max(p.y, NODE_HALF_HEIGHT), maxY)),
    };
  }

  function clearOverride(id: string) {
    setOverrides((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  }

  async function finish(
    e: React.PointerEvent<HTMLDivElement>,
    id: string,
    commit: boolean,
  ) {
    const d = drag.current;
    if (!d || d.id !== id || d.pointerId !== e.pointerId) return;
    drag.current = null;

    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
    setDragId(null);

    if (!d.moved) return;

    //a real drag also fires a click on release: ignore that one
    suppressClick.current = true;
    setTimeout(() => {
      suppressClick.current = false;
    }, 0);

    const unchanged =
      d.lastPos.x === d.startPos.x && d.lastPos.y === d.startPos.y;
    if (!commit || unchanged) {
      clearOverride(id);
      return;
    }

    try {
      await onCommit(id, d.lastPos); //the overridekeeps the node in place while this runs
    } catch (error) {
      onError?.(error); //the finally below removes the override, so that the node snaps back
    } finally {
      clearOverride(id);
    }
  }

  //spread the result onto the node element
  function bind(
    id: string,
    current: skillPosition,
  ): HTMLAttributes<HTMLDivElement> {
    return {
      onPointerDown(e) {
        if (e.button !== 0) return; //left button / primary touch only
        e.currentTarget.setPointerCapture(e.pointerId); //keep track even if the pointer leaves the node
        drag.current = {
          id,
          pointerId: e.pointerId,
          startPointer: { x: e.clientX, y: e.clientY },
          startPos: current,
          lastPos: current,
          moved: false,
        };
      },

      onPointerMove(e) {
        const d = drag.current;
        if (!d || d.id !== id || d.pointerId !== e.pointerId) return;

        const dx = e.clientX - d.startPointer.x; //zoom later: divide by scale
        const dy = e.clientY - d.startPointer.y; //zoom later: divide by scale
        if (!d.moved && Math.hypot(dx, dy) < DRAG_THRESHOLD) return;

        if (!d.moved) {
          d.moved = true;
          setDragId(id);
        }

        const next = clamp({
          x: d.startPointer.x + dx,
          y: d.startPointer.y + dy,
        });
        d.lastPos = next;
        setOverrides((prev) => ({ ...prev, [id]: next }));
      },
      onPointerUp(e) {
        void finish(e, id, true);
      },
      onPointerCancel(e) {
        void finish(e, id, false);
      },
    };
  }

  return {
    bind,
    overrides,
    dragId,
    shouldIgnoreClick: () => suppressClick.current,
  };
}
