import { jsonInit, request } from "../../shared/api/Http";
import type { UserRequest, UserResponse } from "../../shared/types/user";

export function createUser(data: UserRequest) {
  return request<UserResponse>(`/api/User/create`, jsonInit("POST", data));
}
