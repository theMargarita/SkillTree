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
  connectTarget?: boolean; //a connection is being dragged and the pointer is over this node
  handleProps?: HTMLAttributes<HTMLSpanElement>;
  dragProps?: HTMLAttributes<HTMLDivElement>;
  shouldIgnoreClick?: () => boolean;
  onClick?: (skill: SkillResponse) => void;
}

export default function SkillNode({
  skill,
  position,
  drag = false,
  connectTarget = false,
  handleProps,
  dragProps,
  shouldIgnoreClick,
  onClick,
}: SkillNodeProps) {
  const style = {
    left: `${position.x}px`,
    top: `${position.y}px`,
    "--node-accent": skill.color ?? STATUS_COLOR[skill.status],
    backgroundColor: skill.color ?? "#1f2227", //hmmmmm
  } as CSSProperties;

  return (
    <div
      data-skill-id={skill.id}
      //lock skill part
      className={`skill-node skill-node--${skill.shape.toLowerCase()} ${
        skill.status === "Locked" ? "is-locked" : ""
      } ${drag ? "is-dragging" : ""} ${
        connectTarget ? "is-connect-target" : ""
      }`}
      style={style}
      {...dragProps}
      onClick={() => {
        if (shouldIgnoreClick?.() || skill.status === "Locked") return;
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
      <span
        className="skill-node__handle"
        title="Drag to another skill to connect"
        {...handleProps}
        onClick={(e) => e.stopPropagation()} // releasing on the handle must not open the skill
      />
      {/* {(["top", "right", "bottom", "left"] as const).map((side) => (
        <span
          key={side}
          className={`skill-node__connect-zone skill-node__connect-zone--${side}`}
          title="Drag to connect this skill"
          aria-label="Drag to connect this skill"
          {...handleProps}
          onClick={(e) => e.stopPropagation()}
        />
      ))} */}
      {skill.status !== "Locked" &&
        (["top", "right", "bottom", "left"] as const).map((side) => (
          <span
            key={side}
            className={`skill-node__connect-zone skill-node__connect-zone--${side}`}
            title="Drag to connect this skill"
            aria-label="Drag to connect this skill"
            {...handleProps}
            onClick={(e) => e.stopPropagation()}
          />
        ))}
    </div>
  );
}
