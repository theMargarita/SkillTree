import { jsonInit, request } from "../../../shared/api/Http";
import type { UserResponse } from "../../../shared/types/user";

const KEY = "skilltree.guestUserId";

export async function getGuestId(): Promise<string> {
  const saved = localStorage.getItem(KEY);
  if (saved) return saved;

  const tag = crypto.randomUUID();
  const user = await request<UserResponse>(
    "/api/User/create",
    jsonInit("POST", {
      name: `Guest ${tag.slice(0, 8)}`,
      email: `guest-${tag}@example.com`,
      password: crypto.randomUUID(), // placeholder, not a real password hash
    }),
  );

  localStorage.setItem(KEY, user.id);
  return user.id;
}
