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
import { connectionPath, edgePoint } from "../../skillConnecton/utlis/geometry";
import AddSkillConnectionModal from "../../skillConnecton/component/AddSkillConnection";
import RemoveSkillConnectionModal from "../../skillConnecton/component/RemoveSkillConnection";

const DEFAULT_LINE_COLOR = "#8a93a3";

interface BoardCanvasProps {
  boardId: string;
  onSkillClick?: (skill: SkillResponse) => void;
  reloadKey?: number;
  //receives how many skills the board has right now
  onAddSkill?: (existingCount: number) => void;
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
  const [loading, setLoading] = useState(true); // only true for the first load
  const [localReload, setLocalReload] = useState(0);
  const [moveError, setMoveError] = useState<string | null>(null);
  const [removeConnection, setRemoveConnection] = useState<string | null>(null);
  const canvasRef = useRef<HTMLDivElement>(null);

  const { bind, overrides, dragId, shouldIgnoreClick } = useNodeDrag({
    canvasRef,
    onCommit: async (id, pos) => {
      setMoveError(null);
      await updateSkillPosition(id, pos.x, pos.y);
      // saved: put the new position into the board data (the hook then drops its override)
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

  const prevStatuses = useRef<Map<string, SkillStatus>>(new Map());
  const [justUnlocked, setJustUnlocked] = useState<Set<string>>(new Set());

  const load = useCallback(async () => {
    const res = await fetch(`${API_URL}/api/SkillBoard/${boardId}`);
    if (!res.ok) throw new Error(`Request failed: ${res.status}`);
    const data = (await res.json()) as SkillBoardDetailResponse;

    // Locked -> not locked since the last load = just unlocked
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
  }, [boardId]);

  useEffect(() => {
    load()
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error unknown"),
      )
      .finally(() => setLoading(false));
  }, [load]);

  // stop the animation after it has played
  useEffect(() => {
    if (justUnlocked.size === 0) return;
    const t = setTimeout(() => setJustUnlocked(new Set()), 1800);
    return () => clearTimeout(t);
  }, [justUnlocked]);

  const { draft, targetId, bindHandle } = useConnectDrag({
    canvasRef,
    onConnect: (fromSkillId, toSkillId) => {
      setPendingConnection({ fromSkillId, toSkillId });
    },
    onError: (err) =>
      setMoveError(
        `Could not connect${err instanceof Error ? `: ${err.message}` : "."}`,
      ),
  });

  useEffect(() => {
    fetch(`${API_URL}/api/SkillBoard/${boardId}`)
      .then((res) => {
        if (res.status === 404) throw new Error("Board not found");
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<SkillBoardDetailResponse>;
      })
      .then((data) => {
        setBoard(data);
        setError(null);
      })
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error unknown"),
      )
      .finally(() => setLoading(false));
  }, [boardId, reloadKey, localReload]);

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!board) return null;

  const completedCount = board.skills.filter(
    (s) => s.status === "Completed",
  ).length;
  const skillById = new Map(board.skills.map((s) => [s.id, s]));
  const skillCount = board.skills.length;

  const posOf = (s: SkillResponse): skillPosition =>
    overrides[s.id] ?? { x: s.positionX, y: s.positionY };

  // const colors = Array.from(
  //   new Set(board.connections.map((c) => c.lineColor ?? DEFAULT_LINE_COLOR)),
  // );

