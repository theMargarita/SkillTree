import { useEffect, useState } from "react";
import "../styles/skill-detail.css";
import type { SubSkillResponse } from "../../../shared/types/subskills";
import ProgressEntryForm from "../../progress/components/ProgressEntryForm";
import AddSubSkillModal from "../../subskill/component/AddSubSkillModal";
import RemoveSubSkillModal from "../../subskill/component/RemoveSubSkill";

const API_URL = import.meta.env.VITE_API_BASE as string;

interface SkillDetailPanelProps {
  skillId: string;
  skillName: string;
  onClose: () => void;
  onChanged?: () => void;
  onRemovingRequested: () => void;
}

export default function SkillDetailPanel({
  skillId,
  skillName,
  onClose,
  onChanged,
  onRemovingRequested,
}: SkillDetailPanelProps) {
  const [subSkills, setSubSkills] = useState<SubSkillResponse[]>([]);
  const [addingSubSkill, setAddingSubskill] = useState(false);
  const [removingSubSkill, setRemovingSubSkill] =
    useState<SubSkillResponse | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
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
        const message = await res.text();
        throw new Error(message || `Request failed: ${res.status}`);
      }

      const updated = (await res.json()) as SubSkillResponse;
      setSubSkills((previous) =>
        previous.map((skill) => (skill.id === updated.id ? updated : skill)),
      );
      onChanged?.();
    } catch (err) {
      setActionError(err instanceof Error ? err.message : "Unknown error");
    }
  }

  return (
    <aside className="skill-panel">
      <div className="skill-panel__header">
        <h2>{skillName}</h2>
        <button
          type="button"
          className="skill-panel__remove"
          onClick={onRemovingRequested}
        >
          Remove Skill
        </button>
        <button type="button" onClick={() => setAddingSubskill(true)}>
          Add subskill
        </button>
        <button
          type="button"
          className="skill-panel__close"
          onClick={onClose}
          aria-label="Close"
        >
          X
        </button>
      </div>

      {loading && <p>Loading subskills...</p>}
      {loadError && <p>Error: {loadError}</p>}
      {actionError && <p className="skill-panel__error">{actionError}</p>}

      {!loading && !loadError && (
        // a fragment: JSX must return ONE parent, and the list and the button are siblings
        <>
          <ul className="skill-panel__list">
            {subSkills.map((subSkill) => (
              <li key={subSkill.id}>
                <div className="subskill-row__top">
                  <div>
                    <p className="subskill-row__name">{subSkill.name}</p>
                    {subSkill.description && (
                      <p className="subskill-row__desc">
                        {subSkill.description}
                      </p>
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={() => toggleComplete(subSkill)}
                  >
                    {subSkill.isComplete ? "Mark incomplete" : "Mark complete"}
                  </button>

                  <button
                    type="button"
                    onClick={() => setRemovingSubSkill(subSkill)}
                  >
                    X
                  </button>
                </div>

                <ProgressEntryForm subSkillId={subSkill.id} />
              </li>
            ))}
            {subSkills.length === 0 && <li>No subskills yet.</li>}
          </ul>
        </>
      )}

      {addingSubSkill && (
        <AddSubSkillModal
          skillId={skillId}
          onClose={() => setAddingSubskill(false)}
          onCreated={(created) => {
            setSubSkills((prev) => [...prev, created]); // server puts it last, so appending matches
            setAddingSubskill(false);
            onChanged?.(); // refetch the board: the node's counter and status change
          }}
        />
      )}
      {removingSubSkill && (
        <RemoveSubSkillModal
          subSkillId={removingSubSkill.id}
          subSkillName={removingSubSkill.name}
          onClose={() => setRemovingSubSkill(null)}
          onRemoved={() => {
            setSubSkills((previous) =>
              previous.filter(
                (subSkill) => subSkill.id !== removingSubSkill.id,
              ),
            );
            setRemovingSubSkill(null);
            onChanged?.(); // refetch the board: the node's counter and status change
          }}
        />
      )}
    </aside>
  );
}
