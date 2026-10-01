//mirror the dtos from backend to track it easier

import type { SkillResponse } from "./skills";
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
