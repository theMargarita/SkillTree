import { useState } from "react";
import type { SubSkillResponse } from "../../../../shared/types/subskills";
import ProgressEntryForm from "../../../progress/components/ProgressEntryForm";
import { toggleSubSkill } from "../../api/subskillApi";
import ImageLightbox from "../../../../shared/components/ImageLightbox";

interface SubSkillDetailProps {
  subSkill: SubSkillResponse;
  onBack: () => void;
  onUpdated: (updated: SubSkillResponse) => void;
  onEdit: () => void;
}

export default function SubSkillDetail({
  subSkill,
  onBack,
  onUpdated,
  onEdit,
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
      <button type="button" className="back-button" onClick={onBack}>
        ← Back
      </button>

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
        >
          <img
            className="goal-image"
            src={subSkill.imageUrl}
            alt={subSkill.name}
            loading="lazy"
          />
        </button>
      )}

      {subSkill.description && <p>{subSkill.description}</p>}
      <button type="button" onClick={onEdit}>
        Edit
      </button>
      <div>
        <button type="button" onClick={handleToggle} disabled={toggling}>
          {toggling
            ? "Saving..."
            : subSkill.isComplete
              ? "Mark incomplete"
              : "Mark complete"}
        </button>
        {error && <p className="modal__error">{error}</p>}
      </div>

      <h4>Progress</h4>
      <ProgressEntryForm subSkillId={subSkill.id} />

      {imageOpen && subSkill.imageUrl && (
        <ImageLightbox
          src={subSkill.imageUrl}
          alt={subSkill.name}
          onClose={() => setImageOpen(false)}
        />
      )}
    </div>
  );
}
