// skill node, skill detail panel
import type { SkillResponse, SkillStatus } from "../types/board";

const STATUS_COLOR: Record<SkillStatus, string> = {
  Locked: "var(--status-locked)",
  Unlocked: "var(--status-unclocked)",
  Completed: "var(--status-complete)",
};

interface SkillNodeProps {
  skill: SkillResponse;
  onClick?: (skill: SkillResponse) => void;
}

export default function SkillNode({ skill, onClick }: SkillNodeProps) {
  return (
    <div
      className="skill-node"
      style={{
        left: `${skill.positionX}px`,
        top: `${skill.positionY}px`,
        ["--mode-accent" as string]: STATUS_COLOR[skill.status],
      }}
      onClick={() => onClick?.(skill)}
    >
      <p className="skill-node__name">{skill.name}</p>
      <span className="skill_node__stat">
        {skill.completedSubSkillCount}/{skill.requiredSubSkillCount}
      </span>
    </div>
  );
}
