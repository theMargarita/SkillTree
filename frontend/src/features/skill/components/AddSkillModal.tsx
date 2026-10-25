import { useEffect, useState } from "react";
import type { SkillShape } from "../../../shared/types/skills";
import ColorSwatches from "../../../shared/components/ColorSwatches";
import { createSkill, removeSkill } from "../api/skillApi";
import { createSubSkill } from "../../subskill/api/subskillApi";
import type { SubSkillRow } from "../../../shared/types/subskills";
import "../../../shared/styles/modal.css";

const SHAPES: SkillShape[] = ["Circle", "Square", "Hexagon", "Diamond"];
const MAX_SUBSKILLS = 20;

let nextRowId = 1;
const newRow = (): SubSkillRow => ({
  id: nextRowId++,
  name: "",
  description: "",
});

// TEMPORARY: 4 per row, 3 rows, then it wraps (so later skills may overlap until
function nextPosition(existingCount: number) {
  const col = existingCount % 4;
  const row = Math.floor(existingCount / 4) % 3;
  return { x: 160 + col * 220, y: 110 + row * 180 };
}

interface AddSkillModalProps {
  boardId: string;
  existingCount: number;
  onClose: () => void;
  onCreated: () => void;
}

export default function AddSkillModal({
  boardId,
  existingCount,
  onClose,
  onCreated,
}: AddSkillModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [shape, setShape] = useState<SkillShape>("Circle");
  const [color, setColor] = useState<string | null>(null);
  const [rows, setRows] = useState<SubSkillRow[]>([newRow()]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !submitting) onClose();
      if (e.key === "Enter" && submitting) onCreated();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onClose, submitting]);

  const filled = rows.filter((r) => r.name.trim());
  const canSubmit = !submitting && name.trim() !== "" && filled.length >= 1;

  function updateRow(id: number, patch: Partial<SubSkillRow>) {
    setRows((prev) => prev.map((r) => (r.id === id ? { ...r, ...patch } : r)));
  }

  async function handleSubmit(e: React.SubmitEvent) {
    e.preventDefault();
    if (!canSubmit) return;

    setSubmitting(true);
    setError(null);

    const { x, y } = nextPosition(existingCount);
    let createdSkillId: string | null = null;

    try {
      const skill = await createSkill({
        skillBoardId: boardId,
        name: name.trim(),
        description: description.trim(),
        imageUrl: null,
        positionX: x,
        positionY: y,
        color,
        icon: null,
        shape,
      });
      createdSkillId = skill.id;

      // one at a time, so OrderIndex follows the list order
      //with eventually add image url prop into backend as well
      for (let i = 0; i < filled.length; i++) {
        await createSubSkill({
          skillId: skill.id,
          name: filled[i].name.trim(),
          description: filled[i].description.trim(),
          progressURL: null,
          progressText: null,
          // imageUrl: null,
          orderIndex: i,
          color: null,
        });
      }

      onCreated();
    } catch (err) {
      const message = err instanceof Error ? err.message : "Unknown error";

      if (createdSkillId) {
        // roll back: removing the skill also removes any subskills already created (cascade)
        try {
          await removeSkill(createdSkillId);
          setError(`${message}. Nothing was saved, try again.`);
        } catch {
          setError(
            `${message}. The skill may have been saved without all its subskills - check the board and delete it if needed.`,
          );
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
        className="modal modal--wide"
        role="dialog"
        aria-modal="true"
        aria-label="Add skill"
      >
        <h2>Add skill</h2>

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

          <div className="modal__row">
            <label>
              Shape
              <select
                value={shape}
                onChange={(e) => setShape(e.target.value as SkillShape)}
              >
                {SHAPES.map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>
            </label>

            <div>
              <span className="modal__label">Colour</span>
              <ColorSwatches value={color} onChange={setColor} />
            </div>
          </div>

          <div>
            <span className="modal__label">
              Subskills ({filled.length}) - a skill is completed when all are
              done
            </span>
            <div className="subskill-rows">
              {rows.map((row, i) => (
                <div key={row.id} className="subskill-form-row">
                  <input
                    type="text"
                    placeholder={`Subskill ${i + 1} name`}
                    value={row.name}
                    onChange={(e) =>
                      updateRow(row.id, { name: e.target.value })
                    }
                  />
                  <input
                    type="text"
                    placeholder="Description (optional)"
                    value={row.description}
                    onChange={(e) =>
                      updateRow(row.id, { description: e.target.value })
                    }
                  />
                  <button
                    type="button"
                    onClick={() =>
                      setRows((prev) => prev.filter((r) => r.id !== row.id))
                    }
                    disabled={rows.length === 1}
                    aria-label={`Remove subskill ${i + 1}`}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <button
              type="button"
              onClick={() => setRows((prev) => [...prev, newRow()])}
              disabled={rows.length >= MAX_SUBSKILLS}
            >
              + Add subskill
            </button>
          </div>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={submitting}>
              Cancel
            </button>
            <button type="submit" disabled={!canSubmit}>
              {submitting ? "Saving..." : "Add skill"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
