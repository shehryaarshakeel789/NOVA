const API_URL = import.meta.env.VITE_API_URL;

export async function getRevenueStats() {
  const response = await fetch(`${API_URL}/api/orders/stats/revenue`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch revenue stats");
  return data;
}

export async function getTopProducts() {
  const response = await fetch(`${API_URL}/api/orders/stats/top-products`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch top products");
  return data;
}

export async function getOrdersByStatus() {
  const response = await fetch(`${API_URL}/api/orders/stats/by-status`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch order status stats");
  return data;
}