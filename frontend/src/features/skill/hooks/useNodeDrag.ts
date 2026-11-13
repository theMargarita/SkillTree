import { useRef, useState, type HTMLAttributes } from "react";
import type { skillPosition, DragState } from "../../../shared/types/skills";

const DRAG_THRESHOLD = 4; // screen px before a press counts as a drag

type PointerHandlers = Pick<
  HTMLAttributes<HTMLDivElement>,
  "onPointerDown" | "onPointerMove" | "onPointerUp" | "onPointerCancel"
>;

interface UseNodeDragOptions {
  scale: number; // current zoom
  onCommit: (id: string, position: skillPosition) => Promise<void>;
  onError?: (error: unknown) => void;
}

export function useNodeDrag({ scale, onCommit, onError }: UseNodeDragOptions) {
  const [overrides, setOverrides] = useState<Record<string, skillPosition>>({});
  const [dragId, setDragId] = useState<string | null>(null);
  const drag = useRef<DragState | null>(null);
  const suppressClick = useRef(false);

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

    // a real drag also fires a click on release: ignore that one
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
      await onCommit(id, d.lastPos);
    } catch (error) {
      onError?.(error);
    } finally {
      clearOverride(id);
    }
  }

  function bind(id: string, current: skillPosition): PointerHandlers {
    return {
      onPointerDown(e) {
        if (e.button !== 0) return;
        e.currentTarget.setPointerCapture(e.pointerId);
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

        const dxScreen = e.clientX - d.startPointer.x;
        const dyScreen = e.clientY - d.startPointer.y;
        if (!d.moved && Math.hypot(dxScreen, dyScreen) < DRAG_THRESHOLD) return;

        if (!d.moved) {
          d.moved = true;
          setDragId(id);
        }

        // screen movement -> world movement
        const next = {
          x: Math.round(d.startPos.x + dxScreen / scale),
          y: Math.round(d.startPos.y + dyScreen / scale),
        };
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
