import { useEffect, useState } from "react";
import type { SkillResponse } from "../../../../shared/types/skills";
import type { SubSkillResponse } from "../../../../shared/types/subskills";
import { getSubSkillsBySkill } from "../../../subskill/api/subskillApi";
import SubSkillDetail from "../../../subskill/component/subskillCard/SubSkillDetailModal";
import SubSkillCard from "../../../subskill/component/subskillCard/SubSkillCard";
import AddSubSkillModal from "../../../subskill/component/AddSubSkillModal";
import ImageLightbox from "../../../../shared/components/ImageLightbox";
import UpdateSkillModal from "../UpdateSkillsModal";
import UpdateSubSkillModal from "../../../subskill/component/UpdateSubSkillModal";
import RemoveSubSkillModal from "../../../subskill/component/RemoveSubSkill";
import { getSkillImage } from "../../api/skillApi";

interface SkillModalProps {
  skill: SkillResponse;
  onClose: () => void;
  onChanged?: () => void;
  onSkillUpdated: (skill: SkillResponse) => void;
  onRemovingRequested: () => void;
}

export default function SkillModal({
  skill,
  onClose,
  onChanged,
  onSkillUpdated,
  onRemovingRequested,
}: SkillModalProps) {
  const [subSkills, setSubSkills] = useState<SubSkillResponse[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [openId, setOpenId] = useState<string | null>(null);
  const [adding, setAdding] = useState(false);
  const [hasImage, setHasImage] = useState(skill.hasImage); // rename if your field is hasImage
  const [goalImage, setGoalImage] = useState<string | null>(null);
  const [imageLoading, setImageLoading] = useState(false); // fetching only
  const [imageFailed, setImageFailed] = useState(false);
  const [imageVersion, setImageVersion] = useState(0);
  const [goalImageOpen, setGoalImageOpen] = useState(false); // lightbox only

  const [editSkill, setEditSkill] = useState<SkillResponse | null>(null);
  const [editingSubSkill, setEditingSubSkill] =
    useState<SubSkillResponse | null>(null);
  const [removingSubSkill, setRemovingSubSkill] =
    useState<SubSkillResponse | null>(null);

  // follow the board data when a different skill (or a fresh copy) arrives
  useEffect(() => {
    setHasImage(skill.hasImage); 
  }, [skill.id, skill.hasImage]); 

  // fetch the image only when the skill has one
  useEffect(() => {
    if (!hasImage) {
      setGoalImage(null);
      setImageLoading(false);
      setImageFailed(false);
      return;
    }
    let cancelled = false;
    setImageLoading(true);
    setImageFailed(false);
    getSkillImage(skill.id)
      .then((r) => {
        if (!cancelled) setGoalImage(r.imageUrl);
      })
      .catch(() => {
        if (!cancelled) {
          setGoalImage(null);
          setImageFailed(true);
        }
      })
      .finally(() => {
        if (!cancelled) setImageLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [skill.id, hasImage, imageVersion]);

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
      if (e.key !== "Escape" || adding || goalImageOpen) return;
      if (openId) setOpenId(null);
      else onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [adding, goalImageOpen, openId, onClose]);

  const open = subSkills.find((s) => s.id === openId) ?? null;
  const doneCount = subSkills.filter((s) => s.isComplete).length;

  function handleUpdated(updated: SubSkillResponse) {
    setSubSkills((prev) =>
      prev.map((s) => (s.id === updated.id ? updated : s)),
    );
    onChanged?.();
  }

  return (
    <div
      className="modal-backdrop"
      onClick={(e) => {
        if (e.target === e.currentTarget && !adding) onClose();
      }}
    >
      <div
        className="modal skill-modal"
        role="dialog"
        aria-modal="true"
        aria-label={skill.name}
      >
        {!open && (
          <header className="skill-modal__header">
            <h2>{skill.name}</h2>

            {!loading && !loadError && (
              <span className="skill-modal__progress">
                {subSkills.length === 0
                  ? "No subskills"
                  : `${doneCount}/${subSkills.length} done`}
              </span>
            )}

            <button
              type="button"
              className="skill-panel__update"
              // saving before the image has loaded would erase it
              disabled={imageLoading}
              onClick={() => setEditSkill(skill)}
            >
              Edit Skill
            </button>

            <button type="button" onClick={onRemovingRequested}>
              Remove skill
            </button>

            <button type="button" onClick={onClose} aria-label="Close">
              ×
            </button>
          </header>
        )}

        {open ? (
          <SubSkillDetail
            subSkill={open}
            onBack={() => setOpenId(null)}
            onUpdated={handleUpdated}
            onEdit={() => setEditingSubSkill(open)}
            onRemove={() => setRemovingSubSkill(open)}
          />
        ) : (
          <>
            {/* the goal: image first, then the text */}
            <section className="skill-modal__goal">
              {hasImage && imageLoading && (
                <div className="goal-image-placeholder">Loading image...</div>
              )}

              {hasImage && imageFailed && (
                <p className="modal__error">Could not load the goal image.</p>
              )}

              {goalImage && (
                <button
                  type="button"
                  className="image-button"
                  onClick={() => setGoalImageOpen(true)}
                  aria-label="Enlarge goal image"
                >
                  <img
                    className="goal-image"
                    src={goalImage}
                    alt={`Goal: ${skill.name}`}
                  />
                </button>
              )}

              {skill.description ? (
                <p>{skill.description}</p>
              ) : (
                !hasImage && <p className="muted">No goal described yet.</p>
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

        {goalImageOpen && goalImage && (
          <ImageLightbox
            src={goalImage}
            alt={`Goal: ${skill.name}`}
            onClose={() => setGoalImageOpen(false)}
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
              setOpenId(null);
              onChanged?.();
            }}
          />
        )}

        {editSkill && (
          <UpdateSkillModal
            skillId={editSkill.id}
            boardId={editSkill.skillBoardId}
            initialName={editSkill.name}
            initialDescription={editSkill.description}
            newImageURL={goalImage} // the loaded image, not the board data
            newPositionX={editSkill.positionX}
            newPositionY={editSkill.positionY}
            newColor={editSkill.color}
            icon={editSkill.icon}
            shape={editSkill.shape}
            onClose={() => setEditSkill(null)}
            onUpdate={(updated) => {
              setEditSkill(null);
              setHasImage(updated.hasImage); // rename if your field is hasImage
              setImageVersion((v) => v + 1); // fetch the new image
              onSkillUpdated(updated);
              onChanged?.();
            }}
          />
        )}

        {editingSubSkill && (
          <UpdateSubSkillModal
            subSkillId={editingSubSkill.id}
            skillId={editingSubSkill.skillId}
            initialName={editingSubSkill.name}
            initialDescription={editingSubSkill.description}
            initialOrderIndex={editingSubSkill.orderIndex}
            initialProgressText={editingSubSkill.progressText}
            initialProgressURL={editingSubSkill.progressURL}
            initialColor={editingSubSkill.color}
            onClose={() => setEditingSubSkill(null)}
            onUpdate={(updated) => {
              handleUpdated(updated);
              setEditingSubSkill(null);
            }}
          />
        )}
      </div>
    </div>
  );
}
