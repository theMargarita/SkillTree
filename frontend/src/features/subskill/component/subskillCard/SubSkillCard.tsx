import type { SubSkillResponse } from "../../../../shared/types/subskills";

interface SubSkillCardProps {
  subSkill: SubSkillResponse;
  onOpen: (id: string) => void;
}

export default function SubSkillCard({ subSkill, onOpen }: SubSkillCardProps) {
  return (
    <button
      type="button"
      className={`subskill-card ${subSkill.isComplete ? "is-complete" : ""}`}
      onClick={() => onOpen(subSkill.id)}
    >
      {subSkill.imageUrl && (
        <img
          className="subskill-card__thumb"
          src={subSkill.imageUrl}
          alt=""
          loading="lazy"
        />
      )}
      <span className="subskill-card__name">{subSkill.name}</span>
      {subSkill.description && (
        <span className="subskill-card__desc">{subSkill.description}</span>
      )}
      <span className="subskill-card__status">
        {subSkill.isComplete ? "✓ Done" : "To do"}
      </span>
    </button>
  );
}
