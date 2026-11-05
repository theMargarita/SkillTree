import { useState } from "react";
import type { SkillConnectionResponse } from "../../../shared/types/board";
import { createSkillConnection } from "../api/skillConnectionApi";

interface AddSkillConnectionProps {
  skillBoardId: string;
  fromSkillId: string;
  toSkillId: string;
  onClose: () => void;
  onConnected: (connected: SkillConnectionResponse) => void;
}

export default function AddSkillConnectionModal({
  skillBoardId,
  fromSkillId,
  toSkillId,
  onClose,
  onConnected,
}: AddSkillConnectionProps) {
  const [lineColor, setLineColor] = useState("#3a3d42");
  const [lineStyle, setLineStyle] = useState("solid");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      const connection = await createSkillConnection({
        skillBoardId,
        fromSkillId,
        toSkillId,
        lineColor,
        lineStyle,
      });

      onConnected(connection);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Could not create connection",
      );
      setSaving(false);
    }
  }

  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true">
        <h2>Connect skills</h2>

        <form onSubmit={handleSubmit} className="modal__form">
          <label>
            Line colour
            <input
              type="color"
              value={lineColor}
              onChange={(e) => setLineColor(e.target.value)}
            />
          </label>

          <label>
            Line style
            <select
              value={lineStyle}
              onChange={(e) => setLineStyle(e.target.value)}
            >
              <option value="solid">Solid</option>
              <option value="dashed">Dashed</option>
            </select>
          </label>

          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Connecting..." : "Connect"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
