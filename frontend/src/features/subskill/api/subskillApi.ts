import { jsonInit, request } from "../../../shared/api/Http";
import type { SubSkillResponse, SubSkillRequest } from "../../../shared/types/subskills";

export function createSubSkill(data: SubSkillRequest) {
  return request<SubSkillResponse>(
    `/api/SubSkill/create`,
    jsonInit("POST", data),
  );
}

export function removeSubSkill(id: string) {
  return request<void>(`/api/SubSkill/remove/${id}`, { method: "DELETE" });
}

export function updateSubskill(id: string, data: SubSkillRequest) {
  return request<SubSkillResponse>(
    `/api/SubSkill/update/${id}`,
    jsonInit("PATCH", data),
  );
}
