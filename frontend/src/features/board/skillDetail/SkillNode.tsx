import type { CSSProperties } from "react";
import type { SkillResponse, SkillStatus } from "../../types/skills";

const STATUS_COLOR: Record<SkillStatus, string> = {
  Locked: "var(--status-locked)",
  Unlocked: "var(--status-unlocked)",
  Completed: "var(--status-completed)",
};

interface SkillNodeProps {
  skill: SkillResponse;
  onClick?: (skill: SkillResponse) => void;
}

export default function SkillNode({ skill, onClick }: SkillNodeProps) {
  const style = {
    left: `${skill.positionX}px`,
    top: `${skill.positionY}px`,
    "--node-accent": STATUS_COLOR[skill.status],
  } as CSSProperties;

  return (
    <div className="skill-node" style={style} onClick={() => onClick?.(skill)}>
      <p className="skill-node__name">{skill.name}</p>
      <span className="skill-node__stat">
        {skill.completedSubSkillCount}/{skill.requiredSubSkillCount}
      </span>
    </div>
  );
}
