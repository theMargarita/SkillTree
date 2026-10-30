import { jsonInit, request } from "../../../shared/api/Http";

interface SkillConnectionRequest {
  skillBoardId: string;
  fromSkillId: string;
  toSkillId: string;
  lineColor: string;
  lineStyle: string;
}

interface SkillConnectionResponse {
  id: string;
  skillBoardId: string;
  fromSkillId: string;
  toSkillId: string;
}

export function createSkillConnection(data: SkillConnectionRequest) {
  return request<SkillConnectionResponse>(
    `/api/SkillConnection/create`,
    jsonInit("POST", data),
  );
}

export function removeSkillConnection(id: string) {
  return request<void>(`/api/remove/${id}`, { method: "DELETE" });
}
