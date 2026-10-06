import { useEffect, useState } from "react";
import type { SubSkillResponse } from "../types/subskills";
import "../css/skillDetail.css";

const API_URL = import.meta.env.VITE_API_BASE as string;

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
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<SubSkillResponse[]>;
      })
      .then(setSubSkills)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unknown error"),
      )
      .finally(() => setLoading(false));
  }, [skillId]);

  async function toggleComplete(subSkill: SubSkillResponse) {
    const action = subSkill.isComplete ? "incomplete" : "complete";

    try {
      const res = await fetch(
        `${API_URL}/api/SubSkill/${action}/${subSkill.id}`,
        {
          method: "PATCH",
        },
      );
      if (!res.ok) throw new Error(`Request failed: ${res.status}`);

      const updated = (await res.json()) as SubSkillResponse;
      // Replace just the one subskill that changed, rather than refetching the whole list.
      setSubSkills((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <aside className="skill-panel">
      <div className="skill-panel__header">
        <h2>{skillName}</h2>
        <button
          className="skill-panel__close"
          onClick={onClose}
          aria-label="Close"
        >
          ×
        </button>
      </div>

      {loading && <p>Loading subskills...</p>}
      {error && <p>Error: {error}</p>}

      {!loading && !error && (
        <ul className="skill-panel__list">
          {subSkills.map((sub) => (
            <li
              key={sub.id}
              className={`subskill-row ${sub.isComplete ? "is-complete" : ""}`}
            >
              <div>
                <p className="subskill-row__name">{sub.name}</p>
                {sub.description && (
                  <p className="subskill-row__desc">{sub.description}</p>
                )}
              </div>
              <button onClick={() => toggleComplete(sub)}>
                {sub.isComplete ? "Mark incomplete" : "Mark complete"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  );
}
