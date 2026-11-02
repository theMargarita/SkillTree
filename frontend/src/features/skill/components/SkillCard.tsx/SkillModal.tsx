import { useEffect, useState } from "react";
import type { SkillResponse } from "../../../../shared/types/skills";
import type { SubSkillResponse } from "../../../../shared/types/subskills";
import { getSubSkillsBySkill } from "../../../subskill/api/subskillApi";
import SubSkillDetail from "../../../subskill/component/subskillCard/SubSkillDetailModal";
import SubSkillCard from "../../../subskill/component/subskillCard/SubSkillCard";
import AddSubSkillModal from "../../../subskill/component/AddSubSkillModal";
import ImageLightbox from "../../../../shared/components/ImageLightbox";

interface SkillModalProps {
  skill: SkillResponse;
  onClose: () => void;
  onChanged?: () => void;
  onRemovingRequested: () => void;
}

export default function SkillModal({
  skill,
  onClose,
  onChanged,
  onRemovingRequested,
}: SkillModalProps) {
  const [subSkills, setSubSkills] = useState<SubSkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null); // which subskill's detail is shown
  const [adding, setAdding] = useState(false);
  const [goalImageOpen, setGoalImageOpen] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    getSubSkillsBySkill(skill.id)
      .then((data) => {
        if (!cancelled) setSubSkills(data);
      })
      .catch((err: unknown) => {
        if (!cancelled)
          setLoadError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [skill.id]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key !== "Escape" || adding) return;
      if (openId) setOpenId(null);
      else onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [adding, openId, onClose]);

  const open = subSkills.find((s) => s.id === openId) ?? null;
  const doneCount = subSkills.filter((s) => s.isComplete).length;

  function handleUpdated(updated: SubSkillResponse) {
    setSubSkills((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
    onChanged?.(); // refetch the board so the node's counter and status update
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !adding) onClose(); // click outside closes
      }}
    >
      <div
        className="modal skill-modal"
        role="dialog"
        aria-modal="true"
        aria-label={skill.name}
      >
        <header className="skill-modal__header">
          <h2>{skill.name}</h2>
          {!loading && !loadError && (
            <span className="skill-modal__progress">
              {subSkills.length === 0
                ? "No subskills"
                : `${doneCount}/${subSkills.length} done`}
            </span>
          )}
          <button type="button" onClick={onRemovingRequested}>
            Remove skill
          </button>
          <button type="button" onClick={onClose} aria-label="Close">
            ×
          </button>
        </header>

        {open ? (
          <SubSkillDetail
            subSkill={open}
            onBack={() => setOpenId(null)}
            onUpdated={handleUpdated}
          />
        ) : (
          <>
            {/* the goal: image first, then the text */}
            <section className="skill-modal__goal">
              {skill.imageUrl && (
                <button
                  type="button"
                  className="image-button"
                  onClick={() => setGoalImageOpen(true)}
                  aria-label="Enlarge goal image"
                >
                  <img
                    className="goal-image"
                    src={skill.imageUrl}
                    alt={`Goal: ${skill.name}`}
                    loading="lazy"
                  />
                </button>
              )}
              {skill.description ? (
                <p>{skill.description}</p>
              ) : (
                !skill.imageUrl && (
                  <p className="muted">No goal described yet.</p>
                )
              )}
            </section>

            {loading && <p>Loading subskills...</p>}
            {loadError && <p className="modal__error">Error: {loadError}</p>}

            {!loading && !loadError && (
              <div className="subskill-cards">
                {subSkills.map((s) => (
                  <SubSkillCard key={s.id} subSkill={s} onOpen={setOpenId} />
                ))}
                <button
                  type="button"
                  className="subskill-card subskill-card--add"
                  onClick={() => setAdding(true)}
                >
                  + Add subskill
                </button>
              </div>
            )}
          </>
        )}

        {adding && (
          <AddSubSkillModal
            skillId={skill.id}
            onClose={() => setAdding(false)}
            onCreated={(created) => {
              setSubSkills((prev) => [...prev, created]); 
              setAdding(false);
              onChanged?.();
            }}
          />
        )}

        {goalImageOpen && skill.imageUrl && (
          <ImageLightbox
            src={skill.imageUrl}
            alt={`Goal: ${skill.name}`}
            onClose={() => setGoalImageOpen(false)}
          />
        )}
      </div>
    </div>
  );
}
