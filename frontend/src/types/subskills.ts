// responses

export type ProgressType = "Photo" | "Text" | "PhotoAndText";

export interface SubSkillResponse {
  id: string;
  skillId: string;
  name: string;
  description: string;
  progressURL: string | null;
  progressText: string | null;
  orderIndex: number;
  color: string | null;
  isComplete: boolean;
  completedAt: string | null;
}

export interface ProgressEntryResponse {
  id: string;
  type: ProgressType | null;
  imageUrl: string | null;
  contentText: string | null;
  createdAt: string;
}

//-----------------------------

// requests
export interface SubSkillRequest {
  skillId: string;
  name: string;
  description: string;
  progressURL: string | null;
  progressText: string | null;
  orderIndex: number;
  color: string | null;
}
