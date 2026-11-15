import { useEffect, useState } from "react";
import type { SkillResponse, SkillShape } from "../../../shared/types/skills";
import { updateSkill } from "../api/skillApi";
import ColorSwatches from "../../../shared/components/ColorSwatches";
import ImagePicker from "../../../shared/components/ImagePicker";

interface UpdateSkillModalProps {
  skillId: string;
  boardId: string;
  initialName: string;
  initialDescription: string;
  newImageURL: string | null;
  newPositionX: number;
  newPositionY: number;
  newColor: string | null;
  icon: string | null;
  shape: SkillShape;
  onClose: () => void;
  onUpdate: (updated: SkillResponse) => void;
}

export default function UpdateSkillModal({
  skillId,
  boardId,
  initialName,
  initialDescription,
  newImageURL,
  newPositionX,
  newPositionY,
  newColor,
  icon,
  shape,
  onClose,
  onUpdate,
}: UpdateSkillModalProps) {
  const [name, setName] = useState(initialName);
  const [desc, setDesc] = useState(initialDescription);
  const [color, setColor] = useState<string | null>(newColor);
  const [submitting, setSubmitting] = useState(false);
  const [image, setImage] = useState<string | null>(newImageURL);
  const [imageBusy, setImageBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
      // if(e.key === "Enter" && submitting) onUpdate();
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [onClose, submitting]);

  const canSubmit = !submitting && !imageBusy && name.trim() !== "";

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    try {
      const updated = await updateSkill(skillId, {
        skillBoardId: boardId,
        name: name.trim(),
        description: desc.trim(),
        color: color,
        positionX: newPositionX,
        positionY: newPositionY,
        imageUrl: image,
        icon: icon,
        shape,
      });
      onUpdate(updated);
    } catch (error) {
      setError(error instanceof Error ? error.message : "Unknown error");
      setSubmitting(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div
        className="modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="update-skill-title"
      >
        <h2 id="update-skill-title">Update skill</h2>

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
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              rows={3}
            />
          </label>
          <ImagePicker
            value={image}
            onChange={setImage}
            onBusyChange={setImageBusy}
          />

          <div>
            <span className="modal__label">Color</span>
            <ColorSwatches value={color} onChange={setColor} />
          </div>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>

            <button type="submit" disabled={!canSubmit}>
              {submitting ? "Updating..." : "Update skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
