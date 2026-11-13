import { jsonInit, request } from "../../../shared/api/Http";
import type { SkillRequest, SkillResponse } from "../../../shared/types/skills";

export function createSkill(data: SkillRequest) {
  return request<SkillResponse>(`/api/Skill/create`, jsonInit("POST", data));
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
    jsonInit("PATCH", data),
  );
}

export function updateSkillPosition(
  id: string,
  positionX: number,
  positionY: number,
) {
  return request<SkillResponse>(
    `/api/Skill/position/${id}`,
    jsonInit("PATCH", { positionX, positionY }),
  );
}

export function getSkillImage(skillId: string) {
  return request<{ imageUrl: string | null }>(`/api/Skill/${skillId}/imageUrl`); //not sure what the props name is hehe and a lil lazy to check it out  now
}
