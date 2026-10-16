import type { SkillRequest, SkillResponse } from "../../types/skills";
import { jsonInit, request } from "../board/boardsApi";

export function createSkill(data: SkillRequest) {
  return request<SkillResponse[]>(`/api/Skill/create`, jsonInit("POST", data));
}

export function getAllSkills() {
  return request<SkillResponse[]>(`/api/Skill/getAll`, { method: "GET" });
}

export function removeSkill(id: string) {
  return request<void>(`/api/Skill/remove/${id}`, { method: "DELETE" });
}

export function updateSkill(id: string, data: SkillRequest) {
  return request<SkillResponse>(
    `/api/Skill/update/${id}`,
    jsonInit("PATHC", data),
  );
}
