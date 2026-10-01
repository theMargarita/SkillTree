//responses
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

//for creating skill directly into board
export interface SkillRequest {
  skillBoardId: string;
  name: string;
  description: string;
  positionX: number;
  positionY: number;
  requiredSubSkillCount: number;
  color: string | null;
  icon: string | null;
  shape: SkillShape;
}
