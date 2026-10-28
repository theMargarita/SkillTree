import type { CSSProperties, HTMLAttributes } from "react";
import type {
  skillPosition,
  SkillResponse,
  SkillStatus,
} from "../../../shared/types/skills";

const STATUS_COLOR: Record<SkillStatus, string> = {
  Locked: "var(--status-locked)",
  Unlocked: "var(--status-unlocked)",
  Completed: "var(--status-completed)",
};

interface SkillNodeProps {
  skill: SkillResponse;
  position: skillPosition;
  drag?: boolean;
  dragProps?: HTMLAttributes<HTMLDivElement>;
  shouldIgnoreClick?: () => boolean;
  onClick?: (skill: SkillResponse) => void;
}

export default function SkillNode({
  skill,
  position,
  drag = false,
  dragProps,
  shouldIgnoreClick,
  onClick,
}: SkillNodeProps) {
  const style = {
    left: `${position}px`,
    top: `${position}px`,
    "--node-accent": skill.color ?? STATUS_COLOR[skill.status],
    // backgroundColor: skill.color ?? "#1f2227",
  } as CSSProperties;

  return (
    <div
      className={`skill-node ${drag ? "is-dragging" : ""}`}
      style={style}
      {...dragProps}
      onClick={() => {
        if (shouldIgnoreClick?.()) return;
        onClick?.(skill);
      }}
    >
      {/* <div className="skill-node" style={style} onClick={() => onClick?.(skill)}> */}
      <p className="skill-node__name">{skill.name}</p>
      <span className="skill-node__stat">
        {skill.subSkillCount === 0
          ? "No subskills"
          : `${skill.completedSubSkillCount}/${skill.subSkillCount}`}
      </span>
    </div>
  );
}
