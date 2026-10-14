import { useEffect, useState } from "react";
import "../css/skillDetail.css";
import type { SubSkillResponse } from "../types/subskills";
import ProgressEntryForm from "./ProgressEntryFrom";

const API_URL = import.meta.env.VITE_API_BASE as string;

interface SkillDetailPanelProps {
  skillId: string;
  skillName: string;
  onClose: () => void;
  onChanged?: () => void;
}

export default function SkillDetailPanel({
  skillId,
  skillName,
  onClose,
  onChanged,
}: SkillDetailPanelProps) {
  const [subSkills, setSubSkills] = useState<SubSkillResponse[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null); // toggle errors don't hide the list
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setLoadError(null);
    setActionError(null);
    fetch(`${API_URL}/api/SubSkill/byskill/${skillId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<SubSkillResponse[]>;
      })
      .then(setSubSkills)
      .catch((err: unknown) =>
        setLoadError(err instanceof Error ? err.message : "Unknown error"),
      )
      .finally(() => setLoading(false));
  }, [skillId]);

  async function toggleComplete(subSkill: SubSkillResponse) {
    setActionError(null);
    try {
      const res = await fetch(`${API_URL}/api/SubSkill/toggle/${subSkill.id}`, {
        method: "PATCH",
      });

      if (!res.ok) {
        // BadRequest returns plain text (ex.Message), not JSON
        const message = await res.text();
        throw new Error(message || `Request failed: ${res.status}`);
      }

      const updated = (await res.json()) as SubSkillResponse;
      setSubSkills((prev) =>
        prev.map((s) => (s.id === updated.id ? updated : s)),
      );
      onChanged?.(); // refetch the board so counts and lock states update
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unknown error");
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
      {loadError && <p>Error: {loadError}</p>}
      {actionError && <p className="skill-panel__error">{actionError}</p>}

      {!loading && !loadError && (
        <ul className="skill-panel__list">
          {subSkills.map((sub) => (
            <li
              key={sub.id}
              className={`subskill-row ${sub.isComplete ? "is-complete" : ""}`}
            >
              <div className="subskill-row__top">
                <div>
                  <p className="subskill-row__name">{sub.name}</p>
                  {sub.description && (
                    <p className="subskill-row__desc">{sub.description}</p>
                  )}
                </div>
                <button onClick={() => toggleComplete(sub)}>
                  {sub.isComplete ? "Mark incomplete" : "Mark complete"}
                </button>
              </div>
              <ProgressEntryForm subSkillId={sub.id} />
            </li>
          ))}
          {subSkills.length === 0 && <li>No subskills yet.</li>}
        </ul>
      )}
    </aside>
  );
}
