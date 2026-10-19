// src/features/BoardCard.tsx
import type { CSSProperties } from "react";
import { Link } from "react-router-dom";
import type { SkillBoardResponse } from "../../types/board";

interface BoardCardProps {
  board: SkillBoardResponse;
}

export default function BoardCard({ board }: BoardCardProps) {
  // the board colour is used as an accent stripe; swap to a background later if you prefer
  const style = {
    "--card-accent": board.backgroundColor ?? "var(--board-border)",
  } as CSSProperties;

  return (
    <Link to={`/boards/${board.id}`} className="board-card" style={style}>
      <h2 className="board-card__name">{board.name}</h2>
      {board.description && (
        <p className="board-card__desc">{board.description}</p>
      )}
      <div className="board-card__meta">
        <span>
          {board.skillCount} {board.skillCount === 1 ? "skill" : "skills"}
        </span>
        <span>Updated {new Date(board.updatedAt).toLocaleDateString()}</span>
      </div>
    </Link>
  );
}
