import { jsonInit, request } from "../../../shared/api/Http";
import type { SkillConnectionResponse } from "../../../shared/types/board";

interface SkillConnectionRequest {
  skillBoardId: string;
  fromSkillId: string;
  toSkillId: string;
  lineColor: string;
  lineStyle: string | null;
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
