// src/pages/BoardCanvas.tsx - adds the "+ Add skill" button to the header
import { useEffect, useState } from "react";
import "../styles/board.css";
import type { SkillResponse } from "../../../shared/types/skills";
import type { SkillBoardDetailResponse } from "../../../shared/types/board";
import SkillNode from "../../skill-detail/components/SkillNode";

const API_URL = import.meta.env.VITE_API_BASE as string;

interface BoardCanvasProps {
  boardId: string;
  onSkillClick?: (skill: SkillResponse) => void;
  reloadKey?: number;
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
  }, [boardId, reloadKey]);

  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!board) return null;

  const completedCount = board.skills.filter(
    (s) => s.status === "Completed",
  ).length;
  const skillById = new Map(board.skills.map((s) => [s.id, s]));
  const skillCount = board.skills.length;

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

      <div className="board-canvas">
        <svg className="board-connections">
          {board.connections.map((conn) => {
            const from = skillById.get(conn.fromSkillId);
            const to = skillById.get(conn.toSkillId);
            if (!from || !to) return null;

            return (
              <line
                key={conn.id}
                x1={from.positionX}
                y1={from.positionY}
                x2={to.positionX}
                y2={to.positionY}
                stroke={conn.lineColor ?? "#3a3d42"}
                strokeWidth={2}
                strokeDasharray={
                  conn.lineStyle === "dashed" ? "6 4" : undefined
                }
              />
            );
          })}
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

        {board.skills.map((skill) => (
          <SkillNode key={skill.id} skill={skill} onClick={onSkillClick} />
        ))}
      </div>
    </div>
  );
}
