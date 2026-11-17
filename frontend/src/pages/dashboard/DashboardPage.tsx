import { Link } from "react-router-dom";
import CreateBoardModal from "../../features/board/components/CreateBoardModal";
import type { SkillBoardResponse } from "../../shared/types/board";
import { useEffect, useState } from "react";
import { getBoardsForUser } from "../../features/board/api/boardsApi";
import { CURRENT_USER_ID } from "../../shared/config";

export default function DashboardPage() {
  const [boards, setBoards] = useState<SkillBoardResponse[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getBoardsForUser(CURRENT_USER_ID)
      .then(setBoards)
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Could not load boards");
      });
  }, []);

  //board creation
  function handleCreated(boards: SkillBoardResponse) {
    setBoards((previous) => [boards, ...previous]);
    setShowCreateModal(false);
  }

  return (
    <main>
      <h1>My boards</h1>

      <button type="button" onClick={() => setShowCreateModal(true)}>
        Create Board
      </button>

      {error && <p>{error}</p>}

      {boards.length === 0 && <p>No boards yet</p>}

      <ul>
        {boards.map((board) => (
          <li key={board.id}>
            <Link to={`/boards/${board.id}`}>{board.name}</Link>
          </li>
        ))}
      </ul>

      {showCreateModal && (
        <CreateBoardModal
          userId={CURRENT_USER_ID}
          onClose={() => setShowCreateModal(false)}
          onCreated={handleCreated}
        />
      )}
    </main>
  );
}
