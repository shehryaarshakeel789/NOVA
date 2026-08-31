const API_URL = import.meta.env.VITE_API_URL;

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API_URL}/api/upload`, {
    method: "POST",
    credentials: "include",
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.message || "Upload failed");
  return data.url;
}
