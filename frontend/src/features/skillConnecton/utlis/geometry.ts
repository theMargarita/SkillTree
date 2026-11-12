import type { skillPosition } from "../../../shared/types/skills";

export const NODE_HALF_WIDTH = 48;
export const NODE_HALF_HEIGHT = 48;

/**
 * The point where a straight line from `from` centre towards `toward` leaves the node's box.
 * Lines are drawn centre to centre, so without this the arrowhead would sit hidden behind
 * the target node. The box is an approximation: a node with a long, wrapping name is taller.
 */

export function edgePoint(
  from: skillPosition,
  to: skillPosition,
  gap = 4,
): skillPosition {
  const dx = to.x - from.x;
  const dy = to.y - from.y;
  if (dx === 0 && dy === 0) return from;

  const tx = dx === 0 ? Infinity : (NODE_HALF_WIDTH + gap) / Math.abs(dx);
  const ty = dy === 0 ? Infinity : (NODE_HALF_HEIGHT + gap) / Math.abs(dy);

  //never past the midpoint: overlapping nodes give zero length line instead of a crossed on
  const t = Math.min(tx, ty, 0.5);

  return { x: from.x + dx * t, y: from.y + dy * t };
}

export function connectionPath(from: skillPosition, to: skillPosition): string {
  const horizontalDistance = Math.abs(to.x - from.x);
  const bend = Math.max(50, horizontalDistance * 0.45);
  const direction = to.x >= from.x ? 1 : -1;

  const c1 = {
    x: from.x + bend * direction,
    y: from.y,
  };

  const c2 = {
    x: to.x - bend * direction,
    y: to.y,
  };

  return `M ${from.x} ${from.y} 
  C ${c1.x} ${c1.y}, ${c2.x} ${c2.y}, ${to.x} ${to.y}`;
}
