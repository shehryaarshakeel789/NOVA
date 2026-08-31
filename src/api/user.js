const API_URL = import.meta.env.VITE_API_URL;

export async function getUsers() {
  const response = await fetch(`${API_URL}/api/users`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch users");
  return data;
}

export async function updateUserRole(id, role) {
  const response = await fetch(`${API_URL}/api/users/${id}/role`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ role }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update role");
  return data;
}
