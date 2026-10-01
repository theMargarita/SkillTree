//responses

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

//-----------------------------

//requests
export interface SubSkillRequest {
  skillId: string;
  name: string;
  desctiption: string;
  progressUrl: string;
  progressText: string;
  orderIndex: number;
  color: string;
  isComplete: boolean;
  completedAt: string; //honestly a bit unsure about this one
}
