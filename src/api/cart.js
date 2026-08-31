const API_URL = import.meta.env.VITE_API_URL;

export async function getCart() {
  const response = await fetch(`${API_URL}/api/cart`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch cart");
  return data;
}

export async function addToCart(productId, quantity, size) {
  const response = await fetch(`${API_URL}/api/cart`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ productId, quantity, size }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to add to cart");
  return data;
}

export async function updateCartItem(itemId, quantity) {
  const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({ quantity }),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update item");
  return data;
}

export async function removeCartItem(itemId) {
  const response = await fetch(`${API_URL}/api/cart/${itemId}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to remove item");
  return data;
}
