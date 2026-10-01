import { useEffect, useState } from "react";
import type { SkillBoardDetailResponse, SkillResponse } from "../types/board";
import SkillNode from "../features/skillNode";
import "./Board.css";

const API_URL = import.meta.env.VITE_API_BASE as string;

interface BoardCanvasProps {
  boardId: string;
  onSkillClick?: (skill: SkillResponse) => void;
}

export default function BoardCanavas({
  boardId,
  onSkillClick,
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
      .then(setBoard)
      .catch((e: unknown) =>
        setError(e instanceof Error ? e.message : "Error unknown"),
      )
      .finally(() => setLoading(false));
  }, [boardId]);
  if (loading) return <p>Loading board...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!board) return null;

  const completedCount = board.skills.filter(
    (s) => s.status === "Completed",
  ).length;
  const skillById = new Map(board.skills.map((s) => [s.id, s]));

  return (
    <div className="board">
      <div className="board-header">
        <h1>{board.name}</h1>
        <span className="board-progress">
          {completedCount / board.skills.length} COMPLETE
        </span>
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
                  conn.lineStyle === "dashed" ? " 6 4" : undefined
                }
              ></line>
            );
          })}
        </svg>
        {board.skills.map((skill) => (
          <SkillNode key={skill.id} skill={skill} onClick={onSkillClick} />
        ))}
      </div>
    </div>
  );
}
