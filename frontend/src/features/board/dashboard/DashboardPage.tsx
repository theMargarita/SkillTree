import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "./dashboard.css";
import type { SkillBoardResponse } from "../../../shared/types/board";
import { deleteBoard, getBoardsForUser, updateBoard } from "../api/boardsApi";
import CreateBoardModal from "../components/CreateBoardModal";
import { getGuestId } from "../../users/guest/Guest";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string | null>(null);
  const [boards, setBoards] = useState<SkillBoardResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const [attempt, setAttempt] = useState(0); // bump to retry

  useEffect(() => {
    let cancelled = false;
    // setLoading(true);
    // setError(null);

    getGuestId()
      .then(async (id) => {
        const list = await getBoardsForUser(id);
        if (cancelled) return;
        setUserId(id);
        setBoards(list);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setError(
            err instanceof Error ? err.message : "Could not load boards",
          );
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [attempt]);

  function handleCreated(board: SkillBoardResponse) {
    setBoards((prev) => [board, ...prev]);
    setShowCreate(false);
  }

  //handle updating of board
  async function handleRename(board: SkillBoardResponse) {
    const name = window.prompt("Board name", board.name)?.trim();
    if (!name || name === board.name) return;
    try {
      const updated = await updateBoard(board.id, {
        name,
        description: board.description,
        backgroundColor: board.backgroundColor,
      });
      // the update response has no skill count, so keep the one we had
      setBoards((prev) =>
        prev.map((b) =>
          b.id === board.id ? { ...updated, skillCount: b.skillCount } : b,
        ),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not rename board");
    }
  }

  //handle deletionof board
  async function handleDelete(board: SkillBoardResponse) {
    if (!window.confirm(`Delete "${board.name}" and everything on it?`)) return;
    try {
      await deleteBoard(board.id);
      setBoards((prev) => prev.filter((b) => b.id !== board.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not delete board");
    }
  }

  return (
    <main className="dashboard">
      <header className="dashboard__header">
        <h1>My boards</h1>
        <span className="dashboard__guest">Guest</span>
      </header>

      <p className="dashboard__note">
        Guest boards are saved in this browser. Clearing site data will remove
        access to them.
      </p>

      {error && (
        <p className="dashboard__error">
          {error}{" "}
          <button
            type="button"
            onClick={() => {
              setError(null);
              setLoading(true);
              setAttempt((n) => n + 1);
            }}
          >
            Retry
          </button>
        </p>
      )}

      {loading ? (
        <p>Loading boards...</p>
      ) : (
        <>
          {!error && boards.length === 0 && (
            <p className="dashboard__empty">
              No boards yet. Create your first one.
            </p>
          )}

          <ul className="board-grid">
            {boards.map((board) => (
              <li key={board.id} className="board-card">
                {board.backgroundColor && (
                  <span
                    className="board-card__strip"
                    style={{ background: board.backgroundColor }}
                  />
                )}

                <Link to={`/boards/${board.id}`} className="board-card__link">
                  <h2>{board.name}</h2>
                  {board.description && <p>{board.description}</p>}
                  <span className="board-card__meta">
                    {board.skillCount}{" "}
                    {board.skillCount === 1 ? "skill" : "skills"} · updated{" "}
                    {new Date(board.updatedAt).toLocaleDateString()}
                  </span>
                </Link>

                <div className="board-card__actions">
                  <button type="button" onClick={() => handleRename(board)}>
                    Rename
                  </button>
                  <button
                    className="remove-btn"
                    type="button"
                    onClick={() => handleDelete(board)}
                  >
                    x
                  </button>
                </div>
              </li>
            ))}

            {userId && (
              <li>
                <button
                  type="button"
                  className="board-card board-card--add"
                  onClick={() => setShowCreate(true)}
                >
                  + New board
                </button>
              </li>
            )}
          </ul>
        </>
      )}

      {showCreate && userId && (
        <CreateBoardModal
          userId={userId}
          onClose={() => setShowCreate(false)}
          onCreated={handleCreated}
        />
      )}
    </main>
  );
}
