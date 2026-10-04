import { useEffect, useState } from "react";
import type { SubSkillResponse } from "../types/subskills";

const API_URL = import.meta.env.VITE_API_URL as string;

interface SkillDetailPanelProps {
  skillId: string;
  skillName: string;
  onClose: () => void;
}

export default function SkillDetailPanel({
  skillId,
  skillName,
  onClose,
}: SkillDetailPanelProps) {
  const [subSkills, setSubSkills] = useState<SubSkillResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    fetch(`${API_URL}/api/SubSkill/byskill/${skillId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request falied: ${res.status}`);
        return res.json() as Promise<SubSkillResponse[]>;
      })
      .then(setSubSkills)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unknown error"),
      )
      .finally(() => setLoading(false));
  }, [skillId]);
}
