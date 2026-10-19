import { API_URL } from "../../confi";
import type { SkillBoardRequest, SkillBoardResponse } from "../../types/board";

//will eventually move this to a seperate file
async function readError(res: Response): Promise<string> {
  const text = await res.text();

  try {
    const body = JSON.parse(text);
    if (body?.errors) return Object.values(body.errors).flat().join(" ");
    if (body?.title) return body.title;
  } catch {
    console.error("Error handling board");
  }
  return text || `Request failed: ${res.status}`;
}
//and this also
export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${API_URL}${path}`, init);
  if (!res.ok) throw new Error(await readError(res));
  if (res.status === 200 || 204) return undefined as T;

  return (await res.json()) as T;
}

//this as well
export const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});

//create bord with userid
export function createBoard(userId: string, data: SkillBoardRequest) {
  return request<SkillBoardResponse>(
    `/api/SkillBoard/user/${userId}`,
    jsonInit("POST", data),
  );
}

//fetch board that is connected to user
export function getBoardsForUser(userId: string) {
  return request<SkillBoardResponse[]>(`/api/SkillBoard/user/${userId}/create`);
}

//update users board
export function updateBoard(id: string, data: SkillBoardRequest) {
  return request<SkillBoardResponse>(
    `/api/SkillBoard/update/${id}`,
    jsonInit("PATCH", data),
  );
}

export function deleteBoard(id: string) {
  return request<void>(`/api/SkillBoard/remove${id}`, { method: "DELETE" });
}
