//mirror the dtos from backend to track it easier

export type SkillStatus = "Locked" | "Unlocked" | "Completed";

export type SkillShape = "Circle" | "Square" | "Hexagon" | "Diamond";

export interface SkillResponse {
  id: string;
  skillBoardId: string;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  requiredSubSkillCount: number;
  color: string | null;
  icon: string | null;
  shape: SkillShape;
  createdAt: string;
  updatedAt: string;
  completedSubSkillCount: number;
  status: SkillStatus;
}

export interface SkillConnectionResponse {
  id: string;
  skillBoardId: string;
  fromSkillId: string;
  toSkillId: string;
  lineColor: string | null;
  lineStyle: string | null;
}

export interface SkillBoardDetailResponse {
  id: string;
  name: string;
  description: string;
  backgroundColor: string | null;
  createdAt: string;
  updatedAt: string;
  skills: SkillResponse[];
  connections: SkillConnectionResponse[];
}
