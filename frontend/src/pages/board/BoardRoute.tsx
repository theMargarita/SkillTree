// src/pages/BoardRoute.tsx - reads the board id from the URL (/boards/:boardId)
import { Link, useParams } from "react-router-dom";
import BoardPage from "./BoardPage";

export default function BoardRoute() {
  const { boardId } = useParams<{ boardId: string }>();

  if (!boardId) return <p>Missing board id.</p>;

  return (
    <div>
      <Link to="/" className="back-link">
        ← Boards
      </Link>
      <BoardPage key={boardId} boardId={boardId} />
    </div>
  );
}
