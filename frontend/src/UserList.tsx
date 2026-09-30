import { useEffect, useState } from "react";
import type { UserResponse } from "./types/user";

const API_URL = import.meta.env.VITE_API_BASE as string;

export default function UsersList() {
  const [users, setUsers] = useState<UserResponse[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`${API_URL}/api/User/getall`)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Request failed: ${res.status}`);
        }
        return res.json() as Promise<UserResponse[]>;
      })
      .then((data) => setUsers(data))
      .catch((err: unknown) => {
        setError(err instanceof Error ? err.message : "Unknown error");
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading users...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <ul>
      {users.map((user) => (
        <li key={user.id}>
          {user.name} - {user.email} - {user.createdAt}
        </li>
      ))}
    </ul>
  );
}
