import { useEffect, useState } from "react";
import type { SubSkillResponse } from "../../../shared/types/subskills";
import { updateSubskill } from "../api/subskillApi";

interface UpdateSubSkillModalProps {
  subSkillId: string;
  skillId: string;
  initialName: string;
  initialDescription: string;
  initialOrderIndex: number;
  initialProgressText: string | null;
  initialProgressURL: string | null;
  initialColor: string | null;
  onClose: () => void;
  onUpdate: (updated: SubSkillResponse) => void;
}

export default function UpdateSubSkillModal({
  subSkillId,
  skillId,
  initialName,
  initialDescription,
  initialOrderIndex,
  initialProgressText,
  initialProgressURL,
  initialColor,
  onClose,
  onUpdate,
}: UpdateSubSkillModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) {
        onClose();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  const canSubmit = !submitting && name.trim() !== "";

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const updated = await updateSubskill(subSkillId, {
        skillId,
        name: name.trim(),
        description: description.trim(),
        progressText: initialProgressText,
        progressURL: initialProgressURL,
        orderIndex: initialOrderIndex,
        color: initialColor,
      });

      onUpdate(updated);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update subskill");
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-subskill-title"
      >
        <h2 id="update-subskill-title">Update subskill</h2>

        <form onSubmit={handleSubmit} className="modal__form">
          <label>
            Name
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </label>

          <label>
            Description
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              rows={3}
            />
          </label>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit}>
              {submitting ? "Updating..." : "Update subskill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
