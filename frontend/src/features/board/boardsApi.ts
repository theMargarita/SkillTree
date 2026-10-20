// src/api/board/boardsApi.ts - now imports the helpers instead of defining them
import { jsonInit, request } from "../../api/Http";
import type { SkillBoardRequest, SkillBoardResponse } from "../../types/board";

export function getBoardsForUser(userId: string) {
  return request<SkillBoardResponse[]>(`/api/SkillBoard/user/${userId}`);
}

export function createBoard(userId: string, data: SkillBoardRequest) {
  return request<SkillBoardResponse>(
    `/api/SkillBoard/user/${userId}/create`,
    jsonInit("POST", data),
  );
}

// Update replaces every field: always send the current description and colour too.
export function updateBoard(id: string, data: SkillBoardRequest) {
  return request<SkillBoardResponse>(
    `/api/SkillBoard/update/${id}`,
    jsonInit("PATCH", data),
  );
}

export function deleteBoard(id: string) {
  return request<void>(`/api/SkillBoard/remove/${id}`, { method: "DELETE" });
}
