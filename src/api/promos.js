const API_URL = import.meta.env.VITE_API_URL;

export async function validatePromo(code, cartTotal) {
  const response = await fetch(`${API_URL}/api/promos/validate`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ code, cartTotal }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to validate promo");
  return data;
}

export async function getPromos() {
  const response = await fetch(`${API_URL}/api/promos`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch promos");
  return data;
}

export async function createPromo(promoData) {
  const response = await fetch(`${API_URL}/api/promos`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(promoData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create promo");
  return data;
}

export async function updatePromo(id, promoData) {
  const response = await fetch(`${API_URL}/api/promos/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(promoData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update promo");
  return data;
}

export async function deletePromo(id) {
  const response = await fetch(`${API_URL}/api/promos/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete promo");
  return data;
}
