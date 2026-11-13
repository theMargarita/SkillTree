import { useCallback, useEffect, useRef, useState } from "react";
import "../styles/board.css";
import type {
  skillPosition,
  SkillResponse,
  SkillStatus,
} from "../../../shared/types/skills";
import type { SkillBoardDetailResponse } from "../../../shared/types/board";
import SkillNode from "../../skill-detail/components/SkillNode";
import { API_URL } from "../../../shared/config";
import { useNodeDrag } from "../../skill/hooks/useNodeDrag";
import { updateSkillPosition } from "../../skill/api/skillApi";
import { useConnectDrag } from "../../skill/hooks/useConnectDrag";
import {
  edgePoint,
  NODE_HALF_WIDTH,
  NODE_HALF_HEIGHT,
} from "../../skillConnecton/utlis/geometry";
import AddSkillConnectionModal from "../../skillConnecton/component/AddSkillConnection";
import RemoveSkillConnectionModal from "../../skillConnecton/component/RemoveSkillConnection";

const DEFAULT_LINE_COLOR = "#8a93a3";
const DIM_LINE_COLOR = "#3a3d42";
const LIT_LINE_FALLBACK = "#f4c542";
const MIN_ZOOM = 0.3;
const MAX_ZOOM = 2;
const GRID = 40;

interface View {
  x: number; // pan, screen px
  y: number;
  zoom: number;
}

const clampZoom = (z: number) => Math.min(MAX_ZOOM, Math.max(MIN_ZOOM, z));

// pan and zoom that fit every skill inside the viewport
function computeFit(skills: SkillResponse[], el: HTMLElement): View {
  if (skills.length === 0) return { x: 0, y: 0, zoom: 1 };

  const PAD = 80;
  const xs = skills.map((s) => Number(s.positionX));
  const ys = skills.map((s) => Number(s.positionY));
  const minX = Math.min(...xs) - NODE_HALF_WIDTH - PAD;
  const maxX = Math.max(...xs) + NODE_HALF_WIDTH + PAD;
  const minY = Math.min(...ys) - NODE_HALF_HEIGHT - PAD;
  const maxY = Math.max(...ys) + NODE_HALF_HEIGHT + PAD + 30; // + name label
  const w = maxX - minX;
  const h = maxY - minY;

  const zoom = clampZoom(Math.min(el.clientWidth / w, el.clientHeight / h, 1));
  return {
    zoom,
    x: (el.clientWidth - w * zoom) / 2 - minX * zoom,
    y: (el.clientHeight - h * zoom) / 2 - minY * zoom,
  };
}

// small filled triangle at `tip`, pointing along start -> tip
function arrowPoints(start: skillPosition, tip: skillPosition, size = 11) {
  const dx = tip.x - start.x;
  const dy = tip.y - start.y;
  const len = Math.hypot(dx, dy) || 1;
  const ux = dx / len;
  const uy = dy / len;
  const bx = tip.x - ux * size;
  const by = tip.y - uy * size;
  const px = -uy * (size * 0.5);
  const py = ux * (size * 0.5);
  return `${tip.x},${tip.y} ${bx + px},${by + py} ${bx - px},${by - py}`;
}

interface BoardCanvasProps {
  boardId: string;
  onSkillClick?: (skill: SkillResponse) => void;
  reloadKey?: number;
  // second argument: world point at the centre of what the user sees
  onAddSkill?: (existingCount: number, centre: skillPosition) => void;
}

