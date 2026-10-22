import { API_URL } from "../config";

// The backend returns errors either as ProblemDetails JSON (validation) or plain text.
export async function readError(res: Response): Promise<string> {
  const text = await res.text();
  try {
    const body = JSON.parse(text);
    if (body?.errors) return Object.values(body.errors).flat().join(" ");
    if (body?.title) return body.title;
  } catch {
    // not JSON: fall through to the plain text
  }
  return text || `Request failed: ${res.status}`;
}

export async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;
  const res = await fetch(url, init);
  if (!res.ok) throw new Error(await readError(res));
  if (res.status === 204) return undefined as T; // delete returns no body
  return (await res.json()) as T;
}

export const jsonInit = (method: string, body: unknown): RequestInit => ({
  method,
  headers: { "Content-Type": "application/json" },
  body: JSON.stringify(body),
});
