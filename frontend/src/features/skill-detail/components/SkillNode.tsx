import type { HTMLAttributes } from "react";
import type { SkillResponse, SkillShape } from "../../../shared/types/skills";

const POLYGONS: Record<Exclude<SkillShape, "Circle">, string> = {
  Square: "8,8 82,8 92,18 92,92 8,92",
  Hexagon: "28,6 72,6 97,50 72,94 28,94 3,50",
  Diamond: "50,2 98,50 50,98 2,50",
};

function Outline({ shape }: { shape: SkillShape }) {
  return shape === "Circle" ? (
    <circle cx="50" cy="50" r="45" />
  ) : (
    <polygon points={POLYGONS[shape]} />
  );
}

function LockIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 24 24"
      fill="currentColor"
      aria-label="Locked"
    >
      <path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2zm-8 0V7a3 3 0 0 1 6 0v2H9z" />
    </svg>
  );
}

interface SkillNodeProps extends Omit<
  HTMLAttributes<HTMLDivElement>,
  "onClick"
> {
  skill: SkillResponse;
  position?: { x: number; y: number };
  justUnlocked?: boolean;
  dragging?: boolean;
  connectTarget?: boolean;
  handleProps?: HTMLAttributes<HTMLSpanElement>;
  dragProps?: HTMLAttributes<HTMLDivElement>;
  onClick?: (skill: SkillResponse) => void;
}

export default function SkillNode({
  skill,
  position,
  justUnlocked,
  dragging,
  connectTarget,
  handleProps,
  dragProps,
  onClick,
  ...rest
}: SkillNodeProps) {
  const x = position?.x ?? skill.positionX;
  const y = position?.y ?? skill.positionY;

  const classes = [
    "skill-node",
    justUnlocked && "skill-node--just-unlocked",
    dragging && "is-dragging",
    connectTarget && "is-connect-target",
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      {...rest}
      {...dragProps}
      className={classes}
      data-skill-id={skill.id}
      data-status={skill.status}
      style={{ left: `${x}px`, top: `${y}px` }}
      onClick={() => onClick?.(skill)}
    >
      <svg className="skill-node__shape" viewBox="0 0 100 100">
        <Outline shape={skill.shape} />
      </svg>

      <div className="skill-node__center">
        {skill.status === "Locked" ? (
          <LockIcon />
        ) : skill.status === "Completed" ? (
          <span>✓</span>
        ) : (
          <span>
            {skill.completedSubSkillCount}/{skill.subSkillCount}
          </span>
        )}
      </div>

      <p className="skill-node__name">{skill.name}</p>

      {handleProps && (
        <span
          {...handleProps}
          className="skill-node__handle"
          onPointerDown={(e) => {
            e.stopPropagation();
            handleProps.onPointerDown?.(e);
          }}
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
          aria-label="Drag to connect to another skill"
        />
      )}
    </div>
  );
}