export default function BoardCanvas({
  boardId,
  onSkillClick,
  reloadKey = 0,
  onAddSkill,
}: BoardCanvasProps) {
  const [board, setBoard] = useState<SkillBoardDetailResponse | null>(null);
  const [pendingConnection, setPendingConnection] = useState<{
    fromSkillId: string;
    toSkillId: string;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [localReload, setLocalReload] = useState(0);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [removeConnection, setRemoveConnection] = useState<string | null>(null);

  const viewportRef = useRef<HTMLDivElement>(null);
  const worldRef = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, zoom: 1 });
  const [panning, setPanning] = useState(false);
  const pan = useRef<{
    pointerId: number;
    startX: number;
    startY: number;
    origX: number;
    origY: number;
  } | null>(null);
  const didFit = useRef(false);

  const prevStatuses = useRef<Map<string, SkillStatus>>(new Map());
  const [justUnlocked, setJustUnlocked] = useState<Set<string>>(new Set());

  const { bind, overrides, dragId, shouldIgnoreClick } = useNodeDrag({
    scale: view.zoom,
    onCommit: async (id, pos) => {
      setMoveError(null);
      await updateSkillPosition(id, pos.x, pos.y);
      setBoard((prev) =>
        prev
          ? {
              ...prev,
              skills: prev.skills.map((s) =>
                s.id === id ? { ...s, positionX: pos.x, positionY: pos.y } : s,
              ),
            }
          : prev,
      );
    },
    onError: (err) =>
      setMoveError(
        `Could not save the new position${err instanceof Error ? `: ${err.message}` : "."}`,
      ),
  });

  const { draft, targetId, bindHandle } = useConnectDrag({
    canvasRef: worldRef,
    scale: view.zoom,
    onConnect: (fromSkillId, toSkillId) =>
      setPendingConnection({ fromSkillId, toSkillId }),
    onError: (err) =>
      setMoveError(
        `Could not connect${err instanceof Error ? `: ${err.message}` : "."}`,
      ),
  });

  const load = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/SkillBoard/${boardId}`);
    if (res.status === 404) throw new Error("Board not found");
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as SkillBoardDetailResponse;

    const unlocked = new Set<string>();
    for (const s of data.skills) {
      if (
        prevStatuses.current.get(s.id) === "Locked" &&
        s.status !== "Locked"
      ) {
        unlocked.add(s.id);
      }
    }
    prevStatuses.current = new Map(data.skills.map((s) => [s.id, s.status]));

    setJustUnlocked(unlocked);
    setBoard(data);
    setError(null);
  }, [boardId]);

  useEffect(() => {
    load()
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error unknown"),
      )
      .finally(() => setLoading(false));
  }, [load, reloadKey, localReload]);

  useEffect(() => {
    if (justUnlocked.size === 0) return;
    const t = setTimeout(() => setJustUnlocked(new Set()), 1800);
    return () => clearTimeout(t);
  }, [justUnlocked]);

  // true once the viewport element is actually in the DOM
  const ready = !loading && !error && board !== null;

  // fit the view once, after the first render that has the viewport
  useEffect(() => {
    if (!ready || didFit.current || !viewportRef.current || !board) return;
    setView(computeFit(board.skills, viewportRef.current));
    didFit.current = true;
  }, [ready, board]);

  // wheel zoom around the cursor: native, non-passive, so preventDefault
  // stops the page from scrolling
  useEffect(() => {
    const el = viewportRef.current;
    if (!ready || !el) return;

    function onWheel(e: WheelEvent) {
      e.preventDefault();
      const rect = el!.getBoundingClientRect();
      const mx = e.clientX - rect.left;
      const my = e.clientY - rect.top;

      setView((v) => {
        const zoom = clampZoom(v.zoom * Math.exp(-e.deltaY * 0.0015));
        const k = zoom / v.zoom;
        return { zoom, x: mx - (mx - v.x) * k, y: my - (my - v.y) * k };
      });
    }

    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, [ready]);

  function zoomBy(factor: number) {
    const el = viewportRef.current;
    if (!el) return;
    const cx = el.clientWidth / 2;
    const cy = el.clientHeight / 2;
    setView((v) => {
      const zoom = clampZoom(v.zoom * factor);
      const k = zoom / v.zoom;
      return { zoom, x: cx - (cx - v.x) * k, y: cy - (cy - v.y) * k };
    });
  }

  function fitView() {
    if (board && viewportRef.current) {
      setView(computeFit(board.skills, viewportRef.current));
    }
  }

  function centreOfView(): skillPosition {
    const el = viewportRef.current;
    if (!el) return { x: 200, y: 200 };
    return {
      x: Math.round((el.clientWidth / 2 - view.x) / view.zoom),
      y: Math.round((el.clientHeight / 2 - view.y) / view.zoom),
    };
  }

  // ---- panning: dragging empty space ----
  function onViewportPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    if (e.button !== 0) return;
    // presses on nodes, lines and buttons belong to them, not to the pan
    if ((e.target as Element).closest(".skill-node, .connection-hit, button"))
      return;

    e.currentTarget.setPointerCapture(e.pointerId);
    pan.current = {
      pointerId: e.pointerId,
      startX: e.clientX,
      startY: e.clientY,
      origX: view.x,
      origY: view.y,
    };
    setPanning(true);
  }

  function onViewportPointerMove(e: React.PointerEvent<HTMLDivElement>) {
    const p = pan.current;
    if (!p || p.pointerId !== e.pointerId) return;
    setView((v) => ({
      ...v,
      x: p.origX + (e.clientX - p.startX),
      y: p.origY + (e.clientY - p.startY),
    }));
  }

  function endPan(e: React.PointerEvent<HTMLDivElement>) {
    const p = pan.current;
    if (!p || p.pointerId !== e.pointerId) return;
    pan.current = null;
    setPanning(false);
    if (e.currentTarget.hasPointerCapture(e.pointerId)) {
      e.currentTarget.releasePointerCapture(e.pointerId);
    }
  }

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!board) return null;

  const skillCount = board.skills.length;
  const completedCount = board.skills.filter(
    (s) => s.status === "Completed",
  ).length;
  const skillById = new Map(board.skills.map((s) => [s.id, s]));

  const posOf = (s: SkillResponse): skillPosition =>
    overrides[s.id] ?? { x: s.positionX, y: s.positionY };

  function handleNodeClick(skill: SkillResponse) {
    if (shouldIgnoreClick()) return;
    onSkillClick?.(skill);
  }

  const gridSize = GRID * view.zoom;

  return (
    <div className="board">
      <div className="board-header">
        <h1>{board.name}</h1>
        <div className="board-header__actions">
          {onAddSkill && (
            <button
              type="button"
              onClick={() => onAddSkill(skillCount, centreOfView())}
            >
              + Add skill
            </button>
          )}
          <span className="board-progress">
            {completedCount}/{skillCount} COMPLETE
          </span>
        </div>
      </div>

      {moveError && <p className="board-error">{moveError}</p>}

      <div
        ref={viewportRef}
        className={`board-viewport${panning ? " is-panning" : ""}`}
        style={{
          backgroundSize: `${gridSize}px ${gridSize}px`,
          backgroundPosition: `${view.x}px ${view.y}px`,
        }}
        onPointerDown={onViewportPointerDown}
        onPointerMove={onViewportPointerMove}
        onPointerUp={endPan}
        onPointerCancel={endPan}
      >
        <div
          ref={worldRef}
          className="board-world"
          style={{
            transform: `translate(${view.x}px, ${view.y}px) scale(${view.zoom})`,
          }}
        >
          <svg className="board-connections">
            {board.connections.map((conn) => {
              const from = skillById.get(conn.fromSkillId);
              const to = skillById.get(conn.toSkillId);
              if (!from || !to) return null;

              const start = edgePoint(posOf(from), posOf(to));
              const end = edgePoint(posOf(to), posOf(from), 2);
              const lit = from.status === "Completed";
              const color = lit
                ? (conn.lineColor ?? LIT_LINE_FALLBACK)
                : DIM_LINE_COLOR;

              return (
                <g key={conn.id} className="connection">
                  <line
                    className="connection-line"
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    style={{ stroke: color }}
                    strokeDasharray={
                      conn.lineStyle === "dashed" ? "6 4" : undefined
                    }
                  />
                  <polygon
                    points={arrowPoints(start, end)}
                    style={{ fill: color }}
                  />
                  <line
                    className="connection-hit"
                    x1={start.x}
                    y1={start.y}
                    x2={end.x}
                    y2={end.y}
                    stroke="transparent"
                    strokeWidth={16}
                    onClick={() => setRemoveConnection(conn.id)}
                  />
                </g>
              );
            })}

            {draft && (
              <line
                x1={draft.from.x}
                y1={draft.from.y}
                x2={draft.to.x}
                y2={draft.to.y}
                stroke={DEFAULT_LINE_COLOR}
                strokeWidth={2}
                strokeDasharray="6 4"
              />
            )}
          </svg>

          {board.skills.map((skill) => {
            const pos = posOf(skill);
            return (
              <SkillNode
                key={skill.id}
                skill={skill}
                position={pos}
                justUnlocked={justUnlocked.has(skill.id)}
                dragging={dragId === skill.id}
                connectTarget={targetId === skill.id}
                handleProps={bindHandle(skill.id, pos)}
                dragProps={bind(skill.id, pos)}
                onClick={handleNodeClick}
              />
            );
          })}
        </div>

        {skillCount === 0 && (
          <div className="board-empty">
            <p>No skills on this board yet.</p>
            {onAddSkill && (
              <button
                type="button"
                onClick={() => onAddSkill(skillCount, centreOfView())}
              >
                Add your first skill
              </button>
            )}
          </div>
        )}

        <div className="board-controls">
          <button
            type="button"
            onClick={() => zoomBy(1.2)}
            aria-label="Zoom in"
          >
            +
          </button>
          <button
            type="button"
            onClick={() => zoomBy(1 / 1.2)}
            aria-label="Zoom out"
          >
            −
          </button>
          <button type="button" onClick={fitView}>
            Fit
          </button>
        </div>
      </div>

      {pendingConnection && (
        <AddSkillConnectionModal
          skillBoardId={boardId}
          fromSkillId={pendingConnection.fromSkillId}
          toSkillId={pendingConnection.toSkillId}
          onClose={() => setPendingConnection(null)}
          onConnected={() => {
            setPendingConnection(null);
            setLocalReload((k) => k + 1);
          }}
        />
      )}

      {removeConnection && (
        <RemoveSkillConnectionModal
          skillConnectionId={removeConnection}
          onClose={() => setRemoveConnection(null)}
          onRemoved={() => {
            setRemoveConnection(null);
            setLocalReload((k) => k + 1);
          }}
        />
      )}
    </div>
  );
}
