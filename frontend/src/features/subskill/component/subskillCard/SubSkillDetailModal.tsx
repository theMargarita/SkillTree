import { useState } from "react";
import type { SubSkillResponse } from "../../../../shared/types/subskills";
import ProgressEntryForm from "../../../progress/components/ProgressEntryForm";
import { toggleSubSkill } from "../../api/subskillApi";
import Modal from "../../../../shared/components/modal";

interface SubSkillDetailProps {
  subSkill: SubSkillResponse;
  onBack: () => void;
  onUpdated: (updated: SubSkillResponse) => void;
  onEdit: () => void;
  onRemove: () => void;
}

export default function SubSkillDetail({
  subSkill,
  onBack,
  onUpdated,
  onEdit,
  onRemove,
}: SubSkillDetailProps) {
  const [toggling, setToggling] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [imageOpen, setImageOpen] = useState(false);

  async function handleToggle() {
    setToggling(true);
    setError(null);
    try {
      onUpdated(await toggleSubSkill(subSkill.id));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setToggling(false);
    }
  }

  return (
    <div className="subskill-detail">
      <div className="subskill-detail__actions">
        <button type="button" onClick={onBack}>
          ← Back
        </button>

        <button type="button" onClick={onEdit}>
          Edit
        </button>

        <button type="button" onClick={onRemove}>
          Remove
        </button>
        <button type="button" onClick={handleToggle} disabled={toggling}>
          {toggling
            ? "Saving..."
            : subSkill.isComplete
              ? "Mark incomplete"
              : "Mark complete"}
        </button>
      </div>
      <div className="subskill-detail__title">
        <h3>{subSkill.name}</h3>
        <span
          className={`subskill-detail__badge ${subSkill.isComplete ? "is-complete" : ""}`}
        >
          {subSkill.isComplete ? "✓ Done" : "To do"}
        </span>
      </div>

      {subSkill.imageUrl && (
        <button
          type="button"
          className="image-button"
          onClick={() => setImageOpen(true)}
          aria-label="Enlarge image"
        ></button>
      )}

      {subSkill.description?.trim() ? (
        <div className="subskill-detail__description">
          <h4>Description</h4>
          <p>{subSkill.description}</p>
        </div>
      ) : (
        <p className="muted">No description provided.</p>
      )}

      {error && <p className="modal__error">{error}</p>}

      <h4>Progress</h4>
      <ProgressEntryForm subSkillId={subSkill.id} />

      <Modal
        isOpen={imageOpen}
        onClose={() => setImageOpen(false)}
        className="image-dialog"
      >
        {subSkill.imageUrl && (
          <img src={subSkill.imageUrl} alt={subSkill.name} />
        )}
      </Modal>
    </div>
  );
}
