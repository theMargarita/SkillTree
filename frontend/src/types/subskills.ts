export type ProgressType = "Photot" | "Text" | "Photo and Text";

export interface SubSkillResponse {
  id: string;
  skillsId: string;
  name: string;
  description: string;
  progressrlL: string;
  progressText: string;
  progressEntry: ProgressEntryResponse[]; //new list to progressentry
  orderIndex: number;
  color: string;
  isComplete: boolean;
  completedAt: string;
}

export interface ProgressEntryResponse {
  id: string;
  type: ProgressType;
  imageUrl: string;
  conentText: string;
  createdAt: string;
}
