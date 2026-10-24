import React, { useEffect, useState } from "react";
import type { SubSkillResponse } from "../../../shared/types/subskills";
import { createSubSkill, removeSubSkill } from "../api/subskillApi";

interface AddSubSkillModalProps {
  skillId: string;
  onClose: () => void;
  onCreated: (created: SubSkillResponse) => void;
}

export default function AddSubSkillModal({
  skillId,
  onClose,
  onCreated,
}: AddSubSkillModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
      // if (e.key === "Enter" && submitting) onCreated();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const canSubmit = !submitting && name.trim() !== "";

  // dont know if i need htmlformelement but sure
  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    let createdSubSkillId: string | null = null;

    try {
      const subSkill = await createSubSkill({
        skillId,
        name: name.trim(),
        description: description.trim(),
        progressText: null,
        progressURL: null,
        orderIndex: 0,
        color: null,
      });
      createdSubSkillId = subSkill.id;

      onCreated(subSkill);
    } catch (error) {
      const message = error instanceof Error ? error.message : "Uknown error";

      if (createdSubSkillId) {
        try {
          await removeSubSkill(createdSubSkillId);
          setError(`${message}: Nothing was saved, try again. `);
        } catch (error) {
          setError(`${message}. \n The subskill may have been saved without`);
        }
      } else {
        setError(message);
      }
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-label="Add subskill"
      >
        <h2>Add subskill</h2>

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
              rows={2}
            />
          </label>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit}>
              {submitting ? "Saving..." : "Add subskill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
