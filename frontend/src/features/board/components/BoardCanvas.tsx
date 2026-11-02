import { useEffect, useRef, useState } from "react";
import "../styles/board.css";
import type {
  skillPosition,
  SkillResponse,
} from "../../../shared/types/skills";
import type { SkillBoardDetailResponse } from "../../../shared/types/board";
import SkillNode from "../../skill-detail/components/SkillNode";
import { API_URL } from "../../../shared/config";
import { useNodeDrag } from "../../skill/hooks/useNodeDrag";
import { updateSkillPosition } from "../../skill/api/skillApi";
import { useConnectDrag } from "../../skill/hooks/useConnectDrag";
import { createSkillConnection } from "../../skillConnecton/api/skillConnectionApi";
import { edgePoint } from "../../skillConnecton/utlis/geometry";

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
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // only true for the first load
  const [localReload, setLocalReload] = useState(0);
  const [moveError, setMoveError] = useState<string | null>(null);
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

  const { draft, targetId, bindHandle } = useConnectDrag({
    canvasRef,
    onConnect: async (fromId, toId) => {
      setMoveError(null);
      await createSkillConnection({
        skillBoardId: boardId,
        fromSkillId: fromId,
        toSkillId: toId,
        lineColor: DEFAULT_LINE_COLOR,
        lineStyle: "solid",
      });
      // refetch: the new line appears AND the target's status (Locked/Unlocked) is recomputed
      setLocalReload((k) => k + 1);
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

  const colors = Array.from(
    new Set(board.connections.map((c) => c.lineColor ?? DEFAULT_LINE_COLOR)),
  );

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
            const color = conn.lineColor ?? DEFAULT_LINE_COLOR;

            return (
              <g key={conn.id} className="connection">
                <line
                  className="connection-line"
                  x1={start.x}
                  y1={start.y}
                  x2={end.x}
                  y2={end.y}
                  stroke={color}
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
    </div>
  );
}
