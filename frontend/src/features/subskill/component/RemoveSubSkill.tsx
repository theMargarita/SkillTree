import React, { useEffect, useState } from "react";
import { removeSubSkill } from "../api/subskillApi";

interface RemoveSubSkillModalProp {
  subSkillId: string;
  subSkillName: string;
  onClose: () => void;
  onRemoved: () => void;
}

export default function RemoveSubSkillModal({
  subSkillId,
  subSkillName,
  onClose,
  onRemoved,
}: RemoveSubSkillModalProp) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  async function handleSubmit(e: React.SubmitEvent<HTMLElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await removeSubSkill(subSkillId);
      onRemoved();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to remove subskill",
      );
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="remove-skill-title"
      >
        <h2 id="remove-skill-title">X</h2>

        <p>
          Are you sure you want to remove <strong>{subSkillName}</strong>?
        </p>
        {error && <p className="modal__error">{error}</p>}

        <form onSubmit={handleSubmit} className="modal__form">
          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>

            <button type="submit" disabled={submitting}>
              {submitting ? "Removing..." : "Remove skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
