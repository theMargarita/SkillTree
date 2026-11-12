import { useState, type HTMLAttributes, type RefObject } from "react";
import type { skillPosition } from "../../../shared/types/skills";

interface Draft {
  fromId: string;
  from: skillPosition;
  to: skillPosition;
}

interface UseConnectionDragProps {
  canvasRef: RefObject<HTMLElement | null>;
  // onConnect: (fromId: string, toId: string) => Promise<void>;
  onConnect: (fromId: string, toId: string) => void;
  onError?: (error: unknown) => void;
}

export function useConnectDrag({
  canvasRef,
  onConnect,
  onError,
}: UseConnectionDragProps) {
  const [draft, setDraft] = useState<Draft | null>(null);
  const [targetId, setTargetId] = useState<string | null>(null);

  //pointer positon in canvas coordinates
  //zoom later: divide by the scale
  function toCanvas(e: { clientX: number; clientY: number }): skillPosition {
    const rect = canvasRef.current?.getBoundingClientRect();
    return {
      x: e.clientX - (rect?.left ?? 0),
      y: e.clientY - (rect?.top ?? 0),
    };
  }

  //which skill node is under the pointer
  function skillIdAt(clientX: number, clientY: number): string | null {
    const el = document.elementFromPoint(clientX, clientY);
    return el?.closest<HTMLElement>("[data-skill-id]")?.dataset.skillId ?? null;
  }

  function reset() {
    setDraft(null);
    setTargetId(null);
  }

  //end pointer function
  function finish(fromId: string, toId: string | null) {
    reset();
    if (!toId || toId === fromId) return;
    try {
      onConnect(fromId, toId);
    } catch (error) {
      onError?.(error);
    }
  }

  //spread the result onto rhe handle element of the node
  function bindHandle(
    fromId: string,
    fromPos: skillPosition,
  ): HTMLAttributes<HTMLSpanElement> {
    return {
      onPointerDown(e) {
        //only primary mouse button or touch interaction is accepted
        if (e.button !== 0) return;
        e.stopPropagation(); // pressing the handle must not start dragging the node itself
        e.currentTarget.setPointerCapture(e.pointerId);
        setDraft({ fromId, from: fromPos, to: toCanvas(e) });
      },

      onPointerMove(e) {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return; // only while pressed
        setDraft((prev) => (prev ? { ...prev, to: toCanvas(e) } : prev));
        const id = skillIdAt(e.clientX, e.clientY);
        setTargetId(id && id !== fromId ? id : null);
      },

      onPointerUp(e) {
        if (!e.currentTarget.hasPointerCapture(e.pointerId)) return;
        e.currentTarget.releasePointerCapture(e.pointerId);
        void finish(fromId, skillIdAt(e.clientX, e.clientY));
      },

      onPointerCancel(e) {
        if (e.currentTarget.hasPointerCapture(e.pointerId)) {
          e.currentTarget.releasePointerCapture(e.pointerId);
        }
        reset();
      },

      onClick(e) {
        e.stopPropagation();
      },
    };
  }

  return { draft, targetId, bindHandle };
}
