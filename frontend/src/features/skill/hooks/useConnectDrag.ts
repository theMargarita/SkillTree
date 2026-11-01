import { useState, type RefObject } from "react";
import type { skillPosition } from "../../../shared/types/skills";

interface Draft {
  fromId: string;
  from: skillPosition;
  to: skillPosition;
}

interface UseConnectionDragProps {
  canvasRef: RefObject<HTMLElement | null>;
  onConnect: (fromId: string, toId: string) => Promise<void>;
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

  async function finish(fromId: string, toId: string | null) {
    reset();
    if (!toId || toId === fromId) return;
    try {
      await onConnect(fromId, toId);
    } catch (error) {
      onError?.(error);
    }
  }

  //spread the result onto rhe handle element of the node
}