  return (
    <div className="board">
      <div className="board-header">
        <h1>{board.name}</h1>
        <div className="board-header__actions">
          {onAddSkill && (
            <button type="button" onClick={() => onAddSkill(skillCount)}>
              + Add skill
            </button>
          )}
          <span className="board-progress">
            {completedCount}/{skillCount} COMPLETE
          </span>
        </div>
      </div>

      <svg className="board-connections">
        <defs>
          <marker
            id="arrow-dim"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#3a3d42" />
          </marker>
          <marker
            id="arrow-lit"
            viewBox="0 0 10 10"
            refX="9"
            refY="5"
            markerWidth="7"
            markerHeight="7"
            orient="auto-start-reverse"
          >
            <path d="M0,0 L10,5 L0,10 z" fill="#f4c542" />
          </marker>
        </defs>

        {board.connections.map((conn) => {
          const from = skillById.get(conn.fromSkillId);
          const to = skillById.get(conn.toSkillId);
          if (!from || !to) return null;

          const fromPos = { x: from.positionX, y: from.positionY };
          const toPos = { x: to.positionX, y: to.positionY };
          const a = edgePoint(fromPos, toPos);
          const b = edgePoint(toPos, fromPos, 8); // stops short so the arrow stays visible

          const lit = from.status === "Completed";

          return (
            <line
              key={conn.id}
              x1={a.x}
              y1={a.y}
              x2={b.x}
              y2={b.y}
              stroke={lit ? "#f4c542" : "#3a3d42"}
              strokeWidth={2}
              strokeDasharray={conn.lineStyle === "dashed" ? "6 4" : undefined}
              markerEnd={`url(#${lit ? "arrow-lit" : "arrow-dim"})`}
            />
          );
        })}
      </svg>
      {moveError && <p className="board-error">{moveError}</p>}

      <div className="board-canvas" ref={canvasRef}>
        <svg className="board-connections">
          <defs>
            <marker
              id="arrow-default"
              viewBox="0 0 10 10"
              refX="10"
              refY="5"
              markerWidth="12"
              markerHeight="12"
              markerUnits="userSpaceOnUse"
              orient="auto"
            >
              <path d="M 0 0 L 10 5 L 0 10 z" fill={DEFAULT_LINE_COLOR} />
            </marker>
            {/* {colors.map((c, i) => (
              <marker
                key={c}
                id={`arrow-${i}`}
                viewBox="0 0 10 10"
                refX="10"
                refY="5"
                markerWidth="12"
                markerHeight="12"
                markerUnits="userSpaceOnUse"
                orient="auto"
              >
                <path d="M 0 0 L 10 5 L 0 10 z" fill={c} />
              </marker>
            ))} */}
          </defs>

          {board.connections.map((conn) => {
            const from = skillById.get(conn.fromSkillId);
            const to = skillById.get(conn.toSkillId);

            if (!from || !to) return null;

            const start = edgePoint(posOf(from), posOf(to));
            const end = edgePoint(posOf(to), posOf(from));
            // const color = conn.lineColor ?? DEFAULT_LINE_COLOR;
            const path = connectionPath(start, end);

            return (
              <g key={conn.id} className="connection">
                <line
                  className="connection-line"
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={path}
                  strokeWidth={2}
                  strokeDasharray={
                    conn.lineStyle === "dashed" ? "6 4" : undefined
                  }
                  markerEnd="url(#arrow-default)"
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
                  style={{ cursor: "pointer" }}
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

        {skillCount === 0 && (
          <div className="board-empty">
            <p>No skills on this board yet.</p>
            {onAddSkill && (
              <button type="button" onClick={() => onAddSkill(skillCount)}>
                Add your first skill
              </button>
            )}
          </div>
        )}
        {board.skills.map((skill) => {
          const pos = posOf(skill);
          return (
            <SkillNode
              key={skill.id}
              skill={skill}
              position={pos}
              drag={dragId === skill.id}
              connectTarget={targetId === skill.id}
              dragProps={bind(skill.id, pos)}
              handleProps={bindHandle(skill.id, pos)}
              shouldIgnoreClick={shouldIgnoreClick}
              onClick={onSkillClick}
            />
          );
        })}
      </div>

      {pendingConnection && (
        <AddSkillConnectionModal
          skillBoardId={boardId}
          fromSkillId={pendingConnection.fromSkillId}
          toSkillId={pendingConnection.toSkillId}
          onClose={() => setPendingConnection(null)}
          onConnected={() => {
            setPendingConnection(null);
            setLocalReload((key) => key + 1);
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
