// src/api/skill/skillApi.ts
import { jsonInit, request } from "../../../shared/api/Http";
import type {
  SkillRequest,
  SkillResponse,
  UpdateSkillPositionRequest,
} from "../../../shared/types/skills";

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

export function updatePosition(id: string, data: UpdateSkillPositionRequest) {
  return request<SkillResponse>(
    `/api/Skill/position/${id}`,
    jsonInit("PATCH", data),
  );
}
