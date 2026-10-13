import { useEffect, useState } from "react";
import type { ProgressEntryResponse } from "../types/subskills";

const API_URL = import.meta.env.VITE_API_BASE as string; // one env var everywhere

async function readErrorMessage(
  res: Response,
  fallback: string,
): Promise<string> {
  const text = await res.text();
  return text || fallback;
}

export function useProgressEntries(subSkillId: string) {
  const [entries, setEntries] = useState<ProgressEntryResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetch(`${API_URL}/api/ProgressEntries/bysubskill/${subSkillId}`)
      .then((res) => {
        if (!res.ok) throw new Error(`Request failed: ${res.status}`);
        return res.json() as Promise<ProgressEntryResponse[]>;
      })
      .then(setEntries)
      .catch((err: unknown) =>
        setError(err instanceof Error ? err.message : "Unknown error"),
      )
      .finally(() => setLoading(false));
  }, [subSkillId]);

  async function addEntry(contentText: string) {
    const res = await fetch(`${API_URL}/api/ProgressEntries/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subSkillId, type: "Text", contentText }),
    });

    if (!res.ok) {
      throw new Error(
        await readErrorMessage(res, `Request failed: ${res.status}`),
      );
    }

    const created = (await res.json()) as ProgressEntryResponse;
    setEntries((prev) => [...prev, created]); // list is oldest-first, so append
    return created;
  }

  return { entries, loading, error, addEntry };
}
