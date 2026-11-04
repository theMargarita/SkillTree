import { useState } from "react";
import { removeSkillConnection } from "../api/skillConnectionApi";

interface RemoveSkillConnectionProps {
  skillBoardId: string;
  skillConnectionId: string;
  onClose: () => void;
  onRemoved: () => void;
}

export default function RemoveSkillConnectionModal({
  skillBoardId,
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
      const remove = await removeSkillConnection(skillConnectionId);
      onRemoved();
    } catch (error) {
      setError(
        error instanceof Error ? error.message : "Could not remove connection",
      );
      setSaving(false);
    }
  }
}
