const API_URL = import.meta.env.VITE_API_URL;

export async function createOrder(shippingAddress, promoCode) {
  const response = await fetch(`${API_URL}/api/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ shippingAddress, promoCode }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to place order");
  return data;
}

export async function getMyOrders() {
  const response = await fetch(`${API_URL}/api/orders/my`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
  return data;
}

export async function getOrderById(id) {
  const response = await fetch(`${API_URL}/api/orders/${id}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch order");
  return data;
}

export async function getAllOrders() {
  const response = await fetch(`${API_URL}/api/orders`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch orders");
  return data;
}

export async function updateOrderStatus(id, status) {
  const response = await fetch(`${API_URL}/api/orders/${id}/status`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ status }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update order");
  return data;
}

export async function createCheckoutSession(shippingAddress, promoCode) {
  const response = await fetch(
    `${API_URL}/api/orders/create-checkout-session`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ shippingAddress, promoCode }),
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to start checkout");
  return data;
}
