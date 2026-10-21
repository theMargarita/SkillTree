// src/features/CreateBoardModal.tsx
import { useEffect, useState } from "react";
import type { SkillBoardResponse } from "../../../shared/types/board";
import { createBoard } from "../api/boardsApi";

// null = no colour
const SWATCHES: (string | null)[] = [
  null,
  "#2bd4c4",
  "#f4c542",
  "#ff5a1f",
  "#6c8cff",
  "#b56cff",
  "#e8e6e1",
];

interface CreateBoardModalProps {
  userId: string;
  onClose: () => void;
  onCreated: (board: SkillBoardResponse) => void;
}

export default function CreateBoardModal({
  userId,
  onClose,
  onCreated,
}: CreateBoardModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [color, setColor] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Esc closes the dialog
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim()) return;

    setSubmitting(true);
    setError(null);
    try {
      const created = await createBoard(userId, {
        name: name.trim(),
        description: description.trim(),
        backgroundColor: color,
      });
      onCreated(created);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Create board"
        onClick={(e) => e.stopPropagation()} // clicks inside don't close it
      >
        <h2>New board</h2>

        <form onSubmit={handleSubmit} className="modal__form">
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={100}
              autoFocus
              required
            />
          </label>

          <label>
            Description (optional)
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              maxLength={500}
              rows={3}
            />
          </label>

          <div>
            <span className="modal__label">Colour</span>
            <div className="swatches">
              {SWATCHES.map((s) => (
                <button
                  type="button"
                  key={s ?? "none"}
                  className={`swatch ${color === s ? "is-selected" : ""} ${s === null ? "swatch--none" : ""}`}
                  style={s ? { background: s } : undefined}
                  onClick={() => setColor(s)}
                  aria-label={s ?? "No colour"}
                  title={s ?? "No colour"}
                />
              ))}
            </div>
          </div>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={submitting || !name.trim()}>
              {submitting ? "Creating..." : "Create board"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
