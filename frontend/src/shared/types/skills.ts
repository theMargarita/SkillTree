//responses
export type SkillStatus = "Locked" | "Unlocked" | "Completed";

export type SkillShape = "Circle" | "Square" | "Hexagon" | "Diamond";

export interface SkillResponse {
  id: string;
  skillBoardId: string;
  name: string;
  description: string;
  imageUrl: string;
  positionX: number;
  positionY: number;
  subSkillCount: number;
  color: string | null;
  icon: string | null;
  shape: SkillShape;
  createdAt: string;
  updatedAt: string;
  completedSubSkillCount: number;
  status: SkillStatus;
}

//for creating skill directly into board
export interface SkillRequest {
  skillBoardId: string;
  name: string;
  description: string;
  imageUrl: string | null;
  positionX: number;
  positionY: number;
  // subSkillCount: number;
  color: string | null;
  icon: string | null;
  shape: SkillShape;
}

export interface skillPosition {
  x: number; //postion - although it should be obvious
  y: number;
}

export interface DragState {
  id: string;
  pointerId: number;
  startPointer: skillPosition;
  startPos: skillPosition;
  lastPos: skillPosition;
  moved: boolean;
}
