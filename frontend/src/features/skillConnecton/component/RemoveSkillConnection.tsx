import { useState } from "react";
import { removeSkillConnection } from "../api/skillConnectionApi";

interface RemoveSkillConnectionProps {
  skillConnectionId: string;
  onClose: () => void;
  onRemoved: () => void;
}

export default function RemoveSkillConnectionModal({
  skillConnectionId,
  onClose,
  onRemoved,
}: RemoveSkillConnectionProps) {
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      await removeSkillConnection(skillConnectionId);
      onRemoved();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not remove connection",
      );
      setSaving(false);
    }
  }
  return (
    <div className="modal-backdrop">
      <div className="modal" role="dialog" aria-modal="true">
        <h2>Remove connection?</h2>
        <p>This will disconnect the two skills.</p>

        <form onSubmit={handleSubmit} className="modal__form">
          {error && <p className="modal__error">{error}</p>}

          <div className="modal__actions">
            <button type="button" onClick={onClose} disabled={saving}>
              Cancel
            </button>
            <button type="submit" disabled={saving}>
              {saving ? "Removing..." : "Remove connection"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
