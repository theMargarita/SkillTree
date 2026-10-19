import { useEffect, useState } from "react";
import "./board.css";
import type { SkillResponse } from "../../types/skills";
import type { SkillBoardDetailResponse } from "../../types/board";
import SkillNode from "./skillDetail/SkillNode";

const API_URL = import.meta.env.VITE_API_BASE as string;

interface BoardCanvasProps {
  boardId: string;
  onSkillClick?: (skill: SkillResponse) => void;
  reloadKey?: number;
  onAddSkill?: () => void;
}

export default function BoardCanvas({
  boardId,
  onSkillClick,
  reloadKey = 0,
  onAddSkill,
}: BoardCanvasProps) {
  const [board, setBoard] = useState<SkillBoardDetailResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/SkillBoard/${boardId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<SkillBoardDetailResponse>;
      })
      .then((data) => {
        setBoard(data);
        setError(null);
      })
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unknown error"),
      )
      .finally(() => setLoading(false));
  }, [boardId, reloadKey]);

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!board) return null;

  const completedCount = board.skills.filter(
    (skill) => skill.status === "Completed",
  ).length;
  const skillById = new Map(board.skills.map((skill) => [skill.id, skill]));

  return (
    <div className="board">
      <div className="board-header">
        <h1>{board.name}</h1>
        <span className="board-progress">
          {completedCount}/{board.skills.length} COMPLETE
        </span>
      </div>

      <div className="board-canvas">
        <svg className="board-connections">
          {board.connections.map((connection) => {
            const from = skillById.get(connection.fromSkillId);
            const to = skillById.get(connection.toSkillId);
            if (!from || !to) return null;

            return (
              <line
                key={connection.id}
                x1={from.positionX}
                y1={from.positionY}
                x2={to.positionX}
                y2={to.positionY}
                stroke={connection.lineColor ?? "#3a3d42"}
                strokeWidth={2}
                strokeDasharray={
                  connection.lineStyle === "dashed" ? "6 4" : undefined
                }
              />
            );
          })}
        </svg>
        {board.skills.length === 0 && (
          <div className="board-empty">
            <p>No skills on this board yet.</p>
            {onAddSkill && (
              <button type="button" onClick={onAddSkill}>
                Add your first skill
              </button>
            )}
          </div>
        )}
        {board.skills.map((skill) => (
          <SkillNode key={skill.id} skill={skill} onClick={onSkillClick} />
        ))}
      </div>
    </div>
  );
}
