import React, { useEffect } from "react";
import { useState } from "react";
import { removeSkill } from "../api/skillApi";

interface RemoveSkillModalProp {
  skillId: string;
  skillName: string;
  onClose: () => void;
  onRemoved: () => void;
}

export default function RemoveSkillModal({
  skillId,
  skillName,
  onClose,
  onRemoved,
}: RemoveSkillModalProp) {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape" && !submitting) {
        onClose();
      }
      //does not fully work - okey for now
      if (event.key === "Delete" && submitting) onRemoved();
      if (event.key === "Enter" && submitting) onRemoved();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  async function handleSubmit(e: React.SubmitEvent<HTMLElement>) {
    e.preventDefault();
    setSubmitting(true);
    setError(null);

    try {
      await removeSkill(skillId);
      onRemoved();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Unable to remove skill",
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
        <h2 id="remove-skill-title">Remove skill?</h2>

        <p>
          Are you sure you want to remove <strong>{skillName}</strong>?
        </p>

        <p>The skill's subskills and connections may also be removed.</p>

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
