const API_URL = import.meta.env.VITE_API_URL;

export async function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  const response = await fetch(`${API_URL}/api/products?${query}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch products");
  return data;
}

export async function getProductById(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch product");
  return data;
}

export async function createProduct(productData) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to create product");
  return data;
}

export async function updateProduct(id, productData) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(productData),
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to update product");
  return data;
}

export async function deleteProduct(id) {
  const response = await fetch(`${API_URL}/api/products/${id}`, {
    method: "DELETE",
    credentials: "include",
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to delete product");
  return data;
}

export async function getLowStockProducts(threshold = 5) {
  const response = await fetch(
    `${API_URL}/api/products/alerts/low-stock?threshold=${threshold}`,
    {
      credentials: "include",
    },
  );
  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Failed to fetch alerts");
  return data;
}
